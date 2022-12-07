import {AppState} from 'react-native';
import createEventChannel from '~app/utils/store/createEventChannel';
import {put, take} from 'redux-saga/effects';
import * as AppActions from '~app/actions/app';

function* watchAppState() {
  const appStateChannel = createEventChannel(AppState, 'change');
  while (true) {
    const appState = yield take(appStateChannel);
    yield put(AppActions.setAppState(appState));
  }
}

export default function* appStateSetupSaga() {
  yield put(AppActions.setAppState(AppState.currentState));

  return watchAppState;
}
