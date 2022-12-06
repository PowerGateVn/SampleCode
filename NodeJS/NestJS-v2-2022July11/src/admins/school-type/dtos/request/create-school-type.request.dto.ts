import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateSchoolTypeRequestDto {
  @ApiProperty({ name: 'name' })
  @IsNotEmpty()
  @Length(0, 255)
  name: string;
}
