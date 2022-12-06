import InternalServerError from '../../../errors/httpErrors/InternalServerError';
import httpStatus from 'http-status';
import { expect } from '../../helpers/chai';
import HttpError from '../../../errors/httpErrors/HttpError';

describe('Internal server error', () => {
  it('is throwable', () => {
    expect(() => {
      throw new InternalServerError();
    })
      .to.throw(InternalServerError)
      .and.to.haveOwnProperty('message', 'Internal server error');
  });

  it('inherits from HttpError', () => {
    expect(() => {
      throw new InternalServerError();
    }).to.throw(HttpError);
  });

  it('holds custom message', () => {
    expect(new InternalServerError('my custom message')).to.haveOwnProperty(
      'message',
      'my custom message'
    );
  });

  it('provides http status code', () => {
    expect(new InternalServerError()).to.haveOwnProperty(
      'statusCode',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  });
});
