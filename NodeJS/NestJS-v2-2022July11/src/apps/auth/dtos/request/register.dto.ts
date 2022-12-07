import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({})
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
