import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewingSession } from './entities/viewing-session.entity';
import { ViewingSessionsService } from './viewing-sessions.service';
import { ViewingSessionsController } from './viewing-sessions.controller';
import { AdsModule } from '../ads/ads.module';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViewingSession]),
    AdsModule,
    EarningsModule,
  ],
  controllers: [ViewingSessionsController],
  providers: [ViewingSessionsService],
})
export class ViewingSessionsModule {}
