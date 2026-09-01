import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { EarningsService } from './earnings.service';

@Controller('earnings/tiers')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.earningsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  create(@Body() body: { nbVideosRequired: number; amount: number }) {
    return this.earningsService.create(body);
  }
}
