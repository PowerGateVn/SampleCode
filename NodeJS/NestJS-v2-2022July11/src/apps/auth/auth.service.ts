import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { User } from 'src/commons/entities/user.entity';
import { JwtPayload } from 'src/commons/interfaces/jwt-payload.interface';
import { hashPassword, comparePassword } from 'src/commons/utils/encrypt.util';
import * as authUtil from 'src/commons/utils/auth.util';
import {
  EMAIL_IS_EXISTED,
  NOT_FOUND_USER,
  REFRESH_TOKEN_NOT_EXISTED,
  WRONG_EMAIL_OR_PASSWORD,
} from 'src/commons/constants/message.constants';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from './dtos/response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private _jwtService: JwtService,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this._usersRepository.findOneBy({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new HttpException(WRONG_EMAIL_OR_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const { accessToken, refreshToken } = await this._generateToken(user);
    return {
      user,
      accessToken,
      refreshToken: refreshToken,
    };
  }

  async register(
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const isExisted = await this._usersRepository.findOneBy({ email });
    if (isExisted) {
      throw new HttpException(EMAIL_IS_EXISTED, HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.email = email;
    user.password = await hashPassword(password);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    await this._usersRepository.save(user);
    const { accessToken, refreshToken } = await this._generateToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<RefreshTokenResponseDto> {
    const refresh: { token: string; userId: string } =
      await this._cacheManager.get(token);

    if (!refresh) {
      throw new HttpException(
        REFRESH_TOKEN_NOT_EXISTED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this._usersRepository.findOneBy({ id: refresh.userId });

    if (!user) {
      await this._cacheManager.del(token);
      throw new HttpException(NOT_FOUND_USER, HttpStatus.BAD_REQUEST);
    }

    await this._cacheManager.del(token);
    return this._generateToken(user);
  }

  // generate accesstoken and refreshtoken
  private async _generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const ttl = Number(process.env.REFRESH_TOKEN_EXPIRED);
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this._jwtService.sign(jwtPayload);
    const refresh = authUtil.createRefreshToken();
    await this._cacheManager.set(
      refresh.token,
      { ...refresh, userId: user.id },
      { ttl },
    );
    return {
      accessToken,
      refreshToken: refresh.token,
    };
  }
}
