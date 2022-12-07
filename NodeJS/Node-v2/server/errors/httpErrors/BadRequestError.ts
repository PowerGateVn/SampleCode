import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', messageKey = '', messageArgs = {}) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}
