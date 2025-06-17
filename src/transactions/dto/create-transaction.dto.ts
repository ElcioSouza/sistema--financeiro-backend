import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'O valor mínimo para transferência é R$ 0,01' })
  amount: number;
} 