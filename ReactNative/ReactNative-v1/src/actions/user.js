import invariant from 'invariant';
import * as Keychain from 'react-native-keychain';
import * as RNFS from 'react-native-fs';

import uuid4 from 'uuid/v4';
import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';
// import {createRoutine} from '~app/core/routines';
// import * as StorageOps from '~app/services/localStorage/ops';
import * as BusyActions from './busy';

const log = Logging.getLogger('app.actions.user');

export const SET_USER = 'SET_USER';
export const USER_DID_LOGIN = 'USER_DID_LOGIN';
export const USER_WILL_LOGOUT = 'USER_WILL_LOGOUT';
export const USER_DID_LOGOUT = 'USER_DID_LOGOUT';

// export const logoutRoutine = createRoutine('USER_LOGOUT_ROUTINE');

const AVATAR_DIR = `${RNFS.DocumentDirectoryPath}/Avatars`;

export function initialize() {
  return async ({dispatch, db, getState}) => {

    // Make sure we have a place to store our avatar images.
    await RNFS.mkdir(AVATAR_DIR, {NSURLIsExcludedFromBackupKey: false});
  }
}