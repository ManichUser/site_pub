import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ViewingSessionsService } from './viewing-sessions.service';
import { CreateViewingSessionDto } from './dto/create-viewing-session.dto';

@UseGuards(JwtAuthGuard)
@Controller('viewing-sessions')
export class ViewingSessionsController {
  constructor(
    private readonly viewingSessionsService: ViewingSessionsService,
  ) {}

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateViewingSessionDto,
    @Req() req: any,
  ) {
    return this.viewingSessionsService.recordSession(
      userId,
      dto,
      req.ip ?? null,
    );
  }

  @Get('me')
  findMine(@CurrentUser('sub') userId: string) {
    return this.viewingSessionsService.findByUser(userId);
  }
}
