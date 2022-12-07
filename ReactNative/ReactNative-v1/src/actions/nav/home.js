import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';
import createNavigationActions from '~app/utils/navigation/createNavigationActions';

import { Carrier } from '~app/models';

import * as BusyActions from '~app/actions/busy';

const log = Logging.getLogger('app.actions.ui.homeNavigation');

const NavigationActions = createNavigationActions('home');

import * as RootActions from './_root';

export function push(routeName, params = {}) {
  return NavigationActions.navigate({routeName, params});
}

export function pop() {
  return NavigationActions.back();
}

export function reset() {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: 'Welcome'}),
    ],
  });
}
