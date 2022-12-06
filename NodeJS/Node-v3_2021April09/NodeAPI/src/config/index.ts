import { config } from "dotenv";

const envFound = config({ path: `./.env.${process.env.NODE_ENV || "development"}` });
if (!envFound) throw new Error("Couldn't find .env file");

export default {
  port: process.env.PORT,

  logs: { level: process.env.LOG_LEVEL || "silly" },

  DB_USERNAME: process.env.DB_USERNAME,

  DB_PASSWORD: process.env.DB_PASSWORD,

  DB_HOST: process.env.DB_HOST,

  DB_PORT: process.env.DB_PORT,

  DB_NAME: process.env.DB_NAME,

  DATABASE_POOL_MIN: process.env.DATABASE_POOL_MIN,

  DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX,

  DATABASE_POOL_IDLE: process.env.DATABASE_POOL_IDLE
};
