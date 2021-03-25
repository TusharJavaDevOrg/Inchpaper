/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';

import Style from '../Components/Style';
import { addedRefferalCode, addNearestSupplier, addressSelected, addSelectedAddress, deleteNearestSupplier, deleteStoreData, findDelivrableSocieties, getPaymentMode, getTimeSlots, getuserAddresses, toggleOrderType } from '../Redux/Auth/ActionCreatore';
import { getCategorys, getNeedsBrands } from '../Redux/Cart/ActionCreators';
import { connect } from 'react-redux'
import { deleteAddressUrl, deliveriblityCheckUrl, getNearestStoreUrl } from '../../Config/Constants';
import Axios from 'axios';
import { Dimensions } from 'react-native';
import { Colors } from '../config/GlobalContants';
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    addresses: state.addresses,
    hasAddedRefferalCode: state.hasAddedRefferalCode,
    deliverableSocieties: state.deliverableSocieties,
    supplier: state.supplier,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleOrderType: (bool) => dispatch(toggleOrderType(bool)),
  getuserAddresses: (customerId) => dispatch(getuserAddresses(customerId)),
  addSelectedAddress: (address) => dispatch(addSelectedAddress(address)),
  addressSelected: () => dispatch(addressSelected()),
  addNearestSupplier: (nearestSupplierData, minDist) =>
    dispatch(addNearestSupplier(nearestSupplierData, minDist)),
  deleteNearestSupplier: () => dispatch(deleteNearestSupplier()),
  addedRefferalCode: () => dispatch(addedRefferalCode()),
  findDelivrableSocieties: () => dispatch(findDelivrableSocieties()),
  deleteStoreData: () => dispatch(deleteStoreData()),
  getCategorys: (supplId) => dispatch(getCategorys(supplId)),
  getBrands: (supplId) => dispatch(getBrands(supplId)),
  getNeedsBrands: (supplId) => dispatch(getNeedsBrands(supplId)),
  getPaymentMode: () => dispatch(getPaymentMode()),
  getTimeSlots: () => dispatch(getTimeSlots()),
});
class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddressesLoading: false,
      customerAddresses: [],
      networkError: false,
      develireblityCheckModelShown: false,
      develireblityCheckLoading: false,
      deleveriblityCheckData: [],
      selectedAddress: null,
      referalCodeModalVisible: false,
      refferalCode: '',
      societyData: [],
      societyDataLoading: false,
      allStoresData: [],
      stringOfLatsAndLngs: '',
      userDistanceFromStore: '',
    }
  }
  async componentDidMount() {
    var data = {
      currentSelectedAddress: this.props.addresses.selectedAddress,
      userId: this.props.login.userId,
    };
    // this.props.getuserAddresses(data);
  }
  findNearestStore = async (lattitude, longitude) => {
    var url = getNearestStoreUrl(lattitude, longitude);
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then((resp) => {
        // console.log(
        //   'Nearesr supplies data=================================================================================================================================>',
        //   resp.data.object,
        // );
        var indexOfNearestSupplier = 0;
        var minimumDistance = 0;
        resp.data.object.map((item, index) => {
          if (index === 0) {
            indexOfNearestSupplier = 0;
            minimumDistance = item.distance;
          } else {
            if (item.distance < minimumDistance) {
              minimumDistance = item.distance;
              indexOfNearestSupplier = index;
            }
          }
        });
        var nearestSupplierData = [resp.data.object[indexOfNearestSupplier]];
        this.props.addNearestSupplier(nearestSupplierData);
      })
      .catch((error) => {
        // console.log(
        //   'Error in fetching nearest supplier=================================>',
        //   error.message,
        // );
      });
  };

  checkDeliveriblity = async (slelectedAddress) => {
    // this.props.findDelivrableSocieties();
    this.setState({
      develireblityCheckLoading: true,
    });
    var url = deliveriblityCheckUrl(
      slelectedAddress.latitude,
      slelectedAddress.longitude,
    );

    console.log('URL', slelectedAddress.latitude, slelectedAddress.longitude, url);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then((response) => {
        console.log('Deliveriblity check data->', response.data.object);
        this.setState({
          deleveriblityCheckData: response.data.object,
        });
        if (response.data.object.length === 0) {
          this.setState({
            develireblityCheckModelShown: true,
            develireblityCheckLoading: false,
          });
        } else {
          this.findNearestStore(
            slelectedAddress.latitude,
            slelectedAddress.longitude,
          );
          this.props.addSelectedAddress(slelectedAddress);
          if (this.props.login.hasSelectedAddress) {
            this.props.navigation.goBack();
          } else this.props.addressSelected();
          this.setState({
            develireblityCheckLoading: false,
          });
        }
      })
      .catch((error) => {
        // console.log('Error', error);
        this.setState({
          develireblityCheckLoading: false,
        });
      });
  };

  navigateLanding = (slelectedAddress) => {
    this.findNearestStore(
      slelectedAddress.latitude,
      slelectedAddress.longitude,
    );
    this.props.addSelectedAddress(slelectedAddress);
    if (this.props.login.hasSelectedAddress) {
      this.props.navigation.goBack();
    } else this.props.addressSelected();
  };

  verifyRefferalCode = async () => {
    var url = verifyRefferalCodeUrl(
      this.state.refferalCode,
      this.props.login.userId,
    );
    // console.log('Verifying refferal code using this url', url);

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
    })
      .then((resp) => {
        // console.log('Here is the response for refferal code', resp.data);
        this.props.addedRefferalCode();
        ToastAndroid.showWithGravity(
          resp.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      })
      .catch((err) => {
        // console.log('Err in verifying refferal code', err.message);
      });
  };

  deleteAddress = async (addressId) => {
    var url = deleteAddressUrl(addressId);

    var data = {
      currentSelectedAddress: this.props.addresses.selectedAddress,
      userId: this.props.login.userId,
    };

    await Axios.delete(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
    })
      .then((resp) => {
        // console.log('Here is address deletion resp', resp);
        this.props.getuserAddresses(this.props.login.userId);
        toast(
          resp.data.message,

        );
      })
      .catch((err) => {
        // console.log('Here is address deletion error', err.message);
      });
  };
  render() {
    var fromWhere = this.props.route.params?.fromWhere;
    // console.log('saved add', fromWhere)
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={fromWhere !== undefined ? <IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} /> : null}
          centerComponent={{ text: 'Saved Address' }}
        />

        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>

              <View style={{ padding: 10 }}>
                {this.props.addresses.isLoading ?
                  <FlatList data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                    // console.log('addddd', item)
                    return (
                      <View style={{ backgroundColor: '#fff', padding: 10 }}>
                        <View
                          // onPress={() => {
                          //   this.setState({ selectedAddress: item });
                          //   // this.checkDeliveriblity(item);
                          //   // this.props.navigation.navigate('Home')
                          // }}
                          style={{ paddingVertical: 10 }}>
                          <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef' }}></Text>
                          <View style={{ paddingVertical: 3 }}>
                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef' }}></Text>
                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef' }}></Text>
                          </View>
                          <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef' }}></Text>
                        </View>
                      </View>
                    )
                  }} ItemSeparatorComponent={() => (
                    <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />
                  )}

                  />
                  :
                  <FlatList data={this.props.addresses.userAddresses} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                    // console.log('addddd', item)
                    return (
                      <View style={{ backgroundColor: '#fff', padding: 10 }}>
                        <View
                          // onPress={() => {
                          //   this.setState({ selectedAddress: item });
                          //   // this.checkDeliveriblity(item);
                          //   this.props.navigation.navigate('Home')
                          // }}
                          style={{ paddingVertical: 10 }}>
                          <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', }}>{item.customerName}</Text>
                          <View style={{ paddingVertical: 3 }}>
                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', }}>{item.addressLine1}</Text>
                            <Text numberOfLines={3} style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', }}>{item.addressLine2 + ', ' + item.city + ', ' + item.addressState + ', ' + item.country + ', ' + item.pincode}</Text>
                          </View>
                          <Text style={{ fontSize: 12, fontFamily: 'sans-serif', }}>{item.emailId}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: '4%', }}>
                          <Text onPress={() => Alert.alert(
                            'Are you sure?',
                            'This address will be deleted permanently.',
                            [
                              {
                                text: 'Cancel',
                                onPress: () =>
                                  console.log('Cancel Pressed'),
                                style: 'cancel',
                              },
                              {
                                text: 'Delete',
                                onPress: () => {
                                  this.deleteAddress(item.id);
                                },
                              },
                            ],
                            { cancelable: false })} style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', }}>Delete</Text>
                          <Text onPress={() => this.props.navigation.navigate('AddAddress', { data: item, from: 'EditAddress' })} style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', paddingHorizontal: '10%' }}>Edit</Text>
                        </View>
                      </View>
                    )
                  }} ItemSeparatorComponent={() => (
                    <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />
                  )}
                    ListEmptyComponent={() => <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        // backgroundColor: '#fff',
                      }}>
                      <View style={{ marginVertical: 20 }}>
                        <Image
                          style={{
                            height: 200,
                            width: 200,
                            alignSelf: 'center',
                            color: '#efefef',
                          }}
                          source={require('../assets/noAddress.png')}
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
                          Welcome to inchpaper
                  </Text>
                      </View>
                      <View style={{ marginVertical: 20 }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#a7a7a7',
                            fontSize: 15,
                          }}>
                          Please add an address to proceed.
                  </Text>
                      </View>
                      {/* <View style={{ marginVertical: 20, width: SCREEN_WIDTH }}>
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('AddAddress')}
                        style={{
                          borderColor: '#222',
                          borderWidth: 1,
                          padding: 10,
                          marginHorizontal: 70,
                        }}>
                        <Text
                          style={{
                            color: '#222',
                            fontWeight: '700',
                            alignSelf: 'center',
                          }}>
                          ADD ADDRESS
                    </Text>
                      </TouchableOpacity>
                    </View> */}
                    </View>}
                  />}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ backgroundColor: '#fff' }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('AddAddress', { from: 'Add' })} style={{ padding: 15, backgroundColor: Colors.primary, borderColor: Colors.primary, borderWidth: 1 }}>
            <Text style={{ fontSize: 15, color: Colors.white, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'sans-serif-light', letterSpacing: 1 }}>add new address</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Address)