import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AffiliationService } from './affiliation.service';

@UseGuards(JwtAuthGuard)
@Controller('affiliation')
export class AffiliationController {
  constructor(private readonly affiliationService: AffiliationService) {}

  @Get('commissions')
  getMyCommissions(@CurrentUser('sub') userId: string) {
    return this.affiliationService.findByParrain(userId);
  }
}
