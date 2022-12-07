import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class Item {
  @ApiProperty({})
  @Expose()
  id: string;
}

export class ListingResponseDto {
  @ApiProperty({ type: [Item] })
  @Expose()
  @Type(() => Item)
  list: Item[];

  @ApiProperty({})
  @Expose()
  currentPage: number;

  @ApiProperty({})
  @Expose()
  totalPage: number;

  @ApiProperty({})
  @Expose()
  totalRecord: number;
}
