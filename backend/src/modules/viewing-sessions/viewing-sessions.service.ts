import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewingSession } from './entities/viewing-session.entity';
import { AdsService } from '../ads/ads.service';
import { EarningsService } from '../earnings/earnings.service';
import { CreateViewingSessionDto } from './dto/create-viewing-session.dto';

// Tolérance : la vidéo doit être vue à au moins 90% de sa durée réelle.
const MIN_WATCH_RATIO = 0.9;

@Injectable()
export class ViewingSessionsService {
  constructor(
    @InjectRepository(ViewingSession)
    private readonly sessionsRepository: Repository<ViewingSession>,
    private readonly adsService: AdsService,
    private readonly earningsService: EarningsService,
  ) {}

  /**
   * Enregistre un visionnage et déclenche le calcul de gain si le visionnage
   * est jugé valide.
   *
   * ANTI-FRAUDE (MVP) :
   * - vérifie que le temps déclaré correspond à une part suffisante de la
   *   durée réelle de la vidéo.
   * TODO (à renforcer avant mise en production, cf. cahier des charges) :
   * - détection d'changement d'onglet/app en arrière-plan (côté client +
   *   heartbeat serveur),
   * - détection de comptes multiples (device fingerprint, IP, numéro
   *   mobile money partagés),
   * - limitation de fréquence globale par IP/compte (Redis).
   */
  async recordSession(
    userId: string,
    dto: CreateViewingSessionDto,
    ipAddress: string | null,
  ): Promise<{ session: ViewingSession; gained: number }> {
    const ad = await this.adsService.findById(dto.adId);

    const minRequiredSeconds = Math.floor(ad.durationSeconds * MIN_WATCH_RATIO);
    const isValid = dto.watchedSeconds >= minRequiredSeconds;

    if (!isValid) {
      const invalidSession = this.sessionsRepository.create({
        userId,
        adId: ad.id,
        watchedSeconds: dto.watchedSeconds,
        valid: false,
        invalidReason: 'Durée de visionnage insuffisante',
        ipAddress,
        deviceFingerprint: dto.deviceFingerprint ?? null,
      });
      await this.sessionsRepository.save(invalidSession);
      throw new BadRequestException(
        'Visionnage invalide : durée insuffisante',
      );
    }

    await this.adsService.incrementViews(ad.id);

    const { gained } = await this.earningsService.processVideoWatched(userId);

    const session = this.sessionsRepository.create({
      userId,
      adId: ad.id,
      watchedSeconds: dto.watchedSeconds,
      valid: true,
      gainGenerated: gained,
      ipAddress,
      deviceFingerprint: dto.deviceFingerprint ?? null,
    });
    await this.sessionsRepository.save(session);

    return { session, gained };
  }

  findByUser(userId: string): Promise<ViewingSession[]> {
    return this.sessionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
