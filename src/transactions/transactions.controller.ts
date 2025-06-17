import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  async transfer(
    @Request() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.transfer(req.user.id, createTransactionDto);
  }

  @Post('reverse')
  async reverseTransaction(
    @Request() req,
    @Body() reverseTransactionDto: ReverseTransactionDto,
  ) {
    return await this.transactionsService.reverseTransaction(req.user.id, reverseTransactionDto);
  }

  @Get('history')
  async getTransactions(@Request() req) {
    return await this.transactionsService.getTransactions(req.user.id);
  }
} 