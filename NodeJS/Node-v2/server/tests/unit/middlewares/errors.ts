import { expect, sinon } from '../../helpers/chai';
import IError from '../../../errors/IError';
import errorMiddleware from '../../../middlewares/errors';

describe('Error middleware', () => {
  beforeEach(() => {
    global.loggerServer = {
      error: sinon.stub()
    };
  });

  it('should return a preformated error message on custom errors', () => {
    const customError = new IError(
      'ErrorDomainDefault',
      1,
      'Trip unpaid test',
      {
        test: 'data'
      }
    );

    const status = {
      send: sinon.spy()
    };

    const res = {
      status: sinon.stub().returns(status)
    };
    const next = sinon.spy();
    errorMiddleware(customError, null, res, next);

    expect(status.send).to.be.calledWith({
      errorDomain: 'ErrorDomainDefault',
      errorCode: 1,
      errorMessage: 'Trip unpaid test',
      errorData: { test: 'data' }
    });

    expect(next).not.to.be.called;
  });

  it("should call the next middleware if it's an old error", () => {
    class TestError extends Error {}

    const oldError = new TestError('New Test error');

    const status = {
      send: sinon.spy()
    };

    const res = {
      status: sinon.stub().returns(status)
    };
    const next = sinon.spy();
    errorMiddleware(oldError, null, res, next);

    expect(status.send).not.to.be.called;
    expect(next).to.be.calledWith(oldError);
  });
});
