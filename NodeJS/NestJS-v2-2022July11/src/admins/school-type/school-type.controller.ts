import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SchoolTypeService } from './school-type.service';
import {
  CreateSchoolTypeRequestDto,
  ListSchoolTypeRequestDto,
  UpdateSchoolTypeRequestDto,
} from './dtos/request';
import {
  SchoolTypeResponseDto,
  ListSchoolTypeResponseDto,
} from './dtos/response';

@ApiTags('school-type')
@Controller('school-type')
export class SchoolTypeController {
  constructor(private readonly _schoolTypeService: SchoolTypeService) {}

  @ApiResponse({
    status: 200,
    description: 'Create schoolType successfully',
    type: SchoolTypeResponseDto,
  })
  @Post()
  create(@Body() createSchoolTypeRequestDto: CreateSchoolTypeRequestDto) {
    return this._schoolTypeService.create(createSchoolTypeRequestDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get list schoolType successfully',
    type: ListSchoolTypeResponseDto,
  })
  @Get()
  findAll(@Query() query: ListSchoolTypeRequestDto) {
    return this._schoolTypeService.findAll(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Get schoolType successfully',
    type: SchoolTypeResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const schoolType = await this._schoolTypeService.findOne(id);
    if (schoolType) {
      return schoolType;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Update schoolType successfully',
    type: SchoolTypeResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchoolTypeRequestDto: UpdateSchoolTypeRequestDto,
  ) {
    return this._schoolTypeService.update(id, updateSchoolTypeRequestDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Remove schoolType successfully',
    type: SchoolTypeResponseDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this._schoolTypeService.remove(id);
  }
}
