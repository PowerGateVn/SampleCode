import { NavigationActions } from 'react-navigation';

import { Navigator } from '~app/screens/feed/Navigator';

const initialState = Navigator.router.getStateForAction(
  Navigator.router.getActionForPathAndParams('Feed'),
);

export default (state = initialState, action) => {
  let newState = undefined;
  if (action.nav === 'feed') {
    newState = Navigator.router.getStateForAction(action, state);
  }
  return newState || state;
};
