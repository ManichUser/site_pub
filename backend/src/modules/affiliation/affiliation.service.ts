import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AffiliationCommission } from './entities/affiliation-commission.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AffiliationService {
  constructor(
    @InjectRepository(AffiliationCommission)
    private readonly commissionsRepository: Repository<AffiliationCommission>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Si le filleul (userId) a un parrain, crédite la commission d'affiliation
   * calculée sur le gain "vidéo" généré. Taux par défaut configurable
   * (business.affiliationCommissionRate) — cf. points à valider avec le
   * porteur de projet sur la portée exacte (uniquement gains vidéos ou aussi
   * gains issus des boosts, un seul niveau ou plusieurs niveaux N2/N3).
   */
  async recordCommissionIfApplicable(
    filleulId: string,
    sourceGainAmount: number,
  ): Promise<void> {
    const filleul = await this.usersService.findById(filleulId);
    if (!filleul.referrer) {
      return;
    }

    const rate =
      this.configService.get<number>('business.affiliationCommissionRate') ??
      0;
    const commissionAmount = sourceGainAmount * rate;

    if (commissionAmount <= 0) return;

    await this.usersService.adjustBalance(
      filleul.referrer.id,
      commissionAmount,
    );

    const commission = this.commissionsRepository.create({
      parrainId: filleul.referrer.id,
      filleulId: filleul.id,
      amount: commissionAmount,
      sourceGainAmount,
    });
    await this.commissionsRepository.save(commission);
  }

  findByParrain(parrainId: string): Promise<AffiliationCommission[]> {
    return this.commissionsRepository.find({
      where: { parrainId },
      order: { createdAt: 'DESC' },
    });
  }
}
