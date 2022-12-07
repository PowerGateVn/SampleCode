import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from 'src/commons/entities/user.entity';
import { JwtPayload } from 'src/commons/interfaces/jwt-payload.interface';
import { hashPassword, comparePassword } from 'src/commons/utils/encrypt.util';
import {
  EMAIL_IS_EXISTED,
  WRONG_EMAIL_OR_PASSWORD,
} from 'src/commons/constants/message.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: string;
  }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new HttpException(WRONG_EMAIL_OR_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
    };

    return {
      user,
      token: this.jwtService.sign(jwtPayload),
    };
  }

  async register(
    fullname: string,
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: string;
  }> {
    const isExisted = await this.usersRepository.findOne({ where: { email } });
    if (isExisted) {
      throw new HttpException(EMAIL_IS_EXISTED, HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.fullname = fullname;
    user.email = email;
    user.password = await hashPassword(password);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    const result = await this.usersRepository.save(user);
    const jwtPayload: JwtPayload = {
      id: result.id,
      fullname: result.fullname,
      email: result.email,
    };

    return {
      user: result,
      token: this.jwtService.sign(jwtPayload),
    };
  }
}
