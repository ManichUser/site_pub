import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BoostsService } from './boosts.service';

@UseGuards(JwtAuthGuard)
@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @Get()
  findAvailable() {
    return this.boostsService.findAvailable();
  }

  @Get('me')
  findMine(@CurrentUser('sub') userId: string) {
    return this.boostsService.findActiveForUser(userId);
  }

  @Post(':id/purchase')
  purchase(
    @CurrentUser('sub') userId: string,
    @Param('id') boostId: string,
  ) {
    return this.boostsService.purchaseWithBalance(userId, boostId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  create(@Body() body: any) {
    return this.boostsService.create(body);
  }
}
