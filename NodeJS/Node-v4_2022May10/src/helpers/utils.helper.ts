import { Request } from "express";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

export const formatUsername = (username: string) => {
  if (username) {
    return username.toLocaleLowerCase();
  }

  return username;
};

export const isErrorValidate = (req: Request): string => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array();
    if (errorMsgs.length) {
      return `${errorMsgs[0].param}: ${errorMsgs[0].msg}`;
    }
  }

  return "";
};

export const handleErrorException = (e: any) => {
  return createError(StatusCodes.INTERNAL_SERVER_ERROR, (e as Error).message);
};
