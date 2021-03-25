import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';

const {width, height} = Dimensions.get('screen');
import {scaleHeight, scaleWidth} from '../Utils/responsive';

export default class Header extends Component {
  render() {
    return (
      <View style={styles.appBar}>
        <View>
          <TouchableOpacity onPress={() => this.props.onPress()}>
            {/* <Image source={require('../images/menu.png')} style={styles.img} /> */}
            <Image source={require('../assets/menu.png')} style={styles.img} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 50 : 50;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flex: 1,
  },

  appBar: {
    backgroundColor: 'transparent',
    height: APPBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginLeft: scaleWidth(15),
  },
  leftBtn: {
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // marginRight: scaleWidth(15)
  },
  leftIcon: {
    height: 20,
    width: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  notification: {
    height: scaleHeight(25),
    width: scaleWidth(25),
    marginRight: 10,
  },
  img: {
    height: 27,
    marginRight: 250,
    marginStart: 10,
    width: 27,
  },
});
