import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boost } from './entities/boost.entity';
import { ActiveBoost } from './entities/active-boost.entity';
import { BoostsService } from './boosts.service';
import { BoostsController } from './boosts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boost, ActiveBoost]), UsersModule],
  controllers: [BoostsController],
  providers: [BoostsService],
  exports: [BoostsService],
})
export class BoostsModule {}
