import httpStatus from 'http-status';
import { ValidationError } from 'express-validation';
import { expect, sinon } from '../../helpers/chai';
import validationErrorHandler from '../../../handlers/validationErrorHandler';

describe('validationErrorHandler', () => {
  it('handles validation error', () => {
    const res = {
      status: sinon.stub(),
      send: sinon.stub()
    };
    const req = {};
    const errors = [
      {
        messages: ['"field 1" is required']
      },
      {
        messages: ['"field 2" must be a number', '"field 2" is required']
      }
    ];
    const options = {
      flatten: false,
      status: httpStatus.BAD_REQUEST,
      statusText: httpStatus['400_MESSAGE']
    };
    const error = new ValidationError(errors, options);
    const next = sinon.spy();

    res.status.withArgs(httpStatus.BAD_REQUEST).returns(res);

    validationErrorHandler(error, req, res, next);

    return Promise.all([
      expect(
        res.send.withArgs({
          messages: [
            '"field 1" is required',
            '"field 2" must be a number',
            '"field 2" is required'
          ]
        })
      ).to.be.calledOnce,
      expect(next).to.not.be.called
    ]);
  });

  it('walks through the function for other errors', () => {
    const next = sinon.spy();
    const error = new Error('not to handle');
    const res = {};
    const req = {};

    validationErrorHandler(error, req, res, next);

    return expect(next.withArgs(error)).to.be.calledOnce;
  });
});
