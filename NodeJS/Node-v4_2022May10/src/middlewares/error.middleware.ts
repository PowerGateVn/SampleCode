import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("error", error);
  const status = error.statusCode || error.status || 500;
  const data = error.data ? error.data : {};
  const errorResponse = {
    message: error.message,
    statusCode: status,
    ...data,
  };

  response.status(status).send(errorResponse);
};
