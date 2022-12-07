import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_NAME } from 'src/commons/constants/config.constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return APP_NAME;
  }
}
