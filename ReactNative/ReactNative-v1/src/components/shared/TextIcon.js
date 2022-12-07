import React, {Component} from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import getFont from '~app/utils/getFont';
import { darkGrayColor, transparentColor, fontSizes } from '~app/assets/styles/variables';

import fontAwesomeGlyphMap from '~app/assets/fonts/FontAwesome.json';
import ionIconsGlyphMap from '~app/assets/fonts/IonIcons.json';
import simpleLineIconsGlyphMap from '~app/assets/fonts/SimpleLineIcons.json';
import materialIconsDict from '~app/assets/fonts/MaterialIcons-Regular.json';

const DEFAULT_ICON_SIZE = fontSizes.normalText;
const DEFAULT_ICON_COLOR = darkGrayColor;

const materialIconsGlyphMap = () => {
  const MIDict = materialIconsDict['icons'];
  let glyphMap = {};
  for ( var key in MIDict ) {
    glyphMap[MIDict[key].name] = parseInt('0x'+key);
  }
  return glyphMap;
};

class TextIcon extends Component {
  static propTypes = {
    name: PropTypes.string,
    fontFamily: PropTypes.string.isRequired,
    glyphMap: PropTypes.object.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.textStyle,
  };

  static defaultProps = {
    size: DEFAULT_ICON_SIZE,
    allowFontScaling: false,
  };

  setNativeProps(nativeProps) {
    if (this.root) {
      this.root.setNativeProps(nativeProps);
    }
  }

  root = null;
  handleRef = ref => {
    this.root = ref;
  };

  render() {
    const { name, fontFamily, glyphMap, size, color, style, ...props } = this.props;

    //invariant(name, "Must specify icon name");
    //invariant(glyphMap[name], "Can't find icon name '" + name + "' in font family '" + fontFamily + "'");

    let glyph = name ? glyphMap[name] || '?' : '';
    if (typeof glyph === 'number') {
      glyph = String.fromCharCode(glyph);
    }

    const styleDefaults = {
      fontSize: size,
      color,
      backgroundColor: transparentColor,
    };

    const styleOverrides = {
      fontFamily: fontFamily,
      fontWeight: 'normal',
      fontStyle: 'normal',
    };

    props.style = [styleDefaults, style, styleOverrides];
    props.ref = this.handleRef;

    return <Text {...props}>{glyph}{this.props.children}</Text>;
  }
}

const FontAwesomeIcon = (props) => (
  <TextIcon
    {...props}
    fontFamily={getFont('FontAwesome')}
    glyphMap={fontAwesomeGlyphMap}
  />
);

const SimpleLineIcon = (props) => (
  <TextIcon
    {...props}
    fontFamily={getFont('SimpleLineIcons')}
    glyphMap={simpleLineIconsGlyphMap}
  />
);

const IonIcon = (props) => (
  <TextIcon
    {...props}
    fontFamily={getFont('IonIcons')}
    glyphMap={ionIconsGlyphMap}
  />
);

export {
  FontAwesomeIcon,
  IonIcon,
  SimpleLineIcon,
  TextIcon,
};
