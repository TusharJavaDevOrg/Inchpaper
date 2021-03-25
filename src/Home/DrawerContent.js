/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import {
  Text,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,

} from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Style from '../Components/Style';
import { connect } from 'react-redux';
import { Component } from 'react';
import { getReferalCode, getuserAddresses, getUserData, getUserOrders, logOut } from '../Redux/Auth/ActionCreatore';
import { deleteAllItemsFromCart } from '../Redux/Cart/ActionCreators';
import { Alert } from 'react-native';
import { Linking } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
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
    referalCode: state.referalCode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
  getUserData: (customerId) => dispatch(getUserData(customerId)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
  getUserOrders: (customerId) => dispatch(getUserOrders(customerId)),
  getuserAddresses: (data) => dispatch(getuserAddresses(data)),
});

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataEX: 0,
    };
  }

  componentDidMount() {
    this.props.getUserData(this.props.login.userId);
    this.props.getUserOrders(this.props.login.userId);
    this.props.getReferalCode(this.props.login.userId);
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
  onShare = (referalCode) => {
    try {
      const result = Share.share({
        message:
          'Inviting you to inchpaper , a division of Stationary and Home Decor, Pioneers in Creating Classic Things. Download Now!!!  REFERRAL CODE: ' + referalCode,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  onBlog = () => {
    Linking.openURL('http://inchpaper-angular-v2.s3-website.ap-south-1.amazonaws.com/#/home')
  }
  render() {
    return (

      <DrawerContentScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#f5f5f5' }} >
        <View style={styles.drawerContent}>
          {this.props.login.loginSuccess ? <View style={{ backgroundColor: 'white' }}>
            <View style={{ marginTop: 25 }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                {/* <Avatar.Image
                  style={{ alignSelf: 'center' }}
                  // source={require('../images/P1.png')}
                  // source={require('../../screens/images/P1.png')}
                  source={require('../assets/P1.png')}
                  size={90}
                /> */}

              </View>

              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'column',
                  padding: 15,
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Title style={styles.title}>{this.props.user.firstName ? this.props.user.firstName + ' ' : this.props.user.phoneNumber}{this.props.user?.lastName !== null ? this.props.user.lastName : ""}</Title>
                  <View style={{ borderRadius: 360, padding: 5, elevation: 1, backgroundColor: '#fff', marginLeft: 5 }}>
                    <Icon name="pencil-outline" style={{}} color="#FF5733" size={20} onPress={() => this.props.navigation.navigate('ProfileEditScreen')} />
                  </View>
                </View>
                <Caption style={styles.caption}>
                  {this.props.user.email}
                </Caption>
              </View>
            </View>
          </View> : null}
          {this.props.login.loginSuccess ? null : <View style={{ backgroundColor: '#f5f5f5' }}>
            <Drawer.Section style={styles.topDrawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="exit-to-app" color={color} size={size} />
                )}
                label="Login/Register"
                onPress={() => {
                  this.onSingOut();

                }}
              />
            </Drawer.Section>
          </View>}
          <View>
            <Drawer.Section style={styles.drawerSection}>
              {/* <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="basket-outline" color={color} size={size} />
                )}
                label="My orders"
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
              /> */}
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="grid" color={color} size={size} />
                )}
                label="Shop By Categories"
                onPress={() => {
                  this.props.navigation.navigate('Categories');
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="package-variant-closed" color={color} size={size} />
                )}
                label="Bulk Purchase"

                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('Bulk');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to bulk purchase.',
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
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="wallet-giftcard" color={color} size={size} />
                )}
                label="Gift Cards"

                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('GiftCard');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to view Gift Cards.',
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

              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="phone-message" color={color} size={size} />
                )}
                label="Buy On Call"

                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('BuyOnCall');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to Book On Call.',
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

              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="party-popper" color={color} size={size} />
                )}
                label="Party Planning"

                onPress={() => {
                  if (this.props.login.loginSuccess) {

                    this.props.navigation.navigate('Party');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to Plan Party',
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
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="blogger" color={color} size={size} />
                )}
                label="Blogs"
                onPress={() => {
                  this.onBlog();
                }}
              />
              {/* <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="map-marker-outline" color={color} size={size} />
                )}
                label="Address"
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
              /> */}
              {/* <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Wishlist"
                onPress={() => {
                  this.props.navigation.navigate('Wishlist');
                }}
              /> */}
              {/* <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="wallet-outline" color={color} size={size} />
                )}
                label="My Wallet"
                onPress={() => {
                  if (this.props.login.loginSuccess) {
                    this.props.navigation.navigate('MyWallet');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to check wallet.',
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
              /> */}
              <View style={Style.line}></View>
              {this.props.login.loginSuccess && <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="face-agent" color={color} size={size} />
                )}
                label="Live Chat"
                onPress={() => {
                  this.props.navigation.navigate('Support');
                }}

              />}
              {this.props.login.loginSuccess && <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="account-group-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Refer a Friend"
                onPress={() => {
                  if (this.props.login.loginSuccess) {
                    this.props.navigation.navigate('Refer');
                  } else {
                    Alert.alert(
                      'You are not logged in.',
                      'Please login to Refer a friend.',
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
              />}
              {/* <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="share-outline" color={color} size={size} />
                )}
                label="Share"
                onPress={() => this.onShare(this.props.referalCode.code)}
              /> */}



              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="comment-question-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Help"
                onPress={() => {
                  this.props.navigation.navigate('FAQ');
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="autorenew" color={color} size={size} />
                )}
                label="About Us"
                onPress={() => {
                  this.props.navigation.navigate('ReturnPolicy');
                }}
              />
              {this.props.login.loginSuccess && <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="form-select" color={color} size={size} />
                )}
                label="Contact Us"
                onPress={() => {
                  this.props.navigation.navigate('Contact');
                }}
              />}

            </Drawer.Section>
          </View>
        </View>

        {this.props.login.loginSuccess && <View style={{ backgroundColor: '#f5f5f5' }}>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="exit-to-app" color={color} size={size} />
              )}
              label="Sign Out"
              onPress={() => {
                this.onSingOut();

              }}
            />
          </Drawer.Section>
        </View>}
      </DrawerContentScrollView>

    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    marginTop: 3,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  iconcart: {
    height: 22,
    color: 'grey',
    width: 22,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  topDrawerSection: {
    marginTop: 15,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);