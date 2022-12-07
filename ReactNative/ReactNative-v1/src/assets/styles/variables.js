import { Platform } from 'react-native';

const darkGrayColor = '#1D2029';
const whiteColor = '#FFFFFF';

const fontSizes = {
  normalText: 14,
  smallText: 12,
  smallerText: 11,
  smallerText10: 10,
  smallerText9: 9,
  largeText: 16,
  largerText: 18,
  hugeText: 24,
  headerTitleText: 20,
  headerTitleSubText: 14,
  headerNavButtonText: 10, 
};

const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;
const navBarHeight = 64;

export {darkGrayColor, whiteColor, fontSizes, statusBarHeight, navBarHeight};
