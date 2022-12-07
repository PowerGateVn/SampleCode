import Logging from '~app/utils/logging';
import createNavigationActions from '~app/utils/navigation/createNavigationActions';

const log = Logging.getLogger('app.actions.ui.feedNavigation');

const NavigationActions = createNavigationActions('feed');

export function push(routeName, params = {}) {
  return NavigationActions.navigate({routeName, params});
}

export function pop() {
  return NavigationActions.back();
}
