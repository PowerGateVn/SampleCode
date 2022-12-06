const redis = require('redis');
const config = require('../../config/index');
const client = redis.createClient(config.redis.url);
const client_db1 = redis.createClient(config.redis.url);
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
module.exports = {
  // @TODO Decide what to do remove / write test
  systemSettingCache(key, value, cb) {
    const obj = {};
    for (const i in value) {
      if (Object.prototype.hasOwnProperty.call(value, i)) {
        const index_key = i.substr(0, i.indexOf('_'));
        const sub_key = i.substr(i.indexOf('_') + 1);
        if (typeof obj[index_key] === 'undefined') {
          obj[index_key] = {};
        }
        obj[index_key][sub_key] = value[i];
      }
    }
    client.set(key, JSON.stringify(obj), cb(obj));
  },
  createCache(key, value, cb) {
    client.set(key, JSON.stringify(value), () => cb(value));
  },
  getCache(key, cb) {
    client.get(key, (err, value) => {
      cb(err, JSON.parse(value));
    });
  },
  /**
   * Delete cache from redis
   * @param {string} key
   */
  deleteCache(key) {
    return client.delAsync(key);
  },
  /**
   * Function is used to add hash and stack
   * Ex.
   * addValueWithStack('key:index',{field1:value1,field1:value2,field3:value3},{'field1:value1':index,'field3:value3':index});
   * addValueWithStack('key:index',{field1:value1,field1:value2,field3:value3},{'field1:value1':[index1,index2]});
   * @param {string} key
   * @param {object} value
   * @param {object} stack
   * @param {function} cb
   */
  addValueWithStack(key, value, stack, cb) {
    const $this = this;
    this.hmset(key, value, (err, result) => {
      if (result) {
        for (const i in stack) {
          if (Object.prototype.hasOwnProperty.call(stack, i)) {
            $this.sadd(i, stack[i]);
          }
        }
      }
      return cb(err, result);
    });
  },
  /**
   * Function is used for set hash
   * Ex:
   * hmset('key',{field1:value1,field2:value2},function(error,value){});
   * @param {string} key
   * @param {object} value
   * @param {function} cb
   * @returns {object}
   */
  hmset(key, value, cb) {
    const value_array = [];
    for (const i in value) {
      if (Object.prototype.hasOwnProperty.call(value, i)) {
        value_array.push(i);
        if (typeof value[i] === 'object') {
          value[i] = JSON.stringify(value[i]);
        }
        value_array.push(value[i]);
      }
    }
    client_db1.hmset(key, value_array, (err, res) => cb(err, res));
  },
  /**
   * Function is used for get value by field
   * Ex:
   * hget([key,field],function(error,value){});
   * @param {array} key
   * @param {function} cb
   */
  hget(key, cb) {
    client_db1.hget(key, (err, res) => {
      let obj = res;
      try {
        obj = JSON.parse(res);
      } catch (e) {
        // Ignore errors
      }
      return cb(err, obj);
    });
  },
  /**
   * Function is used for add stack
   * Ex:
   * sadd(key,[value1,value2]);
   * @param {string} key
   */
  sadd(key, value) {
    return client_db1.sadd(key, value);
  },
  /**
   * Function is used for get value of key
   * Ex:
   * hgetall(key,function(error,value){});
   * @param {string} key
   * @param {function} cb
   */
  hgetall(key, cb) {
    client_db1.hgetall(key, (err, res) => {
      const value = {};
      for (const i in res) {
        if (Object.prototype.hasOwnProperty.call(res, i)) {
          let obj = res[i];
          try {
            obj = JSON.parse(res[i]);
          } catch (e) {
            // Ignore errors
          }
          value[i] = obj;
        }
      }
      return cb(err, value);
    });
  },
  /**
   * Function is used for get multiple value of key's
   * Ex.
   * hgetallKey([key1,key2],function(error,value){});
   * @param {array} keys
   * @param {function} cb
   */
  hgetallKey(keys, cb) {
    const client_multi = client_db1.multi();
    for (const i in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, i)) {
        client_multi.hgetall(keys[i]);
      }
    }
    client_multi.exec((err, res) => {
      const value = [];
      for (const i in res) {
        if (Object.prototype.hasOwnProperty.call(keys, i)) {
          if (res[i] && Object.keys(res[i]).length > 0) {
            const key = {};
            for (const j in res[i]) {
              if (Object.prototype.hasOwnProperty.call(res[i], i)) {
                let obj = res[i][j];
                try {
                  obj = JSON.parse(res[i][j]);
                } catch (e) {
                  // Ignore errors
                }
                key[j] = obj;
              }
            }
            value.push(key);
          }
        }
      }
      return cb(err, value);
    });
  },
  /**
   * Function is used for remover member from member set
   * Ex.
   * srem(key,value,function(error,value){});
   * @param {string} key
   * @param {string} value
   * @param {function} cb
   */
  srem(key, value, cb) {
    client_db1.srem(key, value, (err, result) => {
      cb(err, result);
    });
  },
  /**
   * Function is used for delete hashset
   * Ex.
   * delhash(key,function(error,value){});
   * @param {string} key
   * @param {function} cb
   */
  delhash(key, cb) {
    client_db1.del(key, (err, value) => {
      cb(err, value);
    });
  },
  /**
   * Function is used for get intersect data from member set.
   * Ex.
   * sinter([key1,key2],function(error,value){});
   * @param {array} value
   * @param {function} cb
   */
  sinter(value, cb) {
    client_db1.sinter(value, (err, values) => {
      cb(err, values);
    });
  },
  /**
   * Function is used for get intersect data from member set.
   * Ex.
   * sunion([key1,key2],function(error,value){});
   * @param {array} value
   * @param {function} cb
   */
  sunion(value, cb) {
    client_db1.sunion(value, (err, values) => {
      cb(err, values);
    });
  },
  /**
   * Function is used for get search result
   * Ex.
   * getAndResult([key1,key2],prefix,function(error,result){});
   * @param {array} value
   * @param {string} prefix
   * @param {function} cb
   */
  getAndResult(value, prefix, cb) {
    const $this = this;
    $this.sinter(value, (err, values) => {
      if (err == null && values.length > 0) {
        const keys = [];
        for (const i in values) {
          if (Object.prototype.hasOwnProperty.call(values, i)) {
            keys.push(`${prefix}:${values[i]}`);
          }
        }
        $this.hgetallKey(keys, (error, result) => {
          cb(error, result);
        });
      } else {
        cb(err, values);
      }
    });
  },
  /**
   * Function is used for get search result
   * Ex.
   * getOrResult([key1,key2],prefix,function(error,result){});
   * @param {array} value
   * @param {string} prefix
   * @param {function} cb
   */
  getOrResult(value, prefix, cb) {
    const $this = this;
    $this.sunion(value, (err, values) => {
      if (err == null && values.length > 0) {
        const keys = [];
        for (const i in values) {
          if (Object.prototype.hasOwnProperty.call(values, i)) {
            keys.push(`${prefix}:${values[i]}`);
          }
        }
        $this.hgetallKey(keys, (error, result) => {
          cb(error, result);
        });
      } else {
        cb(err, values);
      }
    });
  },
  /**
   * Function is used to delete multiple member set
   * @param {array} key
   * @param {string} value
   */
  removeAllMember(keys, value) {
    for (const i in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, i)) {
        this.srem(keys[i], value, (err, result) => {});
      }
    }
  },
  /**
   * Function is used for set expire time for redis key
   * @param {string} key
   * @param {function} cb
   */
  expire(key, time, cb) {
    client_db1.expire(key, time, (err, value) => {
      cb(err, value);
    });
  },
  /**
   * Function is used for get key based on regex
   * @param {string} key
   * @param {function} cb
   */
  keys(key, cb) {
    client_db1.keys(key, (err, value) => {
      cb(err, value);
    });
  },
  /**
   * Function is used for get key based on regex
   * @param {string} key
   * @param {function} cb
   */
  keys0(key, cb) {
    client.keys(key, (err, value) => {
      cb(err, value);
    });
  },
  sismember(key, value, cb) {
    client_db1.sismember(key, value, (err, result) => {
      cb(err, result);
    });
  },
  quit() {
    return Promise.all([client.quitAsync(), client_db1.quitAsync()]);
  }
};
