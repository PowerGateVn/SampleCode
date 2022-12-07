import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/commons/entities/user.entity';

const envFound = config({
  path: `./.env.${process.env.NODE_ENV || 'dev'}`,
});

if (!envFound) throw new Error("Couldn't find .env file");

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
};

export default dbConfig;
