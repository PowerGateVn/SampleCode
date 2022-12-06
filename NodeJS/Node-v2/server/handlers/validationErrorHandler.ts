import { ValidationError } from 'express-validation';

const prepareErrorMessages = error => {
  const errorMessages = error.errors.map(
    validationError => validationError.messages
  );

  return [].concat(...errorMessages);
};

export default (error, req, res, next) => {
  if (error instanceof ValidationError) {
    global.loggerServer.error(error);
    return res.status(error.status).send({
      messages: prepareErrorMessages(error)
    });
  }

  return next(error);
};
