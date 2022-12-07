import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ISuccess, IError, IUnauthorization } from '@src/types/response';

class ResponseService {
  public ok(
    res: Response, data: any, message = 'Success'
  ) {
    const response = new ISuccess(data, message);
    res.status(StatusCodes.OK).json(response);
  }

  public badRequest(
    res: Response, data: any, message = 'Error'
  ) {
    const response = new IError(data, message);
    res.status(StatusCodes.BAD_REQUEST).json(response);
  }

  public serverError(
    res: Response, data: any, message = 'Error'
  ) {
    const response = new IError(data, message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
  }

  public unauthorization(
    res: Response, message = 'Unauthorized access'
  ) {
    const response = new IUnauthorization(message);
    res.status(StatusCodes.UNAUTHORIZED).json(response);
  }
}

export default ResponseService;