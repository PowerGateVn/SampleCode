export default class HttpError extends Error {
  messageKey: any;
  messageArgs: any;
  statusCode: any;

  constructor(
    message = 'Unknown HTTP Error',
    messageKey = '',
    messageArgs = {}
  ) {
    super();

    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = this.constructor.name;

    this.message = message;
    this.messageKey = messageKey;
    this.messageArgs = messageArgs;
  }
}
