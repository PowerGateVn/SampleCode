import { expect } from '../../helpers/chai';
import NotFoundError from '../../../errors/httpErrors/NotFoundError';
import httpStatus from 'http-status/lib/index';
import HttpError from '../../../errors/httpErrors/HttpError';

describe('Not found error', () => {
  it('is throwable', () => {
    expect(() => {
      throw new NotFoundError();
    })
      .to.throw(NotFoundError)
      .and.to.haveOwnProperty('message', 'Not found');
  });

  it('inherits from HttpError', () => {
    expect(() => {
      throw new NotFoundError();
    }).to.throw(HttpError);
  });

  it('holds custom message', () => {
    expect(new NotFoundError('my custom message')).to.haveOwnProperty(
      'message',
      'my custom message'
    );
  });

  it('provides http status code', () => {
    expect(new NotFoundError()).to.haveOwnProperty(
      'statusCode',
      httpStatus.NOT_FOUND
    );
  });
});
