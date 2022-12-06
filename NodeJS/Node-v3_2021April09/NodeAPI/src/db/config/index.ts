import config from "../../config";

module.exports = {
  development: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    database: config.DB_NAME,
    dialect: "postgres",
    port: config.DB_PORT,
    pool: {
      min: config.DATABASE_POOL_MIN,
      max: config.DATABASE_POOL_MAX,
      idle: config.DATABASE_POOL_IDLE
    }
  },
  test: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    database: config.DB_NAME,
    dialect: "postgres",
    port: config.DB_PORT,
    pool: {
      min: config.DATABASE_POOL_MIN,
      max: config.DATABASE_POOL_MAX,
      idle: config.DATABASE_POOL_IDLE
    }
  },
  production: {
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    database: config.DB_NAME,
    dialect: "postgres",
    port: config.DB_PORT,
    pool: {
      min: config.DATABASE_POOL_MIN,
      max: config.DATABASE_POOL_MAX,
      idle: config.DATABASE_POOL_IDLE
    }
  }
};
