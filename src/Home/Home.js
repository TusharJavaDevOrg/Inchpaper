import Axios from 'axios';
import React, { Component } from 'react';
import { RefreshControl, } from 'react-native';
import { YellowBox } from 'react-native';
import {
  Dimensions, FlatList, Image,
  ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View, Linking
} from 'react-native';
import ElevatedView from 'react-native-elevated-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Header, SocialIcon } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import { connect } from 'react-redux';
import { fetchDiscountedProducts, fetchFeaturesProductsUrl, getCollectionsUrl, postFCMTokenUrl, supplierId } from '../../Config/Constants';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { addedRefferalCode, getPaymentMode, getReferalCode, getuserAddresses, logOut, profileVisitedOnes, reLogin } from '../Redux/Auth/ActionCreatore';
import { addAbondonedId, addOneFavourite, addOneItemToCart, addSubsCat, createDefaultVariants, deleteAllDefaultVarinats, deleteSubsCat, getBrands, getCategorys, getCollection, getFeaturedProducts } from '../Redux/Cart/ActionCreators';
import { Colors } from '../config/GlobalContants';
import { ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image'
import LottieView from 'lottie-react-native';
import SocialScreen from '../Components/SocialIconScreen';
import ReferScreen from '../Components/ReferScreen';
import { toast } from '../Functions/functions';
import messaging from '@react-native-firebase/messaging';
var PushNotification = require('react-native-push-notification');
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    brands: state.brands,
    defaultVariants: state.defaultVariants,
    login: state.login,
    visitedProfileOnes: state.visitedProfileOnes,
    addresses: state.addresses,
    nearestSupplier: state.nearestSupplier,
    supplier: state.supplier,
    categories: state.categories,
    selectData: state.selectData,
    deliverytime: state.deliverytime,
    favourites: state.favourites,
    paymentGateway: state.paymentGateway,
    abandonedCheckout: state.abandonedCheckout,
    timeslots: state.timeslots,
    user: state.user,
    featuredProducts: state.featuredProducts,
    collection: state.collection,
    hasAddedRefferalCode: state.hasAddedRefferalCode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  getPaymentMode: () => dispatch(getPaymentMode()),
  getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
  getCategorys: (supplId) => dispatch(getCategorys(supplId)),
  getBrands: (supplierId) => dispatch(getBrands(supplierId)),
  getCollection: (supplierId) => dispatch(getCollection(supplierId)),
  getFeaturedProducts: () => dispatch(getFeaturedProducts()),
  addedRefferalCode: () => dispatch(addedRefferalCode()),
  getuserAddresses: (customerId) => dispatch(getuserAddresses(customerId)),
  addSubsCat: (catId) => dispatch(addSubsCat(catId)),
  deleteSubsCat: () => dispatch(deleteSubsCat()),
});
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerImages: [],
      bannerData: [],
      collecData: [],
      categories: [],
      newProductsList: [],
      featuredProducts: [],
      disProd: [],
      selectedInd: 1,
      isFeaturedLoading: false,
      disProdLoading: false,
      isloading: false,
    };
  }


  async componentDidMount() {
    this.runOnMount();

  }

  runOnMount = async () => {
    await this.setState({ isloading: true })
    await this.getDiscountProducts(1);
    this.getFCMToken()
    this.props.getCategorys(supplierId);
    this.props.getPaymentMode();
    this.props.getCollection(supplierId);
    this.props.getBrands(supplierId);
    this.props.getFeaturedProducts();
    this.Message();
    await this.setState({ isloading: false })
  }
  getFCMToken = async () => {
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    this.postTokenToServer(token, this.props?.login?.accessToken, this.props?.login?.userId)
  }
  postTokenToServer = async (tokenCode, accessToken, id) => {
    // var url = "http://f490d80ca5e1.ngrok.io/api/v4/user/fcm/" + tokenCode;

    var url = postFCMTokenUrl(tokenCode, id);
    // console.log('URTOK', url)
    var body = {};
    var stringifyBody = JSON.stringify(body);

    await Axios.post(url, stringifyBody, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
      .then((resp) => {
        // console.log(
        //     "post token",
        //     resp
        // );
      })
      .catch((err) => {
        // console.log(
        //     "Responsse form posting push noti token to server",
        //     err.message
        // );
      });
  }
  Message() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      this.showNotification(remoteMessage);

      this.setState({
        idfrom: remoteMessage.notification.title,
        incomingOrder: true,
      });
    });

    return unsubscribe;
  }

  showNotification = remoteMessage => {
    console.log('RES FROM NOTIFICATIOn--> ' + JSON.stringify(remoteMessage));
    var bigPictureUrl = '';
    remoteMessage.notification.android.imageUrl
      ? (bigPictureUrl = remoteMessage.notification.android.imageUrl)
      : null;
    var sound = false;
    remoteMessage.notification.android.sound &&
      remoteMessage.notification.android.sound === 'breaking_some_glass.mp3'
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
      vibrate: true, // (optiodetails.get.nal) default: true
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
      soundName: 'breaking_some_glass.mp3', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    });
  };

  getDiscountProducts = async (pageNum) => {
    pageNum === 1 ? this.setState({ disProdLoading: true, disProd: [] }) : null;
    this.setState({ bottomOneLoader: true })
    var url = fetchDiscountedProducts(pageNum);
    console.log('Gettig discounted products from home screen', url);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then((response) => {
        this.setState({
          disProd: [...this.state.disProd, ...response.data.object],
          disProdLoading: false,
          networkError: false,
        });
        response.data.object.length < 10 ? this.setState({ bottomOneLoader: false }) : false
      })
      .catch((error) => {
        if (!error.status) {
          this.setState({ disProdLoading: false, networkError: true });
        }
        console.log('Error', error);
      });
  };



  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet showImage={true} onPress={() => this.props.navigation.openDrawer()} iconName='menu-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}

          containerStyle={{ elevation: 2 }}
        />

        {this.state.isloading ?
          (
            <View style={{ flex: 1, }}>
              <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, }}>
                  {/* ======= category  ====== */}
                  <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>

                    <FlatList numColumns={4} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <FastImage style={{ backgroundColor: '#efefef', height: 40, width: 40, resizeMode: 'center', alignSelf: 'center' }} />

                            <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center', marginVertical: 1, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} />


                  </View>


                  {/* ===== Discounted products =======*/}

                  <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Spring budget bonza</Text>
                  <View style={{ padding: 5 }}>
                    <View style={{ backgroundColor: '#fff', padding: 3 }}>

                      <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 2.3, padding: 5, }}>
                            <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                              <Image style={{ backgroundColor: '#efefef', width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                              <View style={{ paddingVertical: 8, padding: 3 }}>
                                <Text style={{ fontSize: 11, backgroundColor: '#efefef' }} numberOfLines={1} ellipsizeMode="tail"></Text>
                                <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                  <Text style={{ fontSize: 11, color: '#D11805', backgroundColor: '#efefef' }}></Text>
                                  <Text style={{ fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 3, backgroundColor: '#efefef' }}></Text>
                                  <Text style={{ fontSize: 11, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      }} />

                    </View>
                  </View>



                  {/* ====== catergories products ====== */}
                  <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Trending on Store</Text>
                  <View style={{ padding: 5 }}>
                    <View style={{ backgroundColor: '#fff', padding: 3 }}>

                      <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 2, padding: 5, }}>
                            <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                              <Image style={{ width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                              <View style={{ paddingVertical: 8, padding: 3 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed' }} numberOfLines={1} ellipsizeMode="tail"></Text>
                                <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                  <Text style={{ fontSize: 13, color: '#D11805', fontWeight: 'bold', fontFamily: 'sans-serif-condensed' }}></Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      }} />


                    </View>
                  </View>

                  {/* ====== popular brands ====== */}
                  <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Most popular brands</Text>
                  <View style={{ padding: 5 }}>
                    <FlatList data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, padding: 5 }}>
                          <View>
                            <Image style={{ backgroundColor: '#efefef', height: 80, width: '100%' }} />
                          </View>
                        </TouchableOpacity>
                      )
                    }} />

                  </View>

                  {/* ===== Foooter ====== */}
                  <SocialScreen />

                </View>
              </ScrollView>
            </View>
          )
          : (<View style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, }} refreshControl={
              <RefreshControl
                refreshing={this.state.disProdLoading}
                onRefresh={() => {
                  this.runOnMount()
                  // this.props.getPromoWalletData(this.props.login.userId);
                }}
                progressViewOffset={80}
                progressBackgroundColor={Colors.primary}
                colors={['#fff']}
              />
            } showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1, }}>
                <View style={{ bottom: 1, backgroundColor: '#fff' }}>
                  <TouchableOpacity style={{ height: 50, width: '95%', padding: 5, alignSelf: 'center', }} onPress={() => this.props.navigation.navigate('Search')}>
                    <View style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: Colors.placeholder, padding: 10, borderRadius: 5, borderColor: Colors.placeholder, borderWidth: 0.5, }}>
                      <Text style={{ color: Colors.black, alignSelf: 'center', paddingStart: 10 }}>
                        Search Products...
                                    </Text>
                      <Icon name="magnify" size={20} color="grey" />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{}}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Categories')} style={[this.state.selectedInd === 1 ? { padding: 15, borderBottomWidth: 3, borderBottomColor: Colors.primary } : { padding: 15, marginHorizontal: 10 }]}>
                      <Text style={[this.state.selectedInd === 1 ? { color: Colors.black, elevation: 1 } : { color: '#c0c0c0' }, { fontSize: 15, fontWeight: 'bold' }]}>Categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Featured')} style={[this.state.selectedInd === 2 ? { padding: 15, borderBottomWidth: 3, borderBottomColor: Colors.primary } : { padding: 15, marginHorizontal: 10 }]}>
                      <Text style={[this.state.selectedInd === 2 ? { color: Colors.black, elevation: 1 } : { color: '#c0c0c0' }, { fontSize: 15, fontWeight: 'bold' }]}>Best Sellers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.navigate('Subscription', { id: 832, catName: 'Subscripton' })
                    }} style={[this.state.selectedInd === 3 ? { padding: 15, borderBottomWidth: 3, borderBottomColor: Colors.primary } : { padding: 15, marginHorizontal: 10 }]}>
                      <Text style={[this.state.selectedInd === 3 ? { color: Colors.black, elevation: 1 } : { color: '#c0c0c0' }, { fontSize: 15, fontWeight: 'bold' }]}>Subscription Box</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      this.props.deleteSubsCat();
                      this.props.navigation.navigate('HomeSubCategory', { id: 220, catName: 'Home Activity' })
                    }} style={[this.state.selectedInd === 4 ? { padding: 15, borderBottomWidth: 3, borderBottomColor: Colors.primary } : { padding: 15, marginHorizontal: 10 }]}>
                      <Text style={[this.state.selectedInd === 4 ? { color: Colors.black, elevation: 1 } : { color: '#c0c0c0' }, { fontSize: 15, fontWeight: 'bold' }]}>DIY Kits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GiftCard')} style={[this.state.selectedInd === 5 ? { padding: 15, borderBottomWidth: 3, borderBottomColor: Colors.primary } : { padding: 15, marginHorizontal: 10 }]}>
                      <Text style={[this.state.selectedInd === 5 ? { color: Colors.black, elevation: 1 } : { color: '#c0c0c0' }, { fontSize: 15, fontWeight: 'bold' }]}>Gift Cards</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
                {/* ======= category  ====== */}
                {/* <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>
                  {this.props.categories.isLoading ?
                    <FlatList numColumns={4} data={[1, 3, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <FastImage style={{ backgroundColor: '#efefef', height: 40, width: 40, resizeMode: 'center', alignSelf: 'center' }} />

                            <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center', marginVertical: 1, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} />
                    : (<View>
                      <FlatList numColumns={4}
                        data={this.props.categories.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          if (index <= 3)
                            return (
                              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('HomeSubCategory', { id: item.id, catName: item.name, data: item })} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                                <View>
                                  
                                  {item?.appImageUrl ? <FastImage
                                    style={{ width: 40, height: 40, alignSelf: 'center' }}
                                    source={{
                                      uri: item?.appImageUrl, priority: FastImage.priority.normal,


                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  /> : <Image source={require('../assets/no_image.png')} style={{ width: 40, height: 40, alignSelf: 'center' }} />}
                                  <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>{item.name}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                        }} />
                      <View style={{ flexDirection: 'row' }}>
                        <FlatList numColumns={4}
                          data={this.props.categories.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                            if (index > 3 && index < 7)
                              return (
                                <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('HomeSubCategory', { id: item.id, catName: item.name })} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                                  <View>
                                   
                                    {item?.appImageUrl ? <FastImage
                                      style={{ width: 40, height: 40, alignSelf: 'center' }}
                                      source={{
                                        uri: item?.appImageUrl, priority: FastImage.priority.normal,


                                      }}
                                      resizeMode={FastImage.resizeMode.contain}
                                    /> : <Image source={require('../assets/no_image.png')} style={{ width: 40, height: 40, alignSelf: 'center' }} />}
                                    <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>{item.name}</Text>
                                  </View>
                                </TouchableOpacity>
                              )
                          }} />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Categories')} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <Icon name="arrow-right-circle" size={40} color={'#7d0909'} style={{ alignSelf: 'center' }} />
                            <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>View All</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    )
                  }

                </View> */}


                {!this.props.collection.isLoading && this.props.collection?.banners?.length > 0 ? <View style={{ paddingVertical: 5 }}>
                  <SliderBox
                    images={this.props.collection?.banners}
                    sliderBoxHeight={220}
                    onCurrentImagePressed={(index) => {
                      console.log('index', this.props.collection)
                      this.props.navigation.navigate('ProductListing', { id: this.props.collection?.bannerData[index].id, from: 'Collection', catName: this.props.collection?.bannerData[index].name })
                    }
                    }
                    resizeMode={'contain'}
                    width={Dimensions.get('screen').width / 1}
                    dotColor="#b40001"
                    inactiveDotColor="#90A4AE"
                    autoplay
                    circleLoop
                  />
                </View> : null}
                {!this.props.collection.isLoading && this.props.collection?.offers.length > 0 && (<>
                  {/* <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Collection Addiction</Text> */}
                  <View style={{ paddingTop: 5, }}>
                    <FlatList numColumns={2} data={this.props.collection?.offers} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                      if (index <= 1)
                        return (
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductListing', { id: item.id, from: 'Collection', catName: item.name })} style={{ backgroundColor: '#fff', width: Dimensions.get('window').width / 2.1, height: Dimensions.get('screen').height / 4.5, marginHorizontal: 5.2, marginBottom: 10, }}>
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                style={{ width: '100%', height: Dimensions.get('screen').height / 5, alignSelf: 'center', marginVertical: 10, borderRadius: 5, justifyContent: "center" }}
                                source={{
                                  uri: item?.imageUrl,

                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                    }} ItemSeparatorComponent={() => (
                      <View style={{ paddingHorizontal: 10 }} />
                    )} />
                  </View></>)}
                {this.props.login.loginSuccess ?
                  <ElevatedView elevation={1} style={{ marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => {
                      if (this.props.login.accessToken) {
                        this.props.navigation.navigate('Refer')
                      } else {
                        Alert.alert(
                          'inchpaper',
                          'Login Required for Referral',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            { text: 'Go To Login', onPress: () => { this.props.logOut(); console.log('navigate to login'); this.props.navigation.navigate('Login') } },
                          ],
                          { cancelable: false },
                        ); defaultToast(
                          'Login Skipped.',
                        )
                      }
                    }} style={[{}]}>

                      <Image source={require('../assets/refer.png')} style={{ height: Dimensions.get('screen').width / 4, width: Dimensions.get('screen').width / 1, }} resizeMode="stretch" />

                    </TouchableOpacity>
                  </ElevatedView> :
                  <ElevatedView elevation={1} style={{ marginVertical: 20 }}>
                    <TouchableOpacity onPress={() => {

                      this.props.logOut(); console.log('navigate to login'); this.props.navigation.navigate('Login')

                    }} style={[{ flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 15, justifyContent: 'space-between' }]}>
                      <View style={[{ flexDirection: 'row' }]}>
                        <Image source={require('../assets/log.png')} style={{ height: 40, width: 40, marginTop: 10 }} />
                        <View style={{ paddingLeft: 10, width: '86%' }}>
                          <Text style={{ fontSize: 16, color: Colors.black }}>Login/Register</Text>
                          <Text style={{ color: Colors.gray }}>Login/Register And Get Personalised Experience, Use Wishlist & More</Text>
                        </View>
                      </View>
                      <Icon name={'chevron-right'} style={{ paddingVertical: 15 }} size={25} />
                    </TouchableOpacity>
                  </ElevatedView>
                }
                {this.props.login.loginSuccess &&
                  <ElevatedView elevation={1} style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => {
                      if (this.props.login.accessToken) {
                        this.props.navigation.navigate('Bulk')
                      } else {
                        Alert.alert(
                          'inchpaper',
                          'Login Required for Referral',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            { text: 'Go To Login', onPress: () => { this.props.logOut(); console.log('navigate to login'); this.props.navigation.navigate('Login') } },
                          ],
                          { cancelable: false },
                        ); defaultToast(
                          'Login Skipped.',
                        )
                      }
                    }} style={[{}]}>
                      <Image source={require('../assets/bulk.png')} style={{ height: Dimensions.get('screen').width / 4, width: Dimensions.get('screen').width / 1, }} resizeMode="stretch" />
                    </TouchableOpacity>
                  </ElevatedView>}
                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Top Categories</Text>
                <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>
                  {this.props.categories.isLoading ?
                    <FlatList numColumns={4} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <FastImage style={{ backgroundColor: '#efefef', height: 40, width: 40, resizeMode: 'center', alignSelf: 'center' }} />
                            <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center', marginVertical: 1, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} />
                    : (<View>
                      <FlatList numColumns={2}
                        data={this.props.categories.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          if (index <= 3)
                            return (
                              <TouchableOpacity key={index} onPress={() => {
                                this.props.deleteSubsCat();
                                this.props.navigation.navigate('HomeSubCategory', { id: item.id, catName: item.name, data: item })
                              }} style={{ width: Dimensions.get('window').width / 2, paddingVertical: 10 }}>
                                <View>

                                  {item?.appImageUrl ? <FastImage
                                    style={{ width: Dimensions.get('screen').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }}
                                    source={{
                                      uri: item?.appImageUrl, priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  /> : <Image source={require('../assets/no_image.png')} style={{ width: Dimensions.get('window').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }} />}
                                  {/* <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>{item.name}</Text> */}
                                </View>
                              </TouchableOpacity>
                            )
                        }} />

                    </View>
                    )
                  }

                </View>
                {/* ==== Collections ====== */}
                {!this.props.collection.isLoading && this.props.collection?.offers.length > 0 && (<>
                  {/* <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Collection Addiction</Text> */}
                  <View style={{ paddingTop: 10 }}>
                    <FlatList showsHorizontalScrollIndicator={false} data={this.props.collection?.offers} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                      if (index == 2)
                        return (
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductListing', { id: item.id, from: 'Collection', catName: item.name })} style={{ backgroundColor: '#fff', width: Dimensions.get('window').width / 1, height: Dimensions.get('screen').height / 4.5, marginBottom: 10, }}>
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                style={{ width: '98%', height: Dimensions.get('screen').height / 4.5, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5, borderRadius: 5 }}
                                source={{
                                  uri: item?.imageUrl,

                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                    }} ItemSeparatorComponent={() => (
                      <View style={{ paddingHorizontal: 10 }} />
                    )} />
                  </View></>)}

                <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>
                  {this.props.categories.isLoading ?
                    <FlatList numColumns={4} data={[1, 2,]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <FastImage style={{ backgroundColor: '#efefef', height: 40, width: 40, resizeMode: 'center', alignSelf: 'center' }} />

                            <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center', marginVertical: 1, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} />
                    : (<View>
                      <FlatList numColumns={2}
                        data={this.props.categories.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          if (index >= 4 && index <= 5)
                            return (
                              <TouchableOpacity key={index} onPress={() => {
                                this.props.deleteSubsCat();
                                this.props.navigation.navigate('HomeSubCategory', { id: item.id, catName: item.name, data: item })
                              }} style={{ width: Dimensions.get('window').width / 2, paddingVertical: 5 }}>
                                <View>
                                  {item?.appImageUrl ? <FastImage
                                    style={{ width: Dimensions.get('screen').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }}
                                    source={{
                                      uri: item?.appImageUrl, priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  /> : <Image source={require('../assets/no_image.png')} style={{ width: Dimensions.get('window').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }} />}
                                  {/* <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>{item.name}</Text> */}
                                </View>
                              </TouchableOpacity>
                            )
                        }} />
                    </View>
                    )
                  }

                </View>
                {!this.props.collection.isLoading && this.props.collection?.offers.length > 0 && (<>
                  {/* <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Collection Addiction</Text> */}
                  <View style={{ paddingTop: 10 }}>
                    <FlatList showsHorizontalScrollIndicator={false} data={this.props.collection?.offers} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                      if (index == 3)
                        return (
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductListing', { id: item.id, from: 'Collection', catName: item.name })} style={{ backgroundColor: '#fff', width: Dimensions.get('window').width / 1, height: Dimensions.get('screen').height / 4.5, marginBottom: 10, }}>
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                style={{ width: '98%', height: Dimensions.get('screen').height / 4.5, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5, borderRadius: 5 }}
                                source={{
                                  uri: item?.imageUrl,

                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                    }} ItemSeparatorComponent={() => (
                      <View style={{ paddingHorizontal: 10 }} />
                    )} />
                  </View></>)}
                <View style={{ backgroundColor: '#fff', paddingVertical: 5 }}>
                  {this.props.categories.isLoading ?
                    <FlatList numColumns={4} data={[1, 2,]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, paddingVertical: 5 }}>
                          <View>
                            <FastImage style={{ backgroundColor: '#efefef', height: 40, width: 40, resizeMode: 'center', alignSelf: 'center' }} />

                            <Text style={{ width: '50%', alignSelf: 'center', textAlign: 'center', marginVertical: 1, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }} />
                    : (<View>
                      <FlatList numColumns={2}
                        data={this.props.categories.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          if (index >= 6 && index <= 7)
                            return (
                              <TouchableOpacity key={index} onPress={() => {
                                console.log('item idd', item.id)
                                if (item.id == '832' || index == 6) {
                                  this.props.deleteSubsCat();
                                  this.props.addSubsCat(item.id);
                                  this.props.navigation.navigate('Subscription', { id: item.id, catName: item.name, data: item })
                                } else {
                                  this.props.deleteSubsCat();
                                  this.props.navigation.navigate('HomeSubCategory', { id: item.id, catName: item.name, data: item })
                                }
                              }
                              } style={{ width: Dimensions.get('window').width / 2, paddingVertical: 5 }}>
                                <View>

                                  {item?.appImageUrl ? <FastImage
                                    style={{ width: Dimensions.get('screen').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }}
                                    source={{
                                      uri: item?.appImageUrl, priority: FastImage.priority.normal,


                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  /> : <Image source={require('../assets/no_image.png')} style={{ width: Dimensions.get('window').width / 2.2, height: Dimensions.get('screen').width / 2.2, alignSelf: 'center' }} />}
                                  {/* <Text style={{ fontSize: 12, textAlign: 'center', paddingVertical: 1, fontWeight: 'bold' }}>{item.name}</Text> */}
                                </View>
                              </TouchableOpacity>
                            )
                        }} />
                    </View>
                    )
                  }
                </View>
                {!this.props.collection.isLoading && this.props.collection?.offers.length > 0 && (<>
                  {/* <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Collection Addiction</Text> */}
                  <View style={{ paddingTop: 10 }}>
                    <FlatList showsHorizontalScrollIndicator={false} data={this.props.collection?.offers} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                      if (index == 4)
                        return (
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductListing', { id: item.id, from: 'Collection', catName: item.name })} style={{ backgroundColor: '#fff', width: Dimensions.get('window').width / 1.01, height: Dimensions.get('screen').height / 4.5, marginBottom: 10, }}>
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                style={{ width: '98%', height: Dimensions.get('screen').height / 4.5, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5, borderRadius: 5 }}
                                source={{
                                  uri: item?.imageUrl,

                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                    }} ItemSeparatorComponent={() => (
                      <View style={{ paddingHorizontal: 10 }} />
                    )} />
                  </View></>)}
                {/* ===== Discounted products =======*/}

                {this.state.disProd.length > 0 && (<><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Spring budget bonza</Text>
                  <View style={{ padding: 5 }}>
                    <View style={{ backgroundColor: '#fff', padding: 3 }}>
                      {this.state.disProdLoading ?
                        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 2.3, padding: 5, }}>
                              <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                                <Image style={{ backgroundColor: '#efefef', width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                                <View style={{ paddingVertical: 8, padding: 3 }}>
                                  <Text style={{ fontSize: 11, backgroundColor: '#efefef' }} numberOfLines={1} ellipsizeMode="tail"></Text>
                                  <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                    <Text style={{ fontSize: 11, color: '#D11805', backgroundColor: '#efefef' }}></Text>
                                    <Text style={{ fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 3, backgroundColor: '#efefef' }}></Text>
                                    <Text style={{ fontSize: 11, fontWeight: 'bold', backgroundColor: '#efefef' }}></Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        }} />
                        : <ScrollView showsHorizontalScrollIndicator={false} horizontal style={{ flexDirection: 'row' }}>
                          <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.state.disProd} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2.3, padding: 5, }}>
                                <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                                  <FastImage
                                    style={{ width: '100%', height: 170, alignSelf: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                                    source={{
                                      uri: item?.productListings[0].medias[0]?.mediaUrl,

                                      priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                  />
                                  <View style={{ paddingVertical: 8, padding: 5 }}>
                                    <Text style={{ fontSize: 11, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">{item?.brand?.name}</Text>
                                    <Text style={{ fontSize: 11 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                    <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                      <Text style={{ fontSize: 11, color: '#D11805', fontWeight: 'bold' }}>₹{item.productListings[0].sellingPrice}</Text>
                                      {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 5 }}>₹{item.productListings[0].mrp}</Text>}
                                      {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, fontWeight: 'bold' }}>{Math.round(((
                                        item.productListings[0].mrp

                                      ) -
                                        (
                                          item.productListings[0].sellingPrice
                                        )) / (item.productListings[0].mrp
                                        ) * 100)}% Off</Text>}
                                    </View>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )
                          }} />
                          <View style={{ justifyContent: 'center', alignContent: 'center', marginTop: 5, height: Dimensions.get('screen').height / 3.8, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Discounted')} style={{ width: Dimensions.get('window').width / 2.3, }}>
                              <View style={{ paddingVertical: 8, padding: 5, justifyContent: 'center', alignContent: 'center' }}>
                                <Icon name="arrow-right-circle" size={50} color={'#7d0909'} style={{ alignSelf: 'center' }} />
                                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={1} ellipsizeMode="tail">View All</Text>

                              </View>
                            </TouchableOpacity>
                          </View>
                        </ScrollView>
                      }
                    </View>
                  </View></>)}

                {/* ==== Collections ====== */}
                {/* {!this.props.collection.isLoading && this.props.collection?.offers.length > 0 && (<><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 5 }}>Collection Addiction</Text>
                  <View style={{ paddingTop: 5, paddingLeft: 15 }}>
                    <FlatList showsHorizontalScrollIndicator={false} data={this.props.collection?.offers} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                      if (index > 4)
                        return (
                          <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('ProductListing', { id: item.id, from: 'Collection', catName: item.name })} style={{ backgroundColor: '#fff', width: Dimensions.get('window').width / 1.09, height: Dimensions.get('screen').height / 4.5, marginHorizontal: 3, marginBottom: 10, }}>
                            <View style={{ alignItems: 'center' }}>
                              <FastImage
                                style={{ width: '100%', height: Dimensions.get('screen').height / 4.5, alignSelf: 'center', borderRadius: 5 }}
                                source={{
                                  uri: item?.imageUrl,

                                  priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                    }} ItemSeparatorComponent={() => (
                      <View style={{ paddingHorizontal: 10 }} />
                    )} />
                  </View></>)} */}

                {/* ====== catergories products ====== */}
                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Trending on Store</Text>
                <View style={{ padding: 5 }}>
                  <View style={{ backgroundColor: '#fff', padding: 3 }}>
                    {this.props.featuredProducts?.isLoading ?
                      <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 2, padding: 5, }}>
                            <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                              <Image style={{ width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                              <View style={{ paddingVertical: 8, padding: 3 }}>
                                <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed' }} numberOfLines={1} ellipsizeMode="tail"></Text>
                                <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                  <Text style={{ fontSize: 13, color: '#D11805', fontWeight: 'bold', fontFamily: 'sans-serif-condensed' }}></Text>

                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      }} />
                      :
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row" }}>
                        <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.props?.featuredProducts?.data} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                          if (index < 12) {

                            return (

                              <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} key={index} style={{ width: Dimensions.get('window').width / 2, padding: 5, }}>
                                <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderRadius: 5, }}>
                                  <Image source={{ uri: item?.productListings[0].medias[0]?.mediaUrl }} style={{ width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                                  <View style={{ paddingVertical: 8, padding: 3 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed' }} numberOfLines={1} ellipsizeMode="tail">{item?.brand?.name}</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed' }} numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>

                                    <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                      <Text style={{ fontSize: 13, color: '#D11805', fontWeight: 'bold' }}>₹{item.productListings[0].sellingPrice}</Text>
                                      {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 12, textDecorationLine: 'line-through', paddingHorizontal: 10, paddingTop: 1 }}>₹{item.productListings[0].mrp}</Text>}

                                    </View>
                                    {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 12, fontWeight: 'bold', paddingTop: 1 }}>Save ₹ {Math.round(item.productListings[0].mrp
                                      -
                                      item.productListings[0].sellingPrice)
                                    }</Text>}
                                  </View>
                                </View>
                              </TouchableOpacity>

                            )
                          }
                        }} />
                        {this.props?.featuredProducts?.data.length >= 12 && <View style={{ borderRadius: 5, justifyContent: 'center', alignContent: 'center', marginTop: 5, height: Dimensions.get('screen').height / 3.65, alignItems: 'center' }}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Featured')} style={{ width: Dimensions.get('window').width / 2.3, }}>
                            <View style={{ paddingVertical: 8, padding: 5, justifyContent: 'center', alignContent: 'center' }}>
                              <Icon name="arrow-right-circle" size={50} color={'#7d0909'} style={{ alignSelf: 'center' }} />
                              <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }} numberOfLines={1} ellipsizeMode="tail">View All</Text>

                            </View>
                          </TouchableOpacity>
                        </View>}
                      </ScrollView>
                    }

                  </View>
                </View>
                {/* ====== popular brands ====== */}
                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Most popular brands</Text>
                <View style={{ padding: 5 }}>
                  {this.props.brands.isLoading ?
                    <FlatList data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} style={{ width: Dimensions.get('window').width / 4, padding: 5 }}>
                          <View>
                            <Image style={{ backgroundColor: '#efefef', height: 80, width: '100%' }} />
                          </View>
                        </TouchableOpacity>
                      )
                    }} />
                    : <FlatList data={this.props.brands.data} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate('BrandProductListing', { id: item.id, brandName: item.name })} style={{ width: Dimensions.get('window').width / 3, padding: 5 }}>
                          <View>
                            <Image source={{ uri: item?.media?.mediaUrl }} style={{ height: 100, width: '100%' }} resizeMethod="auto" resizeMode="stretch" />
                          </View>
                        </TouchableOpacity>
                      )
                    }} />}
                </View>
                {/* ===== Foooter ====== */}
                <SocialScreen />
              </View>
            </ScrollView>
          </View>)
        }
        <ReferScreen onPress={() => this.props.navigation.navigate('EnterRefer')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginStart: 15 },
  flatlist: { marginStart: 17, marginEnd: 12, marginTop: 20 },
  viewall: { color: 'grey', marginTop: 12, marginEnd: 15 },
  verticaltext: {
    paddingStart: 5,
    marginTop: 7,

    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  view: { flex: 1, flexDirection: 'column', marginHorizontal: 20, marginTop: 10 },
  price: { color: 'grey', paddingStart: 5, marginTop: 5 },
  verticalimg: {
    borderRadius: 10,
    height: 100,
    marginHorizontal: 6,
    width: 100,
    resizeMode: 'contain',
  },
  verticalview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 6,
    elevation: 0.5,
    borderRadius: 0.8,
  },
  horizontalimg: {
    height: 110,
    width: 100,
  },
  subtitle: {
    color: 'grey',
    paddingStart: 5,
    marginTop: 7,
  },
  icon: {
    fontSize: 26,
    marginTop: 10,

    aspectRatio: 1.5,

    alignSelf: 'center',
  },
  img: {
    flex: 0.7,
    height: 380,
    width: 400,
  },
  iconcart: {
    height: 22,
    marginTop: 10,
    marginStart: 10,

    width: 22,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Home)