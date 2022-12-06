import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', messageKey = '', messageArgs = {}) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.FORBIDDEN;
  }
}
