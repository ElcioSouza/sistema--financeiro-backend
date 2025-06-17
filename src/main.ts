import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

// arquivo iniciar o projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // se true ele remove as chaves que não estão no DTO
  }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
