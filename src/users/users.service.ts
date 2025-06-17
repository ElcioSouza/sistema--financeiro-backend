import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userEmailExist = await this.findByEmail(createUserDto.email);
    if(userEmailExist) {
        throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
    }
    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    

    // Cria o usuário no banco de dados
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        balance: 200,
      },
    });

    // Remove a senha do objeto retornado
    const { ...userWithoutPassword } = user;
    
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
} 