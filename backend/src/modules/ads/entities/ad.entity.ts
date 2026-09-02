import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum AdStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

@Entity('ads')
export class Ad extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  advertiserName: string | null;

  @Column()
  videoUrl: string;

  @Column('int')
  durationSeconds: number;

  @Column({
    type: 'enum',
    enum: AdStatus,
    default: AdStatus.DRAFT,
  })
  status: AdStatus;

  @Column('int', { default: 0 })
  priority: number;

  @Column('int', { default: 0 })
  totalViews: number;
}
