import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { whiteColor, offWhiteColor, goldColor, darkGrayColor, backgroundColor,
  fontSizes } from '~app/assets/styles/variables';
import styles from '~app/assets/styles/common';
import Spacer from '~app/components/shared/Spacer';
import withTimers from '~app/components/shared/withTimers';

import { connect } from 'react-redux';

import defined from '~app/utils/defined';

const ReasonPropType = PropTypes.arrayOf(PropTypes.string);

function getLatestReason(reasons) {
  for (let i = reasons.length - 1 ; i >= 0 ; --i) {
    const reason = reasons[i];
    if (defined(reason)) {
      return reason;
    }
  }
  return '';
}

const BusyView = ({reasons}) => (
  <View>
    <ActivityIndicator
      animating={true}
      size="large"
      color = {goldColor}
    />
    <Spacer height={10} />
    <Text style={[styles.sansBold, BusyScreenStyles.mainText]}>
      {getLatestReason(reasons)}
    </Text>
  </View>
);

BusyView.propTypes = {
  reasons: ReasonPropType.isRequired,
};

export { BusyView };

@withTimers
class BusyController extends PureComponent {
  static propTypes = {
    isBusy: PropTypes.bool.isRequired,
    reasons: ReasonPropType,
    children: PropTypes.node.isRequired,
    timers: PropTypes.object.isRequired,
    minDisplayTime: PropTypes.number.isRequired,
  };

  static defaultProps = {
    reasons: [],
    minDisplayTime: 300,
  };

  state = {
    isBusy: this.props.isBusy,
    reasons: this.props.reasons,
  };

  // timer is not state because we don't necessarily want to re-render
  // every time we change it
  timer = null;

  startTimer = () => {
    // kill any currently running timer
    if (this.timer) this.stopTimer();
    this.timer = this.props.timers.setTimeout(
      this.handleTimeout,
      this.props.minDisplayTime,
    );
  }

  stopTimer = () => {
    this.timer();
    this.timer = null;
  }

  handleTimeout = () => {
    this.timer = null;

    // only hide if isBusy is false now otherwise give up control
    if (!this.props.isBusy) {
      this.hide();
    }
  }

  hide = () => {
    if (this.timer) this.stopTimer();
    this.setState({
      isBusy: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    // only change the reasons when isBusy is true to avoid removing
    // them before the modal is fully hidden
    if (nextProps.isBusy) {
      if (
        // rising edge of isBusy, kill the previous timer and start a new one
        !this.props.isBusy ||
        // new reasons were added
        this.props.reasons.length < nextProps.reasons.length
      ) {
        this.startTimer();
      }
      this.setState({
        isBusy: true,
        reasons: nextProps.reasons,
      });
    }
    // falling edge of isBusy, we want to hide it but only if the timer
    // has expired otherwise we'll let it do the hiding
    else if (this.props.isBusy && !nextProps.isBusy && this.timer === null) {
      this.hide();
    }
  }

  componentWillMount() {
    if (this.state.isBusy) {
      this.startTimer();
    }
  }

  render() {
    const {isBusy, reasons} = this.state;
    return (
      <View style={StyleSheet.absoluteFill}>
        {this.props.children}
        <Modal
          animationType="none"
          transparent={true}
          onRequestClose={() => {}}
          visible={isBusy}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContentBlock}>
              <BusyView reasons={reasons} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export { BusyController };

const mapStateToProps = state => ({
  isBusy: state.busy.isBusy,
  reasons: state.busy.reasons.filter(defined),
});

export default connect(mapStateToProps)(BusyController);

const BusyScreenStyles = StyleSheet.create({
  mainText: {
    fontSize: fontSizes.smallText,
    color: goldColor,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
});
