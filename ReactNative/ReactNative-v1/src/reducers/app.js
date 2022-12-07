import * as AppActions from '~app/actions/app';
import createReducer from '~app/utils/store/createReducer';

const initialState = {
  state: 'active',
  isActive: true,
  isLoading: false,
  loadingMessage: null,
  loadingProgressPct: null,
};

function setAppState(state, {appState}) {
  return {
    ...state,
    state: appState,
    isActive: appState !== 'background' && appState !== 'terminated',
  };
}

function loadingStarted(state, {message, progressPct = null}) {
  return {
    ...state,
    isLoading: true,
    loadingMessage: message,
    loadingProgressPct: progressPct,
  };
}

function loadingProgressUpdated(state, {message, progressPct = undefined}) {
  if (progressPct === undefined) {
    progressPct = state.loadingProgressPct;
  }
  return {
    ...state,
    isLoading: true,
    loadingMessage: message,
    loadingProgressPct: progressPct,
  };
}

function loadingFinished(state) {
  return {
    ...state,
    isLoading: false,
  };
}

const ACTION_HANDLERS = {
  [AppActions.SET_APP_STATE]: setAppState,
  [AppActions.LOADING_STARTED]: loadingStarted,
  [AppActions.LOADING_PROGRESS_UPDATE]: loadingProgressUpdated,
  [AppActions.LOADING_FINISHED]: loadingFinished,
};

export default createReducer(ACTION_HANDLERS, initialState);
