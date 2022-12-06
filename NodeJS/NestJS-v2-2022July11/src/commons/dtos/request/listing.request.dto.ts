import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SORT_TYPE } from 'src/commons/constants/config.constants';

export class ListingRequestDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Transform((params: TransformFnParams) => {
    const value = params?.value;
    return !value || isNaN(value) ? value : parseInt(value);
  })
  @IsNumber()
  @Min(0)
  page: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  query: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty({
    required: false,
    enum: SORT_TYPE,
  })
  @IsOptional()
  @IsEnum(SORT_TYPE)
  sortType: string;
}
