import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class User {
  @ApiProperty({})
  @Expose()
  id: string;

  @ApiProperty({})
  @Expose()
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty({})
  @Expose()
  accessToken: string;

  @ApiProperty({})
  @Expose()
  refreshToken: string;
}
