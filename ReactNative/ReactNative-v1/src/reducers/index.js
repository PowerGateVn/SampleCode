import { combineReducers } from 'redux';

import appReducer from './app';
import busyReducer from './busy';
import formReducer from './form';
import navReducer from './nav';
import permissionsReducer from './permissions';
import userReducer from './user';

export default combineReducers({
  app: appReducer,
  nav: navReducer,
  busy: busyReducer,
  form: formReducer,
  permissions: permissionsReducer,
  user: userReducer,
});
