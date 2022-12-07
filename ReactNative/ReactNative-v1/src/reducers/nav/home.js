import { NavigationActions } from 'react-navigation';

import { Navigator } from '~app/screens/home/Navigator';

const initialState = Navigator.router.getStateForAction(
  Navigator.router.getActionForPathAndParams('Welcome'),
);

export default (state = initialState, action) => {
  let newState = undefined;
  if (action.nav === 'home') {
    newState = Navigator.router.getStateForAction(action, state);
  }
  return newState || state;
};
