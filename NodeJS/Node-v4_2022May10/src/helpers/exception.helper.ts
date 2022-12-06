import { StatusCodes } from "http-status-codes";

export default class HttpException extends Error {
  statusCode?: number;
  status?: number;
  message: string;
  data: any | null;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
  }
}

export class BadRequestException extends Error {
  statusCode?: number = StatusCodes.BAD_REQUEST;
  status?: number;
  message: string;
  data: any | null;

  constructor(message: string, data?: any) {
    super(message);
    this.message = message;
    this.data = data || {};
  }
}

export class UnauthorizedException extends Error {
  statusCode?: number = StatusCodes.UNAUTHORIZED;
  status?: number;
  message: string;

  constructor() {
    super();
    this.message = "UNAUTHORIZED";
  }
}
