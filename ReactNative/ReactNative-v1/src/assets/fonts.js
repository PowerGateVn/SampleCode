import { Platform } from 'react-native';

const fonts = {};

/**
 * In order to get the ios font name:
 * 1. Open Font Book.app.
 * 2. Select the font.
 * 3. Hit Cmd-I.
 * 4. Copy the "Postscript name".
 *
 * In order to get the android font name:
 * 1. Copy the filename.
*/
function defineFont(name, iosName, androidName) {
  fonts[name] = Platform.OS === 'ios' ? iosName : (
    androidName ? androidName : iosName);
}

defineFont(
  'FontAwesome',
  'FontAwesome',
);
defineFont(
  'IonIcons',
  'Ionicons',
  'IonIcons',
);
defineFont(
  'MaterialIcons',
  'MaterialIcons-Regular',
);
defineFont(
  'SimpleLineIcons',
  'simple-line-icons',
  'SimpleLineIcons',
);

defineFont(
  'OpenSans',
  'OpenSans',
  'OpenSans-Regular',
);
defineFont(
  'OpenSans-Bold',
  'OpenSans-Bold',
);
defineFont(
  'OpenSans-BoldItalic',
  'OpenSans-BoldItalic',
);
defineFont(
  'OpenSans-ExtraBold',
  'OpenSans-Extrabold',
  'OpenSans-ExtraBold',
);
defineFont(
  'OpenSans-ExtraBold-Italic',
  'OpenSans-ExtraboldItalic',
  'OpenSans-ExtraBoldItalic',
);
defineFont(
  'OpenSans-Italic',
  'OpenSans-Italic',
);
defineFont(
  'OpenSans-Light',
  'OpenSans-Light',
);
defineFont(
  'OpenSans-Light-Italic',
  'OpenSansLight-Italic',
  'OpenSans-LightItalic',
);
defineFont(
  'OpenSans-SemiBold',
  'OpenSans-Semibold',
);
defineFont(
  'OpenSans-SemiBold-Italic',
  'OpenSans-SemiboldItalic',
);

export default fonts;
