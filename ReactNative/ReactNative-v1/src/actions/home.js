import uuid4 from 'uuid/v4';

import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';
// import sleep from '~app/core/sleep';
import {Carrier, User} from '~app/models';

// import * as StorageOps from '~app/services/localStorage/ops';

import * as BusyActions from './busy';

const log = Logging.getLogger('app.actions.home');
const LOGIN = 'LOGIN'

export function login({email, password}) {
  return {
    type: LOGIN,
    email,
    password
  }
}
