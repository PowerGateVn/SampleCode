import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: process.env.NODE_ENV === 'test' ? './.env.test' : './.env'
  });
}

const poolConfig = {
  max: 100,
  min: 0,
  idle: 20000,
  acquire: 20000,
  evict: 30000,
  handleDisconnects: true
};

// @ts-ignore
const database = {
  username: process.env.dbUserName,
  password: process.env.dbPassword, // if blank then set null
  database: process.env.dbName,
  host: process.env.dbHost,
  pool: process.env.enableConnectionPool ? poolConfig : null,
  dialect: 'postgres',
  logging: false,
  timezone: '+00:00'
};

export default {
  /**
   * Application api key
   * @type {String}
   */
  apiKey: process.env.apiKey || 'BETG%^%^^^&^&*G756(&$#%&*%NH(&%$$',
  /**
   * Application environment mode either developement or production or test
   * @type {String}
   */
  environment: process.env.NODE_ENV,
  /**
   * Database connection for each environment
   * @type {Object}
   */

  database,

  /**
   * redis server configurations
   */
  redis: {
    url: process.env.REDIS_URL
  },

  statsD: {
    host: process.env.STATSD_HOST,
    port: process.env.STATSD_PORT,
    env: process.env.APP_ENV
  },

  jwtSecret: process.env.jwtSecret,

  /**
   * Supported mobile app verisons
   */
  appVersions: process.env.appVersions,

  salt: process.env.SALT

};
