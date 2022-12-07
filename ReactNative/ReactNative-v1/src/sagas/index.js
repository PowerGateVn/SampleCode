import {all, fork, call, join, put, getContext} from 'redux-saga/effects';

import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';
import ENV from '~app/env';

import * as AppActions from '~app/actions/app';
import * as RootNavigationActions from '~app/actions/nav/root';

import appStateSaga from './appState';
import permissionsSaga from './permissions';
import userSaga from './user';

const log = Logging.getLogger('app.sagas.index');

function* initializeServices() {
  const {db, backend} = yield getContext('services');
  let resetData = {};
  if(ENV.DEBUG) {
    resetData = async () => await AsyncStorage.getItem('debug.resetAppDataOnStartup')
  }

  // yield call([db, 'initialize'], {reset: !!resetData.db}),
  yield call([backend, 'initialize'], {reset: !!resetData.backend});
}

function* mainSaga() {
  yield put(AppActions.startLoading('Initializing ...', null));
  log.debug('initializing services');
  yield call(initializeServices);

  log.debug('preparing sagas');
  const sagas = [];
  // sagas.push(yield call(appStateSaga));
  // sagas.push(yield call(permissionsSaga));
  // sagas.push(yield call(userSaga));

  yield put(RootNavigationActions.initialize());
  yield put(AppActions.finishLoading());

  log.debug("Set don't need reset stored data.");

  // if you want reset data on next startup please set db and backend => true
  (async () => await AsyncStorage.setItem('debug.resetAppDataOnStartup', {
    db: false,
    backend: false
  }).then(() => {
    log.debug("Set don't need reset stored data. => success")
  }));

  // const tasks = yield all(sagas.filter(defined).map(fork));
  // yield join(...tasks);
}

export default mainSaga;
