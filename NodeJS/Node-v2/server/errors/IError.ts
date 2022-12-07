export default class IError extends Error {
  errorDomain: string;
  errorCode: number;
  errorMessage: string;
  errorData: any;
  httpCode: number;

  constructor(
    errorDomain,
    errorCode,
    errorMessage = '',
    errorData = {},
    httpCode = 200
  ) {
    super();
    Object.setPrototypeOf(this, IError.prototype);
    this.name = this.constructor.name;
    this.errorDomain = errorDomain;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorData = errorData;
    this.httpCode = httpCode;
  }
}
