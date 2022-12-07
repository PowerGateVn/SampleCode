import PropTypes from 'prop-types';
import React from 'react';
import { View } from "react-native";
import { connect } from 'react-redux';

import ENV from '~app/env';
import BusyController from '~app/components/shared/BusyController';
import StatusBarOffsetWrapper from '~app/components/shared/StatusBarOffsetWrapper';

import Loading from './Loading';
import Navigator from './Navigator';
import Player from '../components/player';
import Spacer from '../components/shared/Spacer';

const Root = ({isActive, isLoading}) => (
  <StatusBarOffsetWrapper>
    <BusyController>
      {isLoading ? <Loading /> : <Navigator />}
      <Player/>
    </BusyController>
    {!isActive && <Loading />}
  </StatusBarOffsetWrapper>
);

Root.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isActive: state.app.isActive,
  isLoading: state.app.isLoading,
});

export default connect(mapStateToProps)(Root);
