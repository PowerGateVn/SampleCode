import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import images from '~app/assets/images';
import * as styleVars from '~app/assets/styles/variables';

const Loading = () => (
  <View style={LoadingStyle.container}>
    <Image source={images.LaunchLogo} />
  </View>
);

Loading.propTypes = {
  loadingMessage: PropTypes.string.isRequired,
  loadingProgressPct: PropTypes.number,
};

export { Loading };

const mapStateToProps = state => ({
  loadingMessage: state.app.loadingMessage,
  loadingProgressPct: state.app.loadingProgressPct,
});

export default connect(mapStateToProps)(Loading);

const LoadingStyle = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#291405",
  },
});
