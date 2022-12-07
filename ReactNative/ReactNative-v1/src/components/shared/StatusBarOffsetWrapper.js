import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Spacer from '~app/components/shared/Spacer';
import styles from '~app/assets/styles/common';
import { statusBarHeight, whiteColor } from '~app/assets/styles/variables';

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    alignSelf: 'stretch',
  },
});

const Wrapper = ({children}) => (
  <View style={pageStyles.container}>
    <Spacer height={statusBarHeight} color="#000000" />
    <View style={pageStyles.container}>
      {children}
    </View>
  </View>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
