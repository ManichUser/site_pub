import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boost } from './entities/boost.entity';
import { ActiveBoost } from './entities/active-boost.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class BoostsService {
  constructor(
    @InjectRepository(Boost)
    private readonly boostsRepository: Repository<Boost>,
    @InjectRepository(ActiveBoost)
    private readonly activeBoostsRepository: Repository<ActiveBoost>,
    private readonly usersService: UsersService,
  ) {}

  findAvailable(): Promise<Boost[]> {
    return this.boostsRepository.find({ where: { active: true } });
  }

  create(data: Partial<Boost>): Promise<Boost> {
    return this.boostsRepository.save(this.boostsRepository.create(data));
  }

  findActiveForUser(userId: string): Promise<ActiveBoost[]> {
    return this.activeBoostsRepository.find({
      where: { userId },
      order: { endDate: 'DESC' },
    });
  }

  /**
   * Achat d'un boost via le solde de gains disponible.
   * NOTE : l'achat via mobile money direct (sans passer par le solde) est
   * un point à valider avec le porteur de projet — cf. cahier des charges.
   */
  async purchaseWithBalance(
    userId: string,
    boostId: string,
  ): Promise<ActiveBoost> {
    const boost = await this.boostsRepository.findOne({
      where: { id: boostId, active: true },
    });
    if (!boost) throw new NotFoundException('Boost introuvable ou inactif');

    try {
      await this.usersService.adjustBalance(userId, -Number(boost.price));
    } catch {
      throw new BadRequestException('Solde insuffisant pour ce boost');
    }

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + boost.durationHours * 60 * 60 * 1000,
    );

    const activeBoost = this.activeBoostsRepository.create({
      userId,
      boostId: boost.id,
      startDate,
      endDate,
    });
    return this.activeBoostsRepository.save(activeBoost);
  }
}
