import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class UnprocessableEntityError extends HttpError {
  constructor(
    message = 'Unprocessable Entity',
    messageKey = '',
    messageArgs = {}
  ) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.UNPROCESSABLE_ENTITY;
  }
}
