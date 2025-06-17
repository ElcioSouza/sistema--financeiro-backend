import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async transfer(senderId: number, createTransactionDto: CreateTransactionDto) {
    const { receiverId, amount } = createTransactionDto;

    // Verifica se o remetente e destinatário são diferentes
    if (senderId === receiverId) {
      throw new BadRequestException('Não é possível transferir para si mesmo');
    }

    // Busca o remetente e verifica o saldo
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      },
    });

    if (!sender) {
      throw new NotFoundException('Remetente não encontrado');
    }

    // Validação detalhada do saldo
    if (sender.balance < amount) {
      throw new BadRequestException({
        message: 'Saldo insuficiente para realizar a transferência',
        currentBalance: sender.balance,
        requiredAmount: amount,
        missingAmount: amount - sender.balance
      });
    }

    // Busca o destinatário
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      },
    });

    if (!receiver) {
      throw new NotFoundException('Destinatário não encontrado');
    }

    try {
      // Realiza a transferência usando uma transação do banco de dados
      return await this.prisma.$transaction(async (prisma) => {
        // Atualiza o saldo do remetente
        const updatedSender = await prisma.user.update({
          where: { id: senderId },
          data: { balance: sender.balance - amount },
          select: {
            id: true,
            name: true,
            email: true,
            balance: true,
          },
        });

        // Atualiza o saldo do destinatário
        const updatedReceiver = await prisma.user.update({
          where: { id: receiverId },
          data: { balance: receiver.balance + amount },
          select: {
            id: true,
            name: true,
            email: true,
            balance: true,
          },
        });

        // Cria o registro da transação
        const transaction = await prisma.transaction.create({
          data: {
            amount,
            senderId,
            receiverId,
            status: 'COMPLETED',      
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Retorna a transação com os saldos atualizados
        return {
          ...transaction,
          senderBalance: updatedSender.balance,
          receiverBalance: updatedReceiver.balance,
        };
      });
    } catch (error) {
      throw new BadRequestException('Não foi possível realizar a transferência: ' + error.message);
    }
  }

  async reverseTransaction(userId: number, reverseTransactionDto: ReverseTransactionDto) {
    const { transactionId } = reverseTransactionDto;

    // Busca a transação original
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    // Verifica se o usuário é o remetente ou destinatário
    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
      throw new BadRequestException('Você não tem permissão para reverter esta transação');
    }

    // Verifica se a transação já foi revertida
    if (transaction.status === 'REVERSED') {
      throw new BadRequestException('Esta transação já foi revertida');
    }

    // Verifica se a transação falhou
    if (transaction.status === 'FAILED') {
      throw new BadRequestException('Não é possível reverter uma transação que falhou');
    }

    try {
      // Realiza a reversão usando uma transação do banco de dados
      return await this.prisma.$transaction(async (prisma) => {
        // Atualiza o saldo do remetente original (agora recebendo o valor de volta)
        const updatedOriginalSender = await prisma.user.update({
          where: { id: transaction.senderId },
          data: { balance: { increment: transaction.amount } },
          select: {
            id: true,
            name: true,
            email: true,
            balance: true,
          },
        });

        // Atualiza o saldo do destinatário original (agora devolvendo o valor)
        const updatedOriginalReceiver = await prisma.user.update({
          where: { id: transaction.receiverId },
          data: { balance: { decrement: transaction.amount } },
          select: {
            id: true,
            name: true,
            email: true,
            balance: true,
          },
        });

        // Atualiza o status da transação original
        const updatedTransaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'REVERSED' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Retorna a transação atualizada com os saldos
        return {
          ...updatedTransaction,
          senderBalance: updatedOriginalSender.balance,
          receiverBalance: updatedOriginalReceiver.balance,
        };
      });
    } catch (error) {
      throw new BadRequestException('Não foi possível reverter a transação: ' + error.message);
    }
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 