import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as HomeActions from '~app/actions/home';
import styles from '~app/assets/styles/common';
import { whiteColor, fontSizes } from '~app/assets/styles/variables';


class Welcome extends Component {

  static navigationOptions = ({navigation}) => {
    const { state } = navigation;
    return {
      title: 'DASHBOARD',
    };
  };

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
  };
  
  render() {
    return (
      <View style={[styles.container, {flexDirection: 'column', justifyContent: "flex-end"}]}>
        <Text style={welcomeStyles.wellcomeText}>Wellcome QuyenHoang</Text>
      </View>
    );
  }
}

const mapDispatchToProps = {
  ...HomeActions,
};

export default connect(null, mapDispatchToProps)(Welcome);

const welcomeStyles = StyleSheet.create({
  wellcomeText: {
    color: "#000000",
  }
});
