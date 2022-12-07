import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  RefreshTokenRequestDto,
  RegisterRequestDto,
  LoginRequestDto,
} from './dtos/request';
import { AuthService } from './auth.service';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from './dtos/response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('login')
  @ApiOperation({ tags: ['Auth', 'Login'], summary: 'Login', description: '' })
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: LoginResponseDto,
  })
  async login(@Body() payload: LoginRequestDto) {
    const { email, password } = payload;
    return await this._authService.login(email, password);
  }

  @Post('register')
  @ApiOperation({
    tags: ['Auth', 'Register'],
    summary: 'SingUp',
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Register successfully',
    type: RegisterResponseDto,
  })
  async register(@Body() payload: RegisterRequestDto) {
    const { email, password } = payload;
    return await this._authService.register(email, password);
  }

  @Post('refresh-token')
  @ApiOperation({
    tags: ['Auth', 'Refresh Token'],
    summary: 'Refresh Token',
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Refresh Token successfully',
    type: RefreshTokenResponseDto,
  })
  async refreshToken(@Body() payload: RefreshTokenRequestDto) {
    const { token } = payload;
    return await this._authService.refreshToken(token);
  }
}
