/* eslint-disable react-native/no-inline-styles */
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Landing from '../Landing/landing';

import Signup from '../pages/Account/Signup';

import Login from '../pages/Account/Login';

import Forgotpass from '../pages/Account/Forgotpass';

import Slides from '../Slides/Slides';

import Home from '../Home/Home';

import Cart from '../Cart/Cart';

import Categories from '../Categories/Categories';

import Search from '../Search/Search';

import Items from '../Items/Items';


import ItemDetail from '../ItemDetail/ItemDetail';

import ImageItem from '../ItemDetail/ImageItem';

import Review from '../Review/Review';

import CartItem from '../Cart/CartItem';

import Settings from '../Drawer/Settings';

import Profile from '../Drawer/Profile';

import OrderConfirm from '../Payment/OrderConfirm';

import SelectAddress from '../Payment/SelectAddress';

import DrawerContent from '../Home/DrawerContent';

import Header from '../Components/Header';

import Wishlist from '../Drawer/Wishlist';

import Address from '../Drawer/Address';

import Support from '../Drawer/Support';

import Order from '../Drawer/Order';

import Refer from '../Drawer/Refer';
import OtpScreen from '../pages/Account/OtpScreen';
import SubCategoriesScreen from '../Categories/SubCategoriesScreen';
import HomeSubCategoryScreen from '../Home/HomeSubCategoryScreen';
import ProductDetailsScreen from '../ProductDetails/ProductDetailsScreen';
import ProductListingScreen from '../ProductListing/ProductListingScreen';
import CheckoutAddressScreen from '../Cart/CheckoutAddressScreen';
import PaymentsScreen from '../Cart/PaymentsScreen';
import AddedAddressScreen from '../Cart/AddedAddressScreen';
import OrederDetailScreen from '../Drawer/OrederDetailScreen';
import OrderConfirmedScreen from '../Cart/OrderConfirmedScreen';
import ProfileEditScreen from '../Drawer/ProfileEditScreen';
import MyWalletScreen from '../Drawer/MyWalletScreen';
import TermsAndConditionScreen from '../Drawer/TermsAndConditionScreen';
import FAQScreen from '../Drawer/FAQScreen';
import ProductFullImageView from '../ProductDetails/ProductFullImageView';
import FilterScreen from '../ProductListing/FilterScreen';
import SortScreen from '../ProductListing/SortScreen';
import SplashScreen from '../Splash/SplashScreen';
import RechargeWalletScreen from '../Drawer/RechargeWalletScreen';
import { gioCoderApiKey, LiveReportIntegrationUrl, otpVerificationUrl, postFCMTokenUrl } from '../../Config/Constants';
import { connect } from 'react-redux';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import Axios from 'axios';
import AddAddress from '../Drawer/AddAddress';
import brandProductListing from '../ProductListing/brandProductListing';
import refundProcedure from '../Drawer/refundProcedure';
import SearchProductListing from '../Search/SearchProductListing';
import ReturnPolicy from '../Drawer/ReturnPolicy';
import TrackingScreen from '../Tracking/TrackingScreen';
import WriteReviewScreen from '../Drawer/WriteReviewScreen';
import { getuserAddresses } from '../Redux/Auth/ActionCreatore';
import FeaturedProducts from '../Home/FeaturedProducts';
import DiscountProducts from '../Home/DiscountProducts';
import EnterRefer from '../Components/EnterRefer';
import Counpons from '../Cart/Counpons';
import TheStack from './TheStack';
import TheTabs from './TheTabs';
import privacyPolicy from '../Drawer/privacyPolicy';
const stacknavigatorOptions = { headerShown: false };
const StackNavigator = createStackNavigator();
//const Stack = createStackNavigator();
var Querystringified = require('querystringify');
const Drawer = createDrawerNavigator();
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true;

class Stack extends Component {
  state = { skip: undefined, comp: '' };
  componentDidMount() {
    this.props.login.accessToken !== null
      ? this.getNewAccessToken()
      : this.setState({ isLoading: false });
    this.Message();
    // this.getCurrentoaction();
  }

  getCurrentoaction = async () => {
    Geocoder.init(gioCoderApiKey);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        // console.log('location--> ' + JSON.stringify(location));
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            this.setState({
              address: json.results[3].address_components,
              addressGeoCodedData: json.results[1],
            });
            var addComp = json.results[0].address_components;
            var sName = "";
            addComp.map((it, ind) => { if (it.types[0] === "administrative_area_level_1") { /* console.log('short naem', it.short_name); */ sName = it.short_name; } })
            this.props.login.loginSuccess ? this.getUserLocation(sName) : null;

            // console.log('formatted Address at root :', addComp);
          })
          .catch(error => console.log('error geocds at root' + JSON.stringify(error)));
        this.setState({
          longitude: location.longitude,
          latitude: location.latitude,
        });
      })
      .catch(error => {
        console.log('error' + error);
      });

  };

  getUserLocation = async (ccode) => {
    var url = LiveReportIntegrationUrl(ccode);
    // console.log('live report url', url)
    await Axios.get(
      url,
      {
        headers: {
          Authorization: 'bearer ' + this.props.login.accessToken,
          'Content-type': 'application/json',
        },
        //   timeout: 15000,
      },
    )
      .then(response => {
        // console.log('live integration api reponse data->', response.data);

      })
      .catch(error => {
        console.log('Error in live reports', error);
      });
    // var url = LiveReportIntegrationUrl(ccode);
  }

  getNewAccessToken = async () => {
    var body = {
      username: this.props.login.userName,
      // password: this.props.login.refreshToken,
      grant_type: 'refresh_token',
      refresh_token: this.props.login.refreshToken,
    };

    let data_res = Querystringified.stringify(body);
    var url = otpVerificationUrl();

    await Axios.post(url, data_res, {
      headers: {
        Authorization: 'Basic VVNFUl9DTElFTlRfQVBQOnBhc3N3b3Jk',
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      withCredentials: true,
    })
      .then((resp) => {
        console.log('Access code verification', resp.data);
        if (resp.data.access_token && resp.data.refresh_token) {
          var userObject = {
            accessToken: resp.data.access_token,
            refreshToken: resp.data.refresh_token,
            userId: resp.data.userId.toString(),
            loginCount: resp.data.loginCount.toString(),
            userName: this.props.login.userName,
            hasSelectedAddress: this.props.login.hasSelectedAddress,
          };
          console.log('user address from navigator', resp.data.userId.toString())
          var data = {
            currentSelectedAddress: null,
            userId: resp.data.userId.toString(),
          };
          this.getFCMToken(resp.data.access_token, resp.data.userId);
          this.props.getuserAddresses(resp.data.userId.toString());
          this.props.loginSuccess(userObject);
          this.props.getWalletData(resp.data.userId.toString(), supplierId);
          this.props.getUserData(resp.data.userId.toString());
        } else this.props.logOut();
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  getFCMToken = async (accessToken, userId) => {
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    console.log('get fcm token')
    const token = await messaging().getToken();

    this.postTokenToServer(token, accessToken, userId)
  }
  postTokenToServer = async (tokenCode, accessToken, id) => {


    var url = postFCMTokenUrl(tokenCode, id);
    console.log('FCM URLTOK route again', url)
    var body = {};
    var stringifyBody = JSON.stringify(body);

    await Axios.post(url, stringifyBody, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then((resp) => {
        console.log(
          "post token",
          resp
        );
      })
      .catch((err) => {
        console.log(
          "Responsse form posting push noti token to server",
          err.message
        );
      });
  }

  Message() {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      this.showNotification(remoteMessage);
    });

    return unsubscribe;
  }

  showNotification = (remoteMessage) => {
    var bigPictureUrl = '';
    remoteMessage.notification.android.imageUrl
      ? (bigPictureUrl = remoteMessage.notification.android.imageUrl)
      : null;
    var sound = false;
    remoteMessage.notification.android.sound &&
      remoteMessage.notification.android.sound === 'default'
      ? (sound = true)
      : null;
    var channelId = 'your-custom-channel-id';
    remoteMessage.notification.android.channelId
      ? (channelId = remoteMessage.notification.android.channelId)
      : null;
    var notificationText = remoteMessage.notification.body;
    var notificationTitle = remoteMessage.notification.title;
    var notificationSubText = '';
    remoteMessage.data.notificationSubText
      ? (notificationSubText = remoteMessage.data.notificationSubText)
      : null;
    var notificationBigText = '';
    remoteMessage.data.notificationBigText
      ? (notificationBigText = remoteMessage.data.notificationBigText)
      : null;
    PushNotification.localNotification({
      /* Android Only Properties */
      // id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      // ticker: 'My Notification Ticker', // (optional)
      // showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      largeIconUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: notificationBigText, // (optional) default: "message" prop
      subText: notificationSubText, // (optional) default: none
      bigPictureUrl: bigPictureUrl, // (optional) default: undefined
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      // tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      importance: 'high', // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      channelId: channelId, // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      onlyAlertOnce: false, //(optional) alert will open only once with sound and notify, default: false

      actions: '[]', // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      alertAction: 'view', // (optional) default: view
      category: '', // (optional) default: empty string
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)

      /* iOS and Android properties */
      title: notificationTitle, // (optional)
      message: notificationText, // (required)
      playSound: sound, // (optional) default: true
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  };

  render() {

    function DrawerRouter() {
      return (
        // <NavigationContainer>
        <Drawer.Navigator

          overlayColor="transparent"
          openByDefault={false}

          lazy={true}
          drawerType={'slide'}
          drawerContent={(props) => <DrawerContent {...props} />}
          initialRouteName={'Home'}
        >
          <Drawer.Screen name="Home" component={TheStack} />

        </Drawer.Navigator>
        // </NavigationContainer>
      );
    }
    return (
      <NavigationContainer>
        <Drawer.Navigator

          overlayColor="transparent"
          openByDefault={false}

          lazy={true}
          drawerType={'slide'}
          drawerContent={(props) => <DrawerContent {...props} />}
          initialRouteName={this.props.login.loginSuccess || this.props.login.skippedLogin ? "Home" : "Landing"}
        >

          {this.props.login.loginSuccess ? null : <Drawer.Screen
            name="Landing"
            component={Landing}

          />}
          {this.props.login.loginSuccess ? null : <Drawer.Screen
            name="Login"
            component={Login}

          />}
          {this.props.login.loginSuccess ? null : <Drawer.Screen
            name="OTP"
            component={OtpScreen}

          />}
          {this.props.login.loginSuccess || this.props.login.skippedLogin ? <Drawer.Screen name="Home" component={TheStack} /> : null}
          <Drawer.Screen
            name="TermsAndConditions"
            component={TermsAndConditionScreen}

          />
          <Drawer.Screen
            name="Privacy"
            component={privacyPolicy}

          />
        </Drawer.Navigator>
        {/* <StackNavigator.Navigator initialRouteName={this.props.login.loginSuccess ? "Drawer" : "Landing"}>
          {this.props.login.loginSuccess ? null : <StackNavigator.Screen
            name="Landing"
            component={Landing}
            options={stacknavigatorOptions}
          />}
          {this.props.login.loginSuccess ? null : <StackNavigator.Screen
            name="Login"
            component={Login}
            options={stacknavigatorOptions}
          />}
          {this.props.login.loginSuccess ? null : <StackNavigator.Screen
            name="OTP"
            component={OtpScreen}
            options={stacknavigatorOptions}
          />}
      
          <StackNavigator.Screen
            name="Drawer"
            component={DrawerRouter}
            options={stacknavigatorOptions}
          />

        </StackNavigator.Navigator> */}
      </NavigationContainer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    loginfromcart: state.loginfromcart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
    supplier: state.supplier,
    selfpickup: state.selfpickup,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleDeliveryType: (bool) => dispatch(toggleDeliveryType(bool)),
  toggleOrderType: (bool) => dispatch(toggleOrderType(bool)),
  logOut: () => dispatch(logOut()),
  loginSuccess: (userData) => dispatch(loginSuccess(userData)),
  getWalletData: (customerId, supplId) =>
    dispatch(getWalletData(customerId, supplId)),
  getUserData: (customerId) => dispatch(getUserData(customerId)),
  getuserAddresses: (custId) => dispatch(getuserAddresses(custId)),
  // findDelivrableSocieties: () => dispatch(findDelivrableSocieties()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Stack);
