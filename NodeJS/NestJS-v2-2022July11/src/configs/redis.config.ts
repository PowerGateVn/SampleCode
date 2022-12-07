import { config } from 'dotenv';
import * as dotenv from 'dotenv';
import * as redisStore from 'cache-manager-redis-store';

const envFound = config({
  path: `./.env.${process.env.NODE_ENV || 'dev'}`,
});

if (!envFound) throw new Error("Couldn't find .env file");

dotenv.config();
const redisConfig = {
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  isGlobal: true,
};

export default redisConfig;
