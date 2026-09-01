import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationCommission } from './entities/affiliation-commission.entity';
import { AffiliationService } from './affiliation.service';
import { AffiliationController } from './affiliation.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([AffiliationCommission]), UsersModule],
  controllers: [AffiliationController],
  providers: [AffiliationService],
  exports: [AffiliationService],
})
export class AffiliationModule {}
