import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class InternalServerError extends HttpError {
  constructor(
    message = 'Internal server error',
    messageKey = '',
    messageArgs = {}
  ) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, InternalServerError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
}
