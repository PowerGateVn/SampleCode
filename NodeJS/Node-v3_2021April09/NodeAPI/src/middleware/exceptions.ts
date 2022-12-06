import { NextFunction, Request, Response } from "express";
import logger from "./logger";

/** Returns 404 if no path is found */
const notFoundMiddleware = (req: Request, res: Response) => {
  logger.error(`-----------------------BEGIN ERROR-------------------------------`);
  logger.error(`NOT FOUND URL: ${req.path}`);
  logger.error(`-----------------------END ERROR---------------------------------`);
  res.status(404).send({ message: `Not found URL ${req.path}` });
};

/** Returns 403 if csrf */
const csrfMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.code !== "EBADCSRFTOKEN") return next(error);
  logger.error(`-----------------------BEGIN ERROR-------------------------------`);
  logger.error(`CSRF ERROR: ${req.path}`);
  logger.error(error.message);
  logger.error(`-----------------------END ERROR---------------------------------`);
  res.status(403).send({ message: error.message });
};

/** Returns 500 if server error is encountered */
const errorMiddleware = (error: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`-----------------------BEGIN ERROR-------------------------------`);
  logger.error(`API ERROR: ${req.path}`);
  logger.error(error.message);
  logger.error(`-----------------------END ERROR---------------------------------`);
  res.status(500).send({ message: error.message });
};

export { notFoundMiddleware, csrfMiddleware, errorMiddleware };
