import * as PermissionActions from '~app/actions/permissions';
import createReducer from '~app/utils/store/createReducer';

const initialState = {};

function permissionsChanged(state, {permissions}) {
  return permissions;
}

const ACTION_HANDLERS = {
  [PermissionActions.PERMISSIONS_CHANGED]: permissionsChanged,
};

export default createReducer(ACTION_HANDLERS, initialState);
