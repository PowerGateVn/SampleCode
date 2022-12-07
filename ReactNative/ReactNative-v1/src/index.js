import React, { PureComponent, Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';

import Screens from './screens';
import main from './main';

class AppName extends PureComponent {
  render() {

    return (
        <Screens store={main.services.store}/>
    );
  }
}

function load() {
  main.start();

  AppRegistry.registerComponent('FeedBands', () => AppName);
}

export default load;
