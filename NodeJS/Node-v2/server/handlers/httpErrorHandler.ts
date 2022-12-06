import HttpError from '../errors/httpErrors/HttpError';

export default (error, req, res, next) => {
  if (error instanceof HttpError) {
    global.loggerServer.error(error);

    // @ts-ignore
    res.status(error.statusCode).send({
      message: error.message,
      messageKey: error.messageKey,
      messageArgs: error.messageArgs
    });
    return;
  }

  return next(error);
};
