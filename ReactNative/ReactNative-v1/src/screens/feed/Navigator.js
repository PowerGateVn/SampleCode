import React from 'react';
import { StackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import defined from '~app/utils/defined';

import * as FeedActions from '~app/actions/nav/feed';
import * as RootActions from '~app/actions/nav/root';
import connectNavigator from '~app/utils/navigation/connectNavigator';
import connectScreen from '~app/utils/navigation/connectScreen';
import styles from '~app/assets/styles/common';
import Feed from './Feed';

const Navigator = StackNavigator(
  {
    Feed: {
      screen: connectScreen(Feed, {
        onShowMenu: () => RootActions.showMainMenu(),
      }),
    }
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: styles.navHeader,
      gesturesEnabled: false,
    },
    transitionConfig: getSlideFromRightTransition,
  },
);

export { Navigator };

export default connectNavigator('feed', Navigator);
