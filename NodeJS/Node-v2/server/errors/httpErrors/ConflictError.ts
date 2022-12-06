import HttpError from './HttpError';
import httpStatus from 'http-status';

export default class ConflictError extends HttpError {
  constructor(message = 'Conflict', messageKey = '', messageArgs = {}) {
    super(message, messageKey, messageArgs);

    Object.setPrototypeOf(this, ConflictError.prototype);
    this.name = this.constructor.name;
    this.statusCode = httpStatus.CONFLICT;
  }
}
