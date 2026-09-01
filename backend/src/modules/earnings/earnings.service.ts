import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GainTier } from './entities/gain-tier.entity';
import { UsersService } from '../users/users.service';
import { AffiliationService } from '../affiliation/affiliation.service';

@Injectable()
export class EarningsService {
  constructor(
    @InjectRepository(GainTier)
    private readonly gainTiersRepository: Repository<GainTier>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AffiliationService))
    private readonly affiliationService: AffiliationService,
    private readonly configService: ConfigService,
  ) {}

  async getActiveTier(): Promise<GainTier | null> {
    return this.gainTiersRepository.findOne({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  create(data: Partial<GainTier>): Promise<GainTier> {
    return this.gainTiersRepository.save(this.gainTiersRepository.create(data));
  }

  findAll(): Promise<GainTier[]> {
    return this.gainTiersRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Appelé après chaque visionnage validé. Incrémente le compteur de
   * l'utilisateur et, si le palier configuré est atteint, crédite le gain
   * (dans la limite du plafond journalier) puis déclenche la commission
   * d'affiliation éventuelle.
   *
   * NOTE : le multiplicateur/réducteur de "boost" actif n'est pas encore
   * appliqué ici — à brancher une fois le module boosts finalisé avec le
   * porteur de projet (cf. points à valider dans le cahier des charges).
   */
  async processVideoWatched(userId: string): Promise<{ gained: number }> {
    const tier = await this.getActiveTier();
    if (!tier) {
      return { gained: 0 };
    }

    const pendingCount = await this.usersService.incrementPendingVideos(
      userId,
    );

    if (pendingCount < tier.nbVideosRequired) {
      return { gained: 0 };
    }

    const dailyCap =
      this.configService.get<number>('business.dailyGainCapPerUser') ??
      Number(tier.amount);
    const gained = await this.usersService.creditVideoGain(
      userId,
      Number(tier.amount),
      Number(dailyCap),
    );

    if (gained > 0) {
      await this.affiliationService.recordCommissionIfApplicable(
        userId,
        gained,
      );
    }

    return { gained };
  }
}
