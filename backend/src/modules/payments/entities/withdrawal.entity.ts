import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum MobileMoneyOperator {
  ORANGE_MONEY = 'orange_money',
  MTN_MOMO = 'mtn_momo',
  OTHER = 'other',
}

@Entity('withdrawals')
export class Withdrawal extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: MobileMoneyOperator })
  operator: MobileMoneyOperator;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  // Référence renvoyée par l'agrégateur de paiement (CinetPay, PawaPay, etc.)
  @Column({ type: 'varchar', nullable: true })
  providerReference: string | null;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason: string | null;
}
