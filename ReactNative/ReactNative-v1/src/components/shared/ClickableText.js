import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '~app/assets/styles/common';

class ClickableText extends Component {
  static propTypes = {
    text: PropTypes.string,
    textStyle: PropTypes.textStyle,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    text: 'Button',
    textStyle: [styles.sansBold],
  };

  onPress() {
    if ( this.props.onPress ) {
      return this.props.onPress();
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={::this.onPress}
        activeOpacity={0.5}
        disabled={this.props.disabled}
      >
        <Text style={this.props.textStyle}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default ClickableText;
