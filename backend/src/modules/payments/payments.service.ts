import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Withdrawal,
  WithdrawalStatus,
} from './entities/withdrawal.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalsRepository: Repository<Withdrawal>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async requestWithdrawal(
    userId: string,
    dto: CreateWithdrawalDto,
  ): Promise<Withdrawal> {
    const user = await this.usersService.findById(userId);
    const minAmount =
      this.configService.get<number>('business.minWithdrawalAmount') ?? 0;

    if (dto.amount < minAmount) {
      throw new BadRequestException(
        `Le montant minimum de retrait est de ${minAmount}`,
      );
    }
    if (Number(user.balance) < dto.amount) {
      throw new BadRequestException('Solde insuffisant');
    }

    // On débite immédiatement le solde ; en cas de rejet, il faudra le
    // recréditer (cf. rejectWithdrawal).
    await this.usersService.adjustBalance(userId, -dto.amount);

    const withdrawal = this.withdrawalsRepository.create({
      userId,
      amount: dto.amount,
      operator: dto.operator,
      phoneNumber: dto.phoneNumber,
      status: WithdrawalStatus.PENDING,
    });
    return this.withdrawalsRepository.save(withdrawal);
  }

  findByUser(userId: string): Promise<Withdrawal[]> {
    return this.withdrawalsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findAllPending(): Promise<Withdrawal[]> {
    return this.withdrawalsRepository.find({
      where: { status: WithdrawalStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * TODO : brancher l'appel réel à l'agrégateur mobile money
   * (CinetPay / PawaPay / API opérateur direct) ici, puis mettre à jour le
   * statut vers PAID avec la référence retournée par le fournisseur.
   */
  async approveWithdrawal(id: string): Promise<Withdrawal> {
    const withdrawal = await this.findById(id);
    withdrawal.status = WithdrawalStatus.APPROVED;
    return this.withdrawalsRepository.save(withdrawal);
  }

  async rejectWithdrawal(id: string, reason: string): Promise<Withdrawal> {
    const withdrawal = await this.findById(id);
    withdrawal.status = WithdrawalStatus.REJECTED;
    withdrawal.rejectionReason = reason;
    // Recrédit du solde utilisateur suite au rejet
    await this.usersService.adjustBalance(
      withdrawal.userId,
      Number(withdrawal.amount),
    );
    return this.withdrawalsRepository.save(withdrawal);
  }

  private async findById(id: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalsRepository.findOne({
      where: { id },
    });
    if (!withdrawal) throw new NotFoundException('Retrait introuvable');
    return withdrawal;
  }
}
