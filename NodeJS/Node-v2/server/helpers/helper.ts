import '../commons/logger';
import messages from '../commons/message';
import httpStatus from 'http-status/lib/index';

function returnObject(
  success = true,
  message = {},
  response = {},
  error = '',
  data = {}
) {
  return {
    success,
    message,
    response,
    error,
    data
  };
}
function responseDataSuccess(message, data) {
  return {
    success: true,
    message: message,
    response: {},
    error: '',
    data: data
  };
}

function responseData(
  res: any = {},
  httpCode = 200,
  success = true,
  message = '',
  response = {},
  error = '',
  data = {}
) {
  return res
    .status(httpCode)
    .json(returnObject(success, message, response, error, data));
}

function responseDataWithTitle(
  res: any = {},
  httpCode = 200,
  success = true,
  message = {},
  response = {},
  error = '',
  data = {}
) {
  return res
    .status(httpCode)
    .json(returnObject(success, message, response, error, data));
}

function responseDataObject(res: any = {}, httpCode = 200, returnData = {}) {
  return res.status(httpCode).json(returnData);
}

function logServerError(res, error) {
  global.loggerServer.error('Error ', error);
  global.loggerServer.log('debug', { error: error });
  return responseData(
    res,
    httpStatus.INTERNAL_SERVER_ERROR,
    false,
    messages.generalMessage.Error
  );
}

function logServerErrorNotReturnResponse(error) {
  global.loggerServer.error('Error ', error);
  global.loggerServer.log('debug', { error: error });
}



export default {
  responseData,
  responseDataSuccess,
  responseDataObject,
  logServerError, // remove
  logServerErrorNotReturnResponse,
  responseDataWithTitle
};
