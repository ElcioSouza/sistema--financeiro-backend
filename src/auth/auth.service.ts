import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // verifica se o usuário existe
    const user = await this.usersService.findByEmail(loginDto.email);

    // se o usuário não existir, lança um erro de credenciais inválidas
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // verifica se a senha do usuário é válida
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    // se a senha não for válida, lança um erro de credenciais inválidas
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // cria um payload com o id e o email do usuário
    const payload = { 
      sub: user.id,  // sub é o ID do usuário
      email: user.email 
    };

    console.log('Payload do token:', payload); // Para debug

    // cria um token JWT com o payload
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
} 