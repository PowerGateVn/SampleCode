import {eventChannel} from 'redux-saga';

function createEventChannel(target, eventName) {
  return eventChannel(emitter => {
    const listener = event => emitter(event);

    target.addEventListener(eventName, listener);
    return () => {
      target.removeEventListener(eventName, listener);
    };
  });
}

export default createEventChannel;
