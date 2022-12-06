import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SchoolTypeResponseDto {
  @ApiProperty({})
  @Expose()
  id: string;

  @ApiProperty({})
  @Expose()
  name: string;

  @ApiProperty({})
  @Expose()
  status: string;

  @ApiProperty({})
  @Expose()
  createdAt: Date;

  @ApiProperty({})
  @Expose()
  updatedAt: Date;
}
