import IError from '../errors/IError';
export default (error, req, res, next) => {
  if (error instanceof IError) {
    global.loggerServer.error(error);
    const { errorDomain, errorCode, errorMessage, errorData } = error;
    res.status(error.httpCode).send({
      errorDomain,
      errorCode,
      errorMessage,
      errorData
    });
  } else {
    next(error);
  }
};
