import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { MobileMoneyOperator } from '../entities/withdrawal.entity';

export class CreateWithdrawalDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(MobileMoneyOperator)
  operator: MobileMoneyOperator;

  @IsString()
  phoneNumber: string;
}
