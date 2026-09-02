import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Ad } from '../../ads/entities/ad.entity';

@Entity('viewing_sessions')
export class ViewingSession extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Ad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ name: 'ad_id' })
  adId: string;

  @Column('int')
  watchedSeconds: number;

  @Column({ default: true })
  valid: boolean;

  @Column({ type: 'varchar', nullable: true })
  invalidReason: string | null;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  gainGenerated: number;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'varchar', nullable: true })
  deviceFingerprint: string | null;
}
