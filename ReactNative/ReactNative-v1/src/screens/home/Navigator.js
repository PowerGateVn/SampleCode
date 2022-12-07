import React from 'react';
import { StackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';

import * as HomeActions from '~app/actions/nav/home';
import connectNavigator from '~app/utils/navigation/connectNavigator';
import connectScreen from '~app/utils/navigation/connectScreen';
import styles from '~app/assets/styles/common';

import WelcomeScreen from './WelcomeScreen';

const log = Logging.getLogger('app.ui.screens.home.Navigator');

const Navigator = StackNavigator(
  {
    Welcome: {
      screen: connectScreen(WelcomeScreen, {
        onLogin: () => HomeActions.push('Login'),
        onSignup: () => HomeActions.push('CreateAccount'),
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

export default connectNavigator('home', Navigator);
