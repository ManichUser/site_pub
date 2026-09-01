import { Injectable, Logger } from '@nestjs/common';

interface OtpEntry {
  code: string;
  expiresAt: number;
}

/**
 * Service OTP - implémentation basique en mémoire pour le développement.
 * TODO (production) : remplacer le stockage en mémoire par Redis (TTL natif),
 * et brancher un vrai fournisseur SMS (Twilio, Vonage, ou agrégateur local)
 * à la place du simple log ci-dessous.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly store = new Map<string, OtpEntry>();
  private readonly ttlMs = 5 * 60 * 1000; // 5 minutes

  async generateAndSend(phone: string): Promise<void> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    this.store.set(phone, { code, expiresAt: Date.now() + this.ttlMs });
    // TODO : intégrer un vrai fournisseur SMS
    this.logger.log(`[DEV] Code OTP pour ${phone} : ${code}`);
  }

  verify(phone: string, code: string): boolean {
    const entry = this.store.get(phone);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(phone);
      return false;
    }
    const valid = entry.code === code;
    if (valid) this.store.delete(phone);
    return valid;
  }
}
