import { decorator } from '../../../routes/users';
import { expect, sinon } from '../../helpers/chai';

describe('User routes', () => {
  it('registers /users routes', () => {
    const router = {
      get: sinon.stub(),
      put: sinon.stub(),
      post: sinon.stub(),
      all: sinon.spy()
    };

    router.get.returns(router);
    router.put.returns(router);
    router.post.returns(router);

    decorator(router);

    expect(router.all.withArgs('/users/*', sinon.match.func)).to.be.calledOnce;

    expect(
      router.get.withArgs('/users/', sinon.match.func),
      "Expected to be called with ['/users', function]"
    ).to.be.calledOnce;

    expect(
      router.put.withArgs('/users/', sinon.match.func, sinon.match.func),
      "Expected to be called with ['/users', validation, function]"
    ).to.be.calledOnce;

  });
});
