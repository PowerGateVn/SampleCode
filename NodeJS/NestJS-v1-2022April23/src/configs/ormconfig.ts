import { DataSource } from 'typeorm';
import { config } from 'dotenv';

const envFound = config({
  path: `./.env.${process.env.NODE_ENV || 'dev'}`,
});
if (!envFound) throw new Error("Couldn't find .env file");

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['src/commons/entities/**.entity{.ts,.js}'],
  migrations: ['src/databases/migrations/**/*{.ts,.js}'],
  subscribers: ['src/databases/subscriber/**/*{.ts,.js}'],
});
