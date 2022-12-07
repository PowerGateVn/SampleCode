import createReducer from '~app/utils/store/createReducer';

import * as UserActions from '~app/actions/user';

const initialState = null;

function setUser(state, {user}) {
  return user;
}

const ACTION_HANDLERS = {
  [UserActions.SET_USER]: setUser,
};

export default createReducer(ACTION_HANDLERS, initialState);
