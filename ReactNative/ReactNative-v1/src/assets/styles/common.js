import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
} from 'react-native';

import getFont from '~app/utils/getFont';

import * as styleVars from './variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styleVars.backgroundColor,
    marginBottom: 50
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickableText: {
    fontSize: styleVars.fontSizes.normalText,
    color: styleVars.goldColor,
    textAlign: 'left',
  },
  navHeader: {

  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  openSansFont: {
    fontFamily: getFont('OpenSans'),
  },
  sansLight: {
    fontFamily: getFont('OpenSans-Light'),
  },
  sansBold: {
    fontFamily: getFont('OpenSans-Bold'),
  },
  sansSemibold: {
    fontFamily: getFont('OpenSans-SemiBold'),
  },
  sansExtrabold: {
    fontFamily: getFont('OpenSans-ExtraBold'),
  },
});

export default styles;
