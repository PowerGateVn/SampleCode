import Logging from '~app/utils/logging';

const log = Logging.getLogger('app.actions.busy');

export const SET_BUSY_FLAG = 'SET_BUSY_FLAG';
export const CLEAR_BUSY_FLAG = 'CLEAR_BUSY_FLAG';

export function setBusyFlag(reason) {
  return ({dispatch, getState}) => {
    const token = getState().busy.uniqueToken;
    log.debug(`setting busy flag for token=${token}`);
    dispatch({
      type: SET_BUSY_FLAG,
      token,
      reason,
    });
    return token;
  };
}

export function clearBusyFlag(token) {
  log.debug(`clearing busy flag for token=${token}`);
  return {
    type: CLEAR_BUSY_FLAG,
    token,
  };
}
