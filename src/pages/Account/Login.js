/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView, Image
} from 'react-native';
//import {Button, Icon, Container, Header} from 'native-base';
import { SocialIcon } from 'react-native-elements';
import InputOutline from 'react-native-input-outline';
import { errorToast, warnToast } from '../../Functions/functions'
import Style from '../../Components/Style';
import IconHeaderComponenet from '../../Components/IconHeaderComponenet';
import { Header, Icon } from 'react-native-elements';
import { supplierId, validatePhoneNumberUrl, testPhoneNumber } from '../../../Config/Constants';
import SmsRetriever from 'react-native-sms-retriever';
import Axios from 'axios';
import { Colors } from '../../config/GlobalContants';
import { Platform } from 'react-native';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      toAddress: false,
      mobile: '',
      showModal: false,
      firstCode: '',
      secondCode: '',
      thirdCode: '',
      fourthCode: '',
      fifthCode: '',
      sixthCode: '',
      code: '',
      resendOtp: 1,
      showlogin: true,
      down: true,
      time: 0
    };
  }
  async componentDidMount() {
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.showNumber();
    });
    setInterval(() => {
      var t = this.state.time;
      this.setState({ time: t - 1 });
    }, 1000);
  }
  showNumber = () => {
    setTimeout(async () => {
      await this._onPhoneNumberPressed();
    }, 500)
  }

  _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      if (phoneNumber.length == 10) {
        this.setState({ check: true, mobile: phoneNumber })
        await this.validatePhoneNumber(this.state.mobile);
        // await this._onSmsListenerPressed();
      } else if (phoneNumber.length > 10 && phoneNumber.length <= 13) {
        var finalNum = phoneNumber.substr(phoneNumber.length - 10);
        this.setState({ mobile: finalNum });
        await this.validatePhoneNumber(this.state.mobile);
        // await this._onSmsListenerPressed();
        console.log('phone number', finalNum)
      }

    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  async validatePhoneNumber(phoneNumber) {
    this.setState({ validatingPhoneNumber: true });
    console.log('Validating phone number', phoneNumber);
    var phoneno = /^\d{10}$/;

    if (phoneNumber.length < 10) {
      warnToast(
        'Please Enter a Valid Phone Number For OTP Verification.',

      );
    } else if (!phoneno.test(parseInt(phoneNumber))) {
      warnToast(
        'Please Enter a Valid Phone Number For OTP Verification.',

      );
    } else {
      var url = validatePhoneNumberUrl(supplierId, phoneNumber);
      console.log('login urlllll', url);
      await Axios.get(url)
        .then((resp) => {
          console.log('Responce from server =====================', resp);
          this.setState({ showModal: true, validatingPhoneNumber: false });
          this.props.navigation.navigate('OTP', { mobile: phoneNumber })
        })
        .catch((err) => {
          this.setState({ validatingPhoneNumber: false });
          errorToast(err.message)
          console.log('phone validation error =====================', err.message);
        });
    }
  }


  componentWillUnmount() {

    if (Platform.OS == 'android') {
      SmsRetriever.removeSmsListener();
    }
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar hidden={false} backgroundColor="transparent" barStyle="dark-content" />
        {/* <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Landing')} iconName='close-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          containerStyle={{ position: 'absolute', top: 0 }}
        /> */}
        <View style={{ flex: 1, }}>

          <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'padding'} style={{ flex: 1 }}>
              {/* <View style={{ height: Dimensions.get('screen').height / 1.8, width: Dimensions.get('window').width, }}>
                <Image source={require('../../assets/login.png')} style={{ height: '100%', width: '110%' }} resizeMode={'cover'} />
              </View> */}
              <View style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 10, paddingTop: '25%' }}>
                <View style={{ paddingVertical: 20 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 30, textAlign: 'center', color: Colors.black }}>Welcome!</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, paddingLeft: '3%', color: Colors.primary, paddingTop: 15 }}>Register and Get</Text>
                  <Text style={{ fontSize: 13, paddingLeft: '3%', width: '98%', paddingVertical: 5, fontFamily: 'sans-serif', fontSize: 14 }}>Rs. 1000/- credits in your inchpaper wallet and</Text>
                  <Text style={{ fontSize: 13, paddingLeft: '3%', width: '98%', paddingVertical: 5, fontFamily: 'sans-serif', fontSize: 14 }}>Get upto 80% Discount on your Favourite Stationery</Text>
                </View>
                {/* <View style={{ height: 2, width: '100%', borderColor: '#efefef', borderWidth: 0.8, marginHorizontal: 10 }} /> */}
                <View style={{ paddingTop: '5%', paddingHorizontal: 10 }}>
                  <TextInput placeholder="Mobile Number" onChangeText={(text) => this.setState({ mobile: text })} value={this.state.mobile.replace(testPhoneNumber, '')} maxLength={10} style={{ borderColor: '#999494', borderBottomWidth: 1, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 16 }} keyboardType="phone-pad" />
                </View>
              </View>
            </KeyboardAvoidingView>
            <View style={{ paddingVertical: '10%', paddingHorizontal: 10 }} >
              <TouchableOpacity onPress={() => this.validatePhoneNumber(this.state.mobile)} style={{ backgroundColor: Colors.primary, padding: 10, width: Dimensions.get('screen').width / 2, alignSelf: 'center' }}>
                <Text style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold', fontFamily: 'sans', textAlign: 'center', fontSize: 14 }}>submit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: "center", alignContent: 'center', alignItems: 'center', alignSelf: 'center', paddingVertical: 10, width: '70%' }}>
              <Text style={{ textAlign: "center", letterSpacing: 1, }}>
                By clicking, you read and agreed to{' '}
                <Text onPress={() => this.props.navigation.navigate('TermsAndConditions')} style={{ color: Colors.primary, textDecorationLine: 'underline', fontWeight: 'bold' }}>Terms of Use</Text>
                {' '}&{' '}
                <Text onPress={() => this.props.navigation.navigate('Privacy')} style={{ color: Colors.primary, textDecorationLine: 'underline', fontWeight: 'bold' }}>Privacy Policy</Text>
              </Text>
            </View>

          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: { fontSize: 28, marginTop: 40, marginBottom: 25, fontWeight: 'bold' },

  logintext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 100,
    color: 'black',
  },
  textview: {
    alignSelf: 'center',
    alignItems: 'center',
    color: 'black',
    justifyContent: 'center',
  },
  chnagepasstext: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
  chnagepassview: {
    height: 40,
    width: Dimensions.get('window').width / 1.15,
    alignSelf: 'center',
    alignItems: 'flex-end',
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 5,
  },
  inputStyle: {
    borderRadius: 30,
  }
});
