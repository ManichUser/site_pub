import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Palier de gain : nombre de vidéos requises -> montant gagné.
 * Configurable par l'administration (barème évolutif sans redéploiement).
 */
@Entity('gain_tiers')
export class GainTier extends BaseEntity {
  @Column('int')
  nbVideosRequired: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ default: true })
  active: boolean;
}
