import { expect, sinon } from '../../helpers/chai';
import wrap from '../../../routes/wrap';

describe('Wrap', () => {
  it('handles promise rejection', async () => {
    const error = new Error();
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(() => Promise.reject(error))(req, res, next);
    expect(next.withArgs(error)).to.be.calledOnce;
  });

  it('handles empty promise rejection', async () => {
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(() => Promise.reject())(req, res, next);
    expect(next).to.be.calledOnce;
  });

  it('handles throw sync errors', async () => {
    const error = new Error();
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(() => {
      throw error;
    })(req, res, next);
    expect(next.withArgs(error)).to.be.calledOnce;
  });
  it('handles throw async errors', async () => {
    const error = new Error();
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(async () => {
      throw error;
    })(req, res, next);
    expect(next.withArgs(error)).to.be.calledOnce;
  });

  it('does nothing on promise resolve', async () => {
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(() => Promise.resolve())(req, res, next);
    expect(next).to.not.be.called;
  });

  it('does nothing on return value', async () => {
    const next = sinon.spy();
    const req = {};
    const res = {};

    await wrap(() => 'my value')(req, res, next);
    expect(next).to.not.be.called;
  });
});
