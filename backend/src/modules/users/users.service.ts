import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone },
      select: {
        id: true,
        phone: true,
        passwordHash: true,
        role: true,
        isSuspended: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    return user;
  }

  async findByReferralCode(code: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { referralCode: code } });
  }

  async generateUniqueReferralCode(): Promise<string> {
    let code: string;
    let exists = true;
    do {
      code = randomBytes(4).toString('hex').toUpperCase();
      exists = !!(await this.findByReferralCode(code));
    } while (exists);
    return code;
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { phone: data.phone },
    });
    if (existing) {
      throw new ConflictException('Ce numéro est déjà utilisé');
    }
    const referralCode = await this.generateUniqueReferralCode();
    const user = this.usersRepository.create({ ...data, referralCode });
    return this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async adjustBalance(id: string, delta: number): Promise<User> {
    const user = await this.findById(id);
    const next = Number(user.balance) + delta;
    if (next < 0) {
      throw new ConflictException('Solde insuffisant');
    }
    user.balance = next;
    return this.usersRepository.save(user);
  }

  async setSuspended(id: string, suspended: boolean): Promise<User> {
    const user = await this.findById(id);
    user.isSuspended = suspended;
    return this.usersRepository.save(user);
  }

  async markPhoneVerified(phone: string): Promise<void> {
    await this.usersRepository.update({ phone }, { phoneVerified: true });
  }

  /**
   * Incrémente le compteur de vidéos en attente pour un utilisateur.
   * Retourne le compteur mis à jour.
   */
  async incrementPendingVideos(id: string): Promise<number> {
    const user = await this.findById(id);
    user.pendingVideoCount += 1;
    await this.usersRepository.save(user);
    return user.pendingVideoCount;
  }

  /**
   * Crédite un gain "vidéo" en tenant compte du plafond journalier anti-abus.
   * Réinitialise le compteur de vidéos en attente.
   * Retourne le montant réellement crédité (peut être 0 si plafond atteint).
   */
  async creditVideoGain(
    id: string,
    amount: number,
    dailyCap: number,
  ): Promise<number> {
    const user = await this.findById(id);
    const today = new Date().toISOString().slice(0, 10);

    if (user.gainsTodayDate !== today) {
      user.gainsToday = 0;
      user.gainsTodayDate = today;
    }

    const remainingCap = Math.max(0, dailyCap - Number(user.gainsToday));
    const creditedAmount = Math.min(amount, remainingCap);

    user.balance = Number(user.balance) + creditedAmount;
    user.gainsToday = Number(user.gainsToday) + creditedAmount;
    user.pendingVideoCount = 0;

    await this.usersRepository.save(user);
    return creditedAmount;
  }
}
