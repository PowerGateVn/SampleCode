import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SchoolTypeResponseDto } from './school-type.response.dto';
import { ListingResponseDto } from 'src/commons/dtos/response';

export class ListSchoolTypeResponseDto extends ListingResponseDto {
  @ApiProperty({ type: [SchoolTypeResponseDto] })
  @Expose()
  @Type(() => SchoolTypeResponseDto)
  list: SchoolTypeResponseDto[];
}
