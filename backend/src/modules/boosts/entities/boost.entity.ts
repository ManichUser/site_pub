import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum BoostType {
  MULTIPLIER = 'multiplier', // multiplie le gain par vidéo/palier
  EFFORT_REDUCER = 'effort_reducer', // réduit le nb de vidéos requis
}

@Entity('boosts')
export class Boost extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: BoostType })
  type: BoostType;

  @Column('decimal', { precision: 6, scale: 2 })
  effectValue: number; // ex: 1.5 = x1.5, ou 0.5 = -50% de vidéos requises

  @Column('int')
  durationHours: number;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ default: true })
  active: boolean;
}
