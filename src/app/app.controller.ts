import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
// definir as rotas e lida com as requisições
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
