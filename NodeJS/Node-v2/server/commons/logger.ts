import config from '../../config';
import winston from 'winston';
import expressWinston from 'express-winston';

const createLoggerForEnv = environment => {
  let logger;
  switch (environment) {
    case 'development':
      logger = winston.createLogger({});
      logger.level = 'debug';
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.align()
          )
        })
      );
      break;

    case 'test':
      logger = winston.createLogger({});
      logger.level = 'debug';
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
          silent: process.env.ENABLE_TEST_LOGGING !== 'true'
        })
      );
      break;

    case 'production':
      logger = winston.createLogger({});
      logger.level = 'info';
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.align()
          )
        })
      );
      break;
  }

  return logger;
};

const logger = createLoggerForEnv(config.environment);
global.loggerServer = logger;

export default function RequestLogger() {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');

  return expressWinston.logger({
    winstonInstance: global.loggerServer,
    colorize: true
  });
}
