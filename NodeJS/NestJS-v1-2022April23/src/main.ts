import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import SwaggerConfig from './configs/swagger.config';

const envFound = config({
  path: `./.env.${process.env.NODE_ENV || 'dev'}`,
});

if (!envFound) throw new Error("Couldn't find .env file");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Swagger setup
  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}

bootstrap();
