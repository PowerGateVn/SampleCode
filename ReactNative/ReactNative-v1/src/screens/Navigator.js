import React from 'react';
import {
  Dimensions,
  Platform,
} from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import connectNavigator from '~app/utils/navigation/connectNavigator';

import Feed from '~app/screens/feed';
import Home from '~app/screens/home';

const Navigator = DrawerNavigator(
  {
    Home: { screen: Home },
    Feed: { screen: Feed },
  },
  {
    drawerPosition: 'left',
    backBehavior: 'none',
    // contentComponent: Component,

    drawerWidth: (
      Math.min(Dimensions.get('window').width, 375) -
      (Platform.OS === 'android' ? 56 : 64)
    ),

    navigationOptions: {
      drawerLockMode: 'locked-closed',
    },
  },
);

export { Navigator };

export default connectNavigator('root', Navigator);
