import defined from '~app/utils/defined';

import * as HomeActions from './home';

import {
  NavigationActions,
  goto,
  gotoFeed,
} from './_root';

export function showMainMenu() {
  return NavigationActions.navigate({routeName: 'DrawerOpen'});
}

export function hideMainMenu() {
  return NavigationActions.navigate({routeName: 'DrawerClose'});
}

export function initialize() {
  return ({dispatch, getState}) => {
    if (defined(getState().user)) {
      dispatch(gotoFeed());
    }
    else {
      dispatch(gotoHome());
    }
  };
}

export { goto };

export function gotoHome() {
  return ({dispatch}) => {
    dispatch(HomeActions.reset());
    dispatch(goto('Home'));
  };
}
