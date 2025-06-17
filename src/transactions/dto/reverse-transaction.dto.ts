import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReverseTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  transactionId: number;
} 