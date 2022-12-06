import httpErrorHandler from '../../../handlers/httpErrorHandler';
import InternalServerError from '../../../errors/httpErrors/InternalServerError';
import httpStatus from 'http-status';
import { expect, sinon } from '../../helpers/chai';

describe('httpErrorHandler', () => {
  it('handles http error', () => {
    global.loggerServer = {
      error: sinon.spy()
    };
    const res = { status: sinon.stub(), send: sinon.spy() };
    res.status.withArgs(httpStatus.INTERNAL_SERVER_ERROR).returns(res);
    const req = {};
    const error = new InternalServerError();
    const next = sinon.spy();

    httpErrorHandler(error, req, res, next);

    expect(
      res.send.withArgs({
        message: 'Internal server error',
        messageKey: '',
        messageArgs: {}
      })
    ).to.be.calledOnce;
    expect(next).to.not.be.called;
    expect(global.loggerServer.error.withArgs(error)).to.be.calledOnce;
  });

  it('walks through the function for other errors', () => {
    const next = sinon.spy();
    const error = new Error('not to handle');
    const res = {};
    const req = {};

    httpErrorHandler(error, req, res, next);

    return expect(next.withArgs(error)).to.be.calledOnce;
  });
});
