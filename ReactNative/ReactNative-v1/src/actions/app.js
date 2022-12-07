import Logging from '~app/utils/logging';

const log = Logging.getLogger('app.actions.app');

export const SET_APP_STATE = 'SET_APP_STATE';
export const LOADING_STARTED = 'LOADING_STARTED';
export const LOADING_PROGRESS_UPDATE = 'LOADING_PROGRESS_UPDATE';
export const LOADING_FINISHED = 'LOADING_FINISHED';

export function setAppState(state) {
  return {
    type: SET_APP_STATE,
    appState: state,
  };
}

export function startLoading(message, percentComplete = null) {
  log.info('loading started');
  return {
    type: LOADING_STARTED,
    message,
    progressPct: percentComplete,
  };
}

export function updateLoadingProgress(message, percentComplete = undefined) {
  return {
    type: LOADING_PROGRESS_UPDATE,
    message,
    progressPct: percentComplete,
  };
}

export function finishLoading() {
  log.info('loading finished');
  return {
    type: LOADING_FINISHED,
  };
}
