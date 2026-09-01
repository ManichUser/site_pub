import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad, AdStatus } from './entities/ad.entity';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adsRepository: Repository<Ad>,
  ) {}

  findActiveForUser(): Promise<Ad[]> {
    return this.adsRepository.find({
      where: { status: AdStatus.ACTIVE },
      order: { priority: 'DESC' },
    });
  }

  async findById(id: string): Promise<Ad> {
    const ad = await this.adsRepository.findOne({ where: { id } });
    if (!ad) throw new NotFoundException('Publicité introuvable');
    return ad;
  }

  create(data: Partial<Ad>): Promise<Ad> {
    return this.adsRepository.save(this.adsRepository.create(data));
  }

  async update(id: string, data: Partial<Ad>): Promise<Ad> {
    const ad = await this.findById(id);
    Object.assign(ad, data);
    return this.adsRepository.save(ad);
  }

  async incrementViews(id: string): Promise<void> {
    await this.adsRepository.increment({ id }, 'totalViews', 1);
  }
}
