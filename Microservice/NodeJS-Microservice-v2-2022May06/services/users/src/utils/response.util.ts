import { StatusCodes } from "http-status-codes";

type IResponse = {
  statusCode: number;
  body: any;
};

const buildResponse = (statusCode: number, body: any): IResponse => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};

export const success = (data: any): IResponse => {
  const body = {
    data,
  };
  return buildResponse(StatusCodes.OK, body);
};

export const error = (
  message: string,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR
): IResponse => {
  const body = {
    message,
  };
  return buildResponse(statusCode, body);
};
