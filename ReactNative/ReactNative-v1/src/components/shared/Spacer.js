import React, {Component} from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const Spacer = ({width, height, color}) => (
  <View style={[{width, height, alignSelf: 'stretch'}, color && {backgroundColor: color}]} />
);

Spacer.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default Spacer;
