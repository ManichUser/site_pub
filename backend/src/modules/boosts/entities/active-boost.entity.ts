import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Boost } from './boost.entity';

@Entity('active_boosts')
export class ActiveBoost extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Boost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boost_id' })
  boost: Boost;

  @Column({ name: 'boost_id' })
  boostId: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;
}
