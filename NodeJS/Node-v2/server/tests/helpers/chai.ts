import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiSubset);

chai.config.includeStack = true;

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('\nUnhandled rejection:\n', promise);
  process.exit(1);
});

export { expect, sinon };
