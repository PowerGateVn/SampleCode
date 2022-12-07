import PropTypes from 'prop-types';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import {
  ActionSheetProvider,
} from '@expo/react-native-action-sheet';

import Root from './Root';

const RootWrapper = ({store}) => (
  <StoreProvider store={store}>
    <ActionSheetProvider>
      <Root />
    </ActionSheetProvider>
  </StoreProvider>
);

RootWrapper.propTypes = {
  store: PropTypes.object.isRequired,
};

export default RootWrapper;
