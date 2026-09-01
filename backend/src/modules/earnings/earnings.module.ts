import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GainTier } from './entities/gain-tier.entity';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { UsersModule } from '../users/users.module';
import { AffiliationModule } from '../affiliation/affiliation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GainTier]),
    UsersModule,
    forwardRef(() => AffiliationModule),
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService],
})
export class EarningsModule {}
