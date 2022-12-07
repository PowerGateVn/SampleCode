import invariant from 'invariant';

import * as BusyActions from '~app/actions/busy';
import createReducer from '~app/utils/store/createReducer';

const initialState = {
  isBusy: false,
  reasons: [],
  tokens: [],
  uniqueToken: 1,
};

function setBusyFlag(state, {token, reason}) {
  const tokenIndex = state.tokens.indexOf(token);
  invariant(tokenIndex === -1, `busy token ${token} is already being used`);
  return {
    ...state,
    reasons: [...state.reasons, reason],
    tokens: [...state.tokens, token],
    isBusy: true,
    uniqueToken: state.uniqueToken + 1,
  };
}

function clearBusyFlag(state, {token}) {
  const tokenIndex = state.tokens.indexOf(token);
  invariant(tokenIndex >= 0, `busy token ${token} could not be found`);
  const newReasons = state.reasons.slice();
  const newTokens = state.tokens.slice();
  newReasons.splice(tokenIndex, 1);
  newTokens.splice(tokenIndex, 1);
  return {
    ...state,
    reasons: newReasons,
    tokens: newTokens,
    isBusy: newReasons.length > 0,
  };
}

const ACTION_HANDLERS = {
  [BusyActions.SET_BUSY_FLAG]: setBusyFlag,
  [BusyActions.CLEAR_BUSY_FLAG]: clearBusyFlag,
};

export default createReducer(ACTION_HANDLERS, initialState);
