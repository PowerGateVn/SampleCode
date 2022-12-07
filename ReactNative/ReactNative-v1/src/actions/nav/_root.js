import createNavigationActions from '~app/utils/navigation/createNavigationActions';

export const NavigationActions = createNavigationActions('root');

export function goto(section) {
  return NavigationActions.navigate({routeName: section});
}

export function gotoFeed() {
  return goto('Feed');
}
