import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', messageKey = '', messageArgs = {}) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.UNAUTHORIZED;
  }
}
