import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Logging from '~app/utils/logging';
import {
  Image,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import * as styleVars from '~app/assets/styles/variables';
import ClickableText from '../shared/ClickableText';
import Sound from 'react-native-sound';

const log = Logging.getLogger('app.ui.components.Player');

class Player extends PureComponent {

  player = null

  constructor(props) {
    super(props);
    this.player = ''
  }

  onPress() {
    Sound.setCategory('Playback');
    const s = new Sound(
      'https://zmp3-mp3-s1-te-vnno-vn-5.zadn.vn/7147afa27be692b8cbf7/3858972813232405650?authen=exp=1515552768~acl=/7147afa27be692b8cbf7/*~hmac=425dc9bc19107de86131578a9209692f&filename=Da-Lo-Yeu-Em-Nhieu-JustaTee.mp3', null, (error) => {
      if (error) {
        log.info('failed to load the sound', error);
        return;
      }

      s.play((success) => {
        if (success) {
          log.info('playing successfully');
          s.setVolume(0.9);
          s.release();
        } else {
          log.info('playback failed due to audio decoding errors: ');
          // reset the player to its uninitialized state (android only)
          // this is the only option to recover after an error occured and use the player again
          s.reset();
        }
      });

      // loaded successfully
      log.info('duration in seconds: ' + s.getDuration() + 'number of channels: ' + s.getNumberOfChannels());
    });
  
  }

  render() {
    return (
      <View style={LoadingStyle.container}>
        <ClickableText onPress={this.onPress} text="Player"/>
      </View>
    );
  }
}

Player.propTypes = {
  show: PropTypes.bool.isRequired,
};

export { Player };

const mapStateToProps = state => ({
  show: true
});

export default connect(mapStateToProps)(Player);

const LoadingStyle = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    // flex: 1,
    // flexDirection: "row",
    justifyContent: 'center',
    height: 50,
    // top: 20,
    left: 0,
    right: 0,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: "#87ceeb",
  },
});
