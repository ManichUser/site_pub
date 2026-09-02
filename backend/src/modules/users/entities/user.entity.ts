import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';

export enum KycStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ unique: true })
  phone: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ select: false })
  passwordHash: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @Index({ unique: true })
  @Column({ unique: true })
  referralCode: string;

  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  @JoinColumn({ name: 'referrer_id' })
  referrer: User | null;

  @OneToMany(() => User, (user) => user.referrer)
  referrals: User[];

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.NOT_SUBMITTED,
  })
  kycStatus: KycStatus;

  @Column({ default: false })
  isSuspended: boolean;

  @Column({ type: 'varchar', nullable: true })
  lastLoginIp: string | null;

  @Column({ type: 'varchar', nullable: true })
  deviceFingerprint: string | null;

  // Compteur de vidéos vues depuis le dernier palier de gain atteint
  @Column('int', { default: 0 })
  pendingVideoCount: number;

  // Cumul des gains "vidéos" du jour, pour appliquer le plafond anti-abus
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  gainsToday: number;

  @Column({ type: 'date', nullable: true })
  gainsTodayDate: string | null;
}
