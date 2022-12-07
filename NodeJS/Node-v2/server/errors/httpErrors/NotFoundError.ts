import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class NotFoundError extends HttpError {
  constructor(message = 'Not found', messageKey = '', messageArgs = {}) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.NOT_FOUND;
  }
}
