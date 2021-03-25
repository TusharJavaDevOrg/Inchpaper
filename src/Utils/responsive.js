import {Dimensions, Platform} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
//BASED on iphone 6 scale
const scale = SCREEN_WIDTH / 375;
const ScaleHeight = SCREEN_HEIGHT / 667;
const ScaleWidth = SCREEN_WIDTH / 375;
const ScaleWidthMenu = (SCREEN_WIDTH - 68) / 387;

export function noramalizeFont(size) {
  if (Platform.OS === 'ios') {
    return Math.round(size * ScaleWidth);
  } else {
    return Math.round(size * ScaleHeight);
  }
}

export function scaleHeight(height) {
  return Math.round(height * ScaleHeight);
}

export function scaleWidth(width) {
  return Math.round(width * ScaleWidth);
}

export function scaleWidthMenu(width) {
  return Math.round(width * ScaleWidthMenu);
}

export function noramalizeFontMenu(size) {
  if (Platform.OS === 'ios') {
    return Math.round(size * ScaleWidthMenu);
  } else {
    return Math.round(size * ScaleHeight);
  }
}
