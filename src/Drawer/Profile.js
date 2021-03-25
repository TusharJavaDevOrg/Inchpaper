/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Icon, Left, Title, Right, } from 'native-base';
import { View, Text, ScrollView, Image, StatusBar, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Style from '../Components/Style';
import { connect } from 'react-redux';
import { getPaymentMode, getReferalCode, getuserAddresses, getUserData, getUserOrders, logOut } from '../Redux/Auth/ActionCreatore';
import { Dimensions } from 'react-native';
import { Colors } from '../config/GlobalContants';
import { Header } from 'react-native-elements'
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    favourites: state.favourites,
    defaultVariants: state.defaultVariants,
    login: state.login,
    visitedProfileOnes: state.visitedProfileOnes,
    addresses: state.addresses,
    nearestSupplier: state.nearestSupplier,
    abandonedCheckout: state.abandonedCheckout,
    user: state.user,
  };
};
const SCREEN_WIDTH = Dimensions.get('screen').width;
const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  getUserData: (customerId) => dispatch(getUserData(customerId)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
  getUserOrders: (customerId) => dispatch(getUserOrders(customerId)),
  getuserAddresses: (data) => dispatch(getuserAddresses(data)),
  getPaymentMode: () => dispatch(getPaymentMode()),
});
class Profile extends Component {
  componentDidMount() {
    this.props.getUserData(this.props.login.userId);
    this.props.getUserOrders(this.props.login.userId);
    this.props.getReferalCode(this.props.login.userId);
    this.props.getPaymentMode();
    var data = {
      currentSelectedAddress: null,
      userId: this.props.login.userId,
    };
    this.props.getuserAddresses(this.props.login.userId);
  }
  onSingOut = async () => {
    await this.props.logOut();
    console.log('signout')
    this.props.navigation.navigate('Login')
  }
  render() {

    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} backgroundColor="white" barStyle={'dark-content'} />
        {this.props.login.skippedLogin || !this.props.login.loginSuccess ? (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ marginBottom: 20, marginTop: 70 }}>
              <Image
                style={{
                  height: 200,
                  width: 200,
                  alignSelf: 'center',
                }}
                source={require('../assets/noLogin.png')}
              />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  color: '#a7a7a7',
                  fontSize: 21,
                }}>
                You are not logged in
          </Text>
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#a7a7a7',
                  fontSize: 15,
                }}>
                Please login to access your profile.
          </Text>
            </View>
            <View style={{ marginVertical: 20, width: SCREEN_WIDTH }}>
              <TouchableOpacity
                onPress={() => this.onSingOut()}
                style={{
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  padding: 10,
                  marginHorizontal: 70,
                }}>
                <Text
                  style={{
                    color: Colors.primary,
                    fontWeight: '700',
                    alignSelf: 'center',
                  }}>
                  LOGIN / REGISTER
            </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : <ScrollView style={{ flex: 1 }}>
            <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
              leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
              centerComponent={{ text: 'Profile', style: { paddingTop: 5, } }}
              rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
            />
            <View backgroundColor="white" style={{ paddingV: 20 }}>
              {/* <View style={Style.line}></View> */}

              <View style={{ flexDirection: 'row', marginHorizontal: 15, justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {this.props.user?.firstName ? this.props.user?.firstName : this.props.user?.phoneNumber} {this.props.user.lastName !== null ? this.props.user.lastName : ""}
                  </Text>
                  {this.props.user?.email && <Text
                    style={{

                      fontSize: 14,
                      color: 'grey',
                      marginTop: 8,
                      marginBottom: 8,
                    }}>
                    {this.props.user?.email}
                  </Text>}
                </View>
                {<TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileEditScreen')} style={{ borderRadius: 5, padding: 5, backgroundColor: Colors.primary }}>
                  <Text style={{ textTransform: 'uppercase', letterSpacing: 1, color: Colors.white }}>Edit</Text>
                </TouchableOpacity>}
              </View>

            </View>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('ProfileEditScreen')
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to view orders.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Login now',
                          onPress: () => {
                            this.props.logOut();
                            // this.props.reLogin('Cart');
                            this.props.navigation.navigate('Login');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="account-circle-outline" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>My Information</Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('MyWallet');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to view orders.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Login now',
                          onPress: () => {
                            this.props.logOut();
                            // this.props.reLogin('Cart');
                            this.props.navigation.navigate('Login');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="wallet-outline" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>My Wallet</Text>
                </View>

                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('Order');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to view orders.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Login now',
                          onPress: () => {
                            this.props.logOut();
                            // this.props.reLogin('Cart');
                            this.props.navigation.navigate('Login');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="basket-outline" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>My Orders</Text>
                </View>

                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            {/* <View style={{ marginTop:15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize:16, marginStart: 26 }}>Payment Method</Text>
            <Icon
              style={{ marginRight: 15 }}
              name="chevron-right"
              type="MaterialCommunityIcons"
            />
          </View>
          <View style={Style.line}></View>
        </View> */}
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.login.loginSuccess) {
                    this.props.navigation.navigate('Address', { fromWhere: 'visible' });
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to view address.',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Login now',
                          onPress: () => {
                            this.props.logOut();
                            // this.props.reLogin('Cart');
                            this.props.navigation.navigate('Login');
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="map-marker-outline" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>
                    My Addresses
            </Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Wishlist')} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', marginStart: 26 }}>
                  <MCIcon name="heart-outline" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>Wishlist</Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('FAQ');
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', marginStart: 26 }}>
                  <MCIcon
                    name="comment-question-outline"
                    color={Colors.gray}
                    size={20}
                  />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>
                    Help
            </Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ReturnPolicy');
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="autorenew" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>
                    About Us
            </Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Contact');
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="form-select" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>
                    Contact Us
            </Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  this.onSingOut();
                }}
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row", marginStart: 26 }}>
                  <MCIcon name="exit-to-app" color={Colors.gray} size={20} />
                  <Text style={{ fontSize: 14, marginLeft: 10 }}>
                    Sign Out
            </Text>
                </View>
                <Icon
                  style={{ marginRight: 15 }}
                  name="chevron-right"
                  type="MaterialCommunityIcons"
                />
              </TouchableOpacity>
              <View style={Style.line}></View>
            </View>
          </ScrollView>
        }
      </View>
    );

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)