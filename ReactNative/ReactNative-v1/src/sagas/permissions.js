import {Platform} from 'react-native';
import RNPermissions from 'react-native-permissions';

import {Permissions, PermissionStates} from '~app/constants/permissions';
import Logging from '~app/utils/logging';
import {call, thread, takeEvery, take, join, put} from 'redux-saga/effects';

import * as AppActions from '~app/actions/app';
import * as PermissionActions from '~app/actions/permissions';

const log = Logging.getLogger('app.sagas.permissions');

function rnPermissionToState(value) {
  switch (value) {
    case 'authorized': return PermissionStates.Granted;
    case 'denied': return PermissionStates.Rejected;
    case 'restricted': return PermissionStates.Restricted;
    case 'undetermined': return PermissionStates.NotSet;
  }
  throw new Error('unrecognized state returned from react-native-permissions');
}

function* checkRNPermission(name) {
  const result = yield RNPermissions.check(name);
  return rnPermissionToState(result);
}

function* refreshPermissions() {
  log.debug('scanning for permission changes');

  const newState = {};
  newState[Permissions.Location] = yield checkRNPermission('location');

  if ( Platform.OS === 'ios' ) {
    newState[Permissions.PushNotifications] = yield checkRNPermission('notification');
  }
  else {
    // push notification from the messenger service is normal level permission
    // and is granted automatically when C2D_MESSAGE permission is added to
    // the android manifest xml file
    newState[Permissions.PushNotifications] = PermissionStates.Granted;
  }
  Object.entries(newState).forEach(([k, v]) => {
    log.debug(`permission ${k}=${v}`);
  });

  // Make sure these results are actually written back to the store.
  yield put(PermissionActions.updatePermissions(newState));
}

function appIsActive({type, appState}) {
  return type === AppActions.SET_APP_STATE && appState === 'active';
}

function* watchPermissions() {
  while (true) {
    yield take([appIsActive, PermissionActions.REFRESH_PERMISSIONS]);

    yield call(refreshPermissions);
  }
}

function* requestPermission({permission}) {
  switch (permission) {
    case Permissions.Location:
      yield RNPermissions.request('location', 'whenInUse');
      break;
    case Permissions.PushNotifications:
      yield RNPermissions.request('notification', ['alert', 'badge', 'sound']);
      break;
  }
  yield put(PermissionActions.refreshPermissions());
}

function* permissionsLifecycleSaga() {
  // yield thread(watchPermissions);
  yield takeEvery(PermissionActions.REQUEST_PERMISSION, requestPermission);
}

export default function* permissionsSaga() {
  yield call(refreshPermissions);

  return permissionsLifecycleSaga;
}
