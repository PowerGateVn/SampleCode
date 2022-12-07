import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolTypeService } from './school-type.service';
import { SchoolTypeController } from './school-type.controller';
import { SchoolType } from 'src/commons/entities/school-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolType])],
  controllers: [SchoolTypeController],
  providers: [SchoolTypeService],
})
export class SchoolTypeModule {}
