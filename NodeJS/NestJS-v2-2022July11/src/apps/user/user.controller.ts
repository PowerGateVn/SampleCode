import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsUserGuard } from 'src/commons/guards/is-user.guard';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('info')
  @UseGuards(new IsUserGuard())
  async info(@Request() req) {
    const { user } = req;
    return await this.userService.getInfo(user.id);
  }
}
