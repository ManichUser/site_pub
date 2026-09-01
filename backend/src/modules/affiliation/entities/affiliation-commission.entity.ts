import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('affiliation_commissions')
export class AffiliationCommission extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parrain_id' })
  parrain: User;

  @Column({ name: 'parrain_id' })
  parrainId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filleul_id' })
  filleul: User;

  @Column({ name: 'filleul_id' })
  filleulId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 12, scale: 2 })
  sourceGainAmount: number;
}
