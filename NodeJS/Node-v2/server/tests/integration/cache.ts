import bluebird from 'bluebird';
import { expect } from 'chai';
import redis from 'redis';
import config from '../../../config';
import cache from '../../helpers/cache';

bluebird.promisifyAll(redis);

describe('cache', () => {
  const client = redis.createClient(config.redis.url);

  beforeEach('clear redis content', () => {
    return client.flushallAsync();
  });

  it('stores value', () => {
    // When
    return (
      new Promise(resolve => cache.createCache('myKey', 'myValue', resolve))
        // Then
        .then(cacheResult => {
          return client.getAsync('myKey').then(redisResult => {
            return [cacheResult, redisResult];
          });
        })
        .then(([cacheResult, redisResult]) => {
          expect(cacheResult).to.be.equal('myValue');
          expect(redisResult).to.be.equal('"myValue"');
        })
    );
  });

  it('fetches value', () => {
    // Given
    return (
      client
        .setAsync('myKey', '{"myValue":"myValue"}')
        // When
        .then(() => {
          return new Promise(resolve =>
            cache.getCache('myKey', (error, result) => resolve(result))
          );
        })
        // Then
        .then(result => {
          expect(result).to.deep.equal({ myValue: 'myValue' });
        })
    );
  });

  it('deletes values', () => {
    // Given
    return (
      client
        .setAsync('myKey', 'any-value')
        // When
        .then(() => cache.deleteCache('myKey'))
        // Then
        .then(() => client.keysAsync('*'))
        .then(keys => expect(keys).to.have.length(0))
    );
  });

  after('disconnect redis', () => {
    return Promise.all([client.quitAsync(), cache.quit()]);
  });
});
