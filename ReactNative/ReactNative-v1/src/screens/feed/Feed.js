import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import ENV from '~app/env';
// import moment from '~app/core/moment';
import defined from '~app/utils/defined';
import Logging from '~app/utils/logging';
import { darkGrayColor, whiteColor, fontSizes } from '~app/assets/styles/variables';
import styles from '~app/assets/styles/common';
import Spacer from '~app/components/shared/Spacer';

const log = Logging.getLogger('app.ui.screens.feed.Feed');

class Feed extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    onShowMenu: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  static navigationOptions = ({navigation}) => {
    const { state } = navigation;
    return {
      title: 'FEED',
    };
  };

  constructor(props) {
    super(props);

    log.debug(`login notification flag: ${props.notifications}`);
    this.state = {
    };
  }
  
  componentWillMount() {
    
    this.props.navigation.setParams({
      onShowMenu: this.props.onShowMenu,
    });
  }

  componentWillReceiveProps(nextProps) {
    
  }
  
  render() {
    const {
      user,
    } = this.props;
    
    const disableButtons = !__DEV__; // !ENV.DEBUG;
      
    return (
      <ScrollView style={[styles.container, {flexDirection: 'column'}]}>
        
        <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
          <Text>Logged</Text>
        </View>
        <Spacer height={10} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  notifications: state.notifications,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const feedStyles = StyleSheet.create({
  testText: {
    color: "#FFFFFF"
  }
});
