import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { NOT_FOUND } from 'src/commons/constants/message.constants';
import { SchoolType } from 'src/commons/entities/school-type.entity';
import {
  CreateSchoolTypeRequestDto,
  ListSchoolTypeRequestDto,
  UpdateSchoolTypeRequestDto,
} from './dtos/request';
import {
  PAGING_ITEM,
  SORT_TYPE,
  STATUS,
} from 'src/commons/constants/config.constants';

@Injectable()
export class SchoolTypeService {
  constructor(
    @InjectRepository(SchoolType)
    private _schoolTypeRepository: Repository<SchoolType>,
  ) {}

  async create(
    createSchoolTypeRequestDto: CreateSchoolTypeRequestDto,
  ): Promise<SchoolType> {
    const { name } = createSchoolTypeRequestDto;
    const schoolType = new SchoolType();
    schoolType.name = name;
    return await this._schoolTypeRepository.save(schoolType);
  }

  async findAll(query: ListSchoolTypeRequestDto): Promise<{
    currentPage: number;
    totalPage: number;
    totalRecord: number;
    list: SchoolType[];
  }> {
    const keyword = query.query || '';
    const sortBy = query.sortBy || 'updatedAt';
    const sortType = query.sortType || SORT_TYPE.DESC;
    const page = query.page && query.page > 0 ? query.page : 1;
    const condition: any = {
      where: {
        status: STATUS.ACTIVE,
      },
    };

    if (keyword) {
      condition.where.name = Raw(
        (alias) => `LOWER(${alias}) Like LOWER(:keyword)`,
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    const totalRecord = await this._schoolTypeRepository.count(condition);
    const list = await this._schoolTypeRepository.find({
      ...condition,
      skip: (page - 1) * PAGING_ITEM,
      take: PAGING_ITEM,
      order: {
        [sortBy]: sortType,
      },
    });

    return {
      currentPage: page,
      totalRecord,
      totalPage: Math.ceil(totalRecord / PAGING_ITEM),
      list,
    };
  }

  async findOne(id: string): Promise<SchoolType> {
    const schoolType = await this._schoolTypeRepository.findOneBy({
      id,
      status: STATUS.ACTIVE,
    });
    if (!schoolType) {
      throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return schoolType;
  }

  async update(
    id: string,
    updateSchoolTypeRequestDto: UpdateSchoolTypeRequestDto,
  ): Promise<SchoolType> {
    const schoolType = await this.findOne(id);
    schoolType.name = updateSchoolTypeRequestDto.name;
    return await this._schoolTypeRepository.save(schoolType);
  }

  async remove(id: string): Promise<SchoolType> {
    const schoolType = await this.findOne(id);
    schoolType.status = STATUS.INACTIVE;
    schoolType.deletedAt = new Date();
    return this._schoolTypeRepository.save(schoolType);
  }
}
