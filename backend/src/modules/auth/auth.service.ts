import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    let referrer = null;
    if (dto.referralCode) {
      referrer = await this.usersService.findByReferralCode(dto.referralCode);
    }

    const user = await this.usersService.create({
      phone: dto.phone,
      email: dto.email ?? null,
      passwordHash,
      referrer: referrer ?? undefined,
    });

    await this.otpService.generateAndSend(dto.phone);

    return {
      message: 'Compte créé. Un code de vérification a été envoyé par SMS.',
      userId: user.id,
    };
  }

  async verifyPhone(phone: string, code: string) {
    const valid = this.otpService.verify(phone, code);
    if (!valid) {
      throw new UnauthorizedException('Code invalide ou expiré');
    }
    // Note : à ce stade on marquerait phoneVerified = true en base
    // via usersService (méthode à ajouter selon le flux définitif).
    return { message: 'Numéro vérifié avec succès' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('Ce compte est suspendu');
    }
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
