import Logging from '~app/utils/logging';
import {
  call,
  delay,
  getContext,
  sigint,
  join,
  put,
  take,
} from 'redux-saga/effects';

import syncSaga from './sync';

import * as UserActions from '~app/actions/user';

const log = Logging.getLogger('app.sagas.user.lifecycle');

export function* waitForUser() {
  const {getState} = yield getContext('services');
  log.trace('waiting for a user login');
  if (!getState().user || !getState().user.isLoggedIn) {
    yield take(UserActions.USER_DID_LOGIN);
  }
  log.trace('got a user login');
  return getState().user;
}

export function* waitForLogout() {
  yield take(UserActions.USER_WILL_LOGOUT);
}

function* userSagas() {
  yield thread(syncSaga);
}

function* watchUserSaga() {
  while (true) {
    yield call(waitForUser);
    log.debug('detected user login, starting sagas');

    // const userTask = yield thread(userSagas);

    // start a task that will complete when the USER_DID_LOGOUT occurs
    // we do this before waitForLogout to ensure we don't miss the
    // USER_DID_LOGOUT action
    // const logoutTask = yield thread(function* watchLogout() {
    //   yield take(UserActions.USER_DID_LOGOUT);
    // });

    yield take(UserActions.logoutRoutine.TRIGGER);

    log.debug('interrupting user sagas');
    yield sigint(userTask);
    log.debug('waiting for user sagas to complete');
    yield join(userTask);
    log.debug('finished user sagas, completing logout');

    yield put(UserActions.logoutRoutine.success());

    // wait for logout to complete before waiting for login
    yield join(logoutTask);
  }
}

export default function* userSaga() {
  log.debug('initializing profile');
  yield put.resolve(UserActions.initialize());

  return watchUserSaga;
}
