export {};

declare global {
  namespace NodeJS {
    interface Global {
      loggerServer: any;
      logger: any;
      loggers: any;
      winston: any;
    }
  }
}
