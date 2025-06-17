import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extrai o token do header
      ignoreExpiration: false, // não ignora a expiração do token
      secretOrKey: process.env.JWT_SECRET || 'sua_chave_secreta_aqui', // chave secreta do token
    });
  }

  async validate(payload: any) {
    console.log('Payload do token:', payload); // Para debug
    return { 
      id: payload.sub,  // sub é o ID do usuário
      email: payload.email 
    };
  }
} 