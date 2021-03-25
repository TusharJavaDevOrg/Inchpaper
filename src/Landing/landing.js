/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { defaultToast } from '../Functions/functions';
import {
  loginSuccess,
  loginFail,
  skipLogin,
  getuserAddresses,
  getWalletData,
  getUserData,
  addStoreData,
  addNearestSupplier,
  toggleLogin,
  addressSelected,
} from '../Redux/Auth/ActionCreatore';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
    supplier: state.supplier,
  };
};
var fromPage = '';
const mapDispatchToProps = (dispatch) => ({
  addressSelected: () => dispatch(addressSelected()),
  skipLoginForNow: () => dispatch(skipLoginForNow()),
  // addStoreData: (id) => dispatch(addStoreData(id)),
  toggleLogin: (bool) => dispatch(toggleLogin(bool)),
  loginSuccess: (userData) => dispatch(loginSuccess(userData)),
  loginFail: () => dispatch(loginFail()),
  skipLogin: () => dispatch(skipLogin()),
  getuserAddresses: (customerId) => dispatch(getuserAddresses(customerId)),
  getWalletData: (customerId, supplId) =>
    dispatch(getWalletData(customerId, supplId)),
  getUserData: (customerId) => dispatch(getUserData(customerId)),
});
class Landing extends Component {
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () =>
      BackHandler.exitApp(),
    );
  }
  render() {
    return (
      // <Container>
      //   <StatusBar backgroundColor="white" barStyle="dark-content" />
      //   <View style={styles.container}>
      //     <View style={{...StyleSheet.absoluteFill}}>
      //       <Image
      //         source={require('../assets/backgroundhome.png')}
      //         style={styles.image}
      //       />
      //     </View>
      //     <View
      //       style={{
      //         flexDirection: 'row',
      //         justifyContent: 'space-between',
      //         marginHorizontal: 12,
      //       }}>
      //       <TouchableOpacity
      //         onPress={() => this.props.navigation.navigate('Signup')}>
      //         <View style={styles.emptybutton}>
      //           <Text style={styles.emptybuttontext}>SIGN UP</Text>
      //         </View>
      //       </TouchableOpacity>
      //       <TouchableOpacity
      //         onPress={() => this.props.navigation.navigate('Login')}>
      //         <View style={styles.filledbutton}>
      //           <Text style={styles.filledbuttontext}>LOGIN</Text>
      //         </View>
      //       </TouchableOpacity>
      //     </View>
      //   </View>
      // </Container>
      <View style={{ flex: 1, }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <ImageBackground source={require('../assets/landing.png')} style={{ height: Dimensions.get('screen').height, width: Dimensions.get('screen').width, flex: 1 }} resizeMode={'stretch'}>
          <Image source={require('../assets/header.png')} resizeMode={'stretch'} style={{ height: Dimensions.get('screen').height / 14, width: Dimensions.get('screen').width / 3, justifyContent: 'center', alignSelf: 'center', marginTop: '50%' }} />
        </ImageBackground>
        <View style={{ paddingHorizontal: 20, paddingVertical: 25 }}>
          {/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingVertical: 5 }}>Login Or Register</Text> */}
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{ backgroundColor: '#7d0909', borderColor: '#7d0909', borderWidth: 1, padding: 8, width: Dimensions.get('screen').width / 1.8, alignSelf: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto', fontSize: 14, letterSpacing: 1, color: '#fff', textAlign: 'center' }}>Login/Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={async () => {
              await this.props.skipLogin();
              console.log('skipped')
              await this.props.navigation.navigate('Home');
              defaultToast(
                'Login Skipped.',
              );
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center', paddingVertical: 5 }}>Skip For Now</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 15 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingVertical: 5 }}>Proudly Made In India</Text>
            <Icon name="heart" size={20} color={'#ea0016'} style={{ paddingTop: 6, paddingHorizontal: 3 }} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  brandname1: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: Colors.primary,
    letterSpacing: 1,
    fontFamily: 'sans-serif-thin'
  },
  brandname2: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'flex-end',
    paddingRight: '20%',
    color: '#666565',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)