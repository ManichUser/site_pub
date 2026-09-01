import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  request(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWithdrawalDto,
  ) {
    return this.paymentsService.requestWithdrawal(userId, dto);
  }

  @Get('me')
  findMine(@CurrentUser('sub') userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('pending')
  findPending() {
    return this.paymentsService.findAllPending();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.paymentsService.approveWithdrawal(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post(':id/reject')
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.paymentsService.rejectWithdrawal(id, reason);
  }
}
