import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ListingRequestDto } from 'src/commons/dtos/request';

enum SORT_BY {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export class ListSchoolTypeRequestDto extends ListingRequestDto {
  @ApiProperty({
    enum: SORT_BY,
    required: false,
  })
  @IsOptional()
  @IsEnum(SORT_BY)
  sortBy: string;
}
