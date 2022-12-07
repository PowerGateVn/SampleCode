import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class Timers extends PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };

  _timers = [];

  setTimeout(cb, delay) {
    function createTimer(cancelFn) {
      return setTimeout(function() {
        cancelFn();
        cb();
      }, delay);
    }
    return this._addTimer(
      createTimer,
      (h) => {
        if (h !== null) clearTimeout(h);
      },
    );
  }

  setInterval(cb, delay) {
    return this._addTimer(
      () => setInterval(cb, delay),
      (h) => {
        if (h !== null) clearInterval(h);
      },
    );
  }

  requestAnimationFrame(cb) {
    return this._addTimer(
      () => requestAnimationFrame(cb),
      (h) => {
        if (h !== null) cancelAnimationFrame(h);
      },
    );
  }

  _addTimer(createFn, destroyFn) {
    let handle = null;
    let cancelFn = () => {
      if (handle !== null) {
        destroyFn(handle);
        this._removeTimer(cancelFn);
        handle = null;
        cancelFn = null;
      }
    };
    handle = createFn(cancelFn);
    this._timers.push(cancelFn);
    return cancelFn;
  }

  _removeTimer(timer) {
    this._timers = this._timers.filter(c => c !== timer);
  }

  api = {
    setTimeout: this.setTimeout.bind(this),
    setInterval: this.setInterval.bind(this),
    requestAnimationFrame: this.requestAnimationFrame.bind(this),
  };

  componentWillUnmount() {
    const cancelFns = this._timers.slice();
    this._timers = [];
    cancelFns.forEach(fn => fn());
  }

  render() {
    return this.props.render(this.api);
  }
}

export default Timers;
