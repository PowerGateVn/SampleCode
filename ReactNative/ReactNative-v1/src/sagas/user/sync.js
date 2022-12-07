import {
    actionChannel,
    all,
    call,
    delay,
    getContext,
    race,
    thread,
    sigint,
    join,
    put,
    putResolve,
    take,
  } from 'redux-saga/effects';
  import Logging from '~app/utils/logging';
  
  const log = Logging.getLogger('app.sagas.user.sync');
  
  export default function* userSyncSaga() {
  }
  