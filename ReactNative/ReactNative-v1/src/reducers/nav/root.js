import { NavigationActions } from 'react-navigation';

import { Navigator } from '~app/screens/Navigator';

const initialState = Navigator.router.getStateForAction(
  Navigator.router.getActionForPathAndParams('Home'),
);

export default (state = initialState, action) => {
  let newState = undefined;
  if (action.nav === 'root') {
    newState = Navigator.router.getStateForAction(action, state);
  }
  return newState || state;
};
