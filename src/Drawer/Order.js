/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
// import {Icon, Left, Title, Right, Header} from 'native-base';
import { View, Text, ScrollView, Image, StatusBar, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { getProductWithProductIdsUrl, reorderAddUrl, supplierId } from '../../Config/Constants';
import CartHeaderComopnent2 from '../Components/CartHeaderComopnent2';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import Style from '../Components/Style'
import { Colors } from '../config/GlobalContants';
import { getDate } from '../Functions/functions';
import { getUserOrders, getWalletData, getWalletTransactions } from '../Redux/Auth/ActionCreatore';
import { addOneItemToCart } from '../Redux/Cart/ActionCreators';
import axios from 'axios';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    userOrders: state.userOrders,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserOrders: (customerId, supplId) =>
    dispatch(getUserOrders(customerId, supplId)),
  getWalletData: (customerId, supplId) =>
    dispatch(getWalletData(customerId, supplId)),
  getWalletTransactions: (customerId) =>
    dispatch(getWalletTransactions(customerId)),
  addOneItemToCart: (data) => dispatch(addOneItemToCart(data))
});
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [


      ]
    }
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.props.getUserOrders(this.props.login.userId, supplierId)
      //Put your Data loading function here
    });
  }
  _renderItemEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: '35%' }}>
        <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 350, alignSelf: 'center' }} />
        <Text style={{ textAlign: "center", fontSize: 24 }}>Not ordered anything yet..</Text>
      </View>
    )
  }
  reorderApi = async (orderData) => {
    console.log("XXXXORDER", orderData.cartProductRequests);

    var productsArray = [];
    var i, json;
    for (i = 0; i < orderData.cartProductRequests.length; i++) {
      json = orderData.cartProductRequests[i].productListing.product.id
      productsArray.push(json)
    }
    var ids = '';
    productsArray.map((it) => {
      ids += 'ids=' + it + '&'
    });
    const url = reorderAddUrl(ids);
    console.log("XXXURL", url);
    await axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    }).then(response => {
      console.log('responseeee', response.data.object)
      var j;
      const products = [...response.data.object];
      console.log('productsss', products)
      for (j = 0; j < products.length; j++) {
        products[j].productCountInCart = 1;
        products[j].variantSelectedByCustome = products[j].productListings[0].variantValues[0];
        this.props.addOneItemToCart(
          products[j],
          orderData.cartProductRequests.length > 0
            ? this.props.cart.cart[0]
            : 'Empty',
        );
        console.log('productsss', products)
      }
      console.log('XXXproducts', response.data.object,);
    })
      .catch(err => {
        console.log("ERRORXXX", err.message);
      });


    console.log("XXXJSON", productsArray);
    this.props.navigation.navigate('Cart');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'My Orders' }}
          rightComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Cart')} showCart iconName='cart-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
        />
        <View style={{ flex: 1 }}>
          {this.props.userOrders.orders.length > 0 && <View style={{ padding: 10, }}>
            <Text style={{ color: '#4A4949', fontSize: 12, fontWeight: 'bold', fontFamily: 'sans-serif-light', textTransform: 'uppercase' }}>You've placed {this.props.userOrders.orders.length} orders </Text>
          </View>}
          <View style={{ padding: 5, flex: 1 }}>
            {this.props.userOrders.isLoading ?
              <View style={{ justifyContent: 'center', flex: 1, alignContent: 'center' }}>
                <ActivityIndicator size={'large'} color={Colors.primary} style={{ alignSelf: 'center' }} />
              </View>
              : <FlatList data={this.props.userOrders.orders} refreshControl={
                <RefreshControl
                  refreshing={this.props.userOrders.isLoading}
                  onRefresh={() => {
                    this.props.getUserOrders(
                      this.props.login.userId,
                      supplierId,
                    );
                  }}
                  progressViewOffset={80}
                  progressBackgroundColor={Colors.primary}
                  colors={['#fff']}
                />
              } keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => {
                console.log('item state', item.state.id)
                return (
                  <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, }}>
                    <View style={{ paddingVertical: 10, }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                          <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#363535', fontFamily: 'sans-serif-light' }}>Order id: #{item?.id}</Text>
                          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <Text style={[item?.state?.description === 'cancelled' ? { backgroundColor: Colors.red } : item?.state?.description === 'delivered' ? { backgroundColor: Colors.success } : { backgroundColor: 'orange' }, { fontWeight: 'bold', fontSize: 10, color: Colors.white, borderRadius: 5, fontFamily: 'sans-serif-light', padding: 5, }]}>{item?.state?.description}</Text>
                          </View>

                          <Text style={{ fontSize: 11, color: '#636363', fontFamily: 'sans-serif-light' }}>{getDate(item?.createdDate)} | {item.cartProductRequests.length}{item.cartProductRequests.length === 1 ? ' Product' : ' Products'}</Text>
                        </View>
                        <View>
                          <TouchableOpacity onPress={() => this.reorderApi(item)} style={{ borderWidth: 0.5, borderColor: Colors.primary, padding: 5 }}>
                            <Text style={{ color: Colors.primary, textAlign: 'center' }}>Re-Order</Text>
                          </TouchableOpacity>
                          <Text style={{ marginVertical: 10 }} >Total Order:Rs.{item.orderAmount}</Text>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetails', { data: item })} style={{ borderWidth: 0.5, borderColor: Colors.primary, backgroundColor: Colors.primary, padding: 5 }}>
                            <Text style={{ color: Colors.white, textAlign: 'center' }}>View Order List</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {item.state.id !== 7 && <View>
                        <View style={{ alignSelf: 'center', marginTop: 10, }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={[item.state.id == 3 || item.state.id > 3 ? { borderRadius: 360, height: 15, width: 15, backgroundColor: Colors.primary } : { borderRadius: 360, height: 15, width: 15, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}></View>
                                <View style={item.state.id == 3 || item.state.id > 3 ? { borderWidth: 1, borderColor: Colors.primary, width: 85, height: 2, top: 7 } : { borderWidth: 1, borderColor: '#000', width: 85, height: 2, top: 7 }}></View>
                              </View>
                              <Text style={{ fontSize: 10, left: -10 }}>Orderd</Text>
                            </View>
                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={[item.state.id == 4 || item.state.id > 4 ? { borderRadius: 360, height: 15, width: 15, backgroundColor: Colors.primary } : { borderRadius: 360, height: 15, width: 15, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}></View>
                                <View style={item.state.id == 4 || item.state.id > 4 ? { borderWidth: 1, borderColor: Colors.primary, width: 85, height: 2, top: 7 } : { borderWidth: 0.8, borderColor: '#000', width: 85, height: 1, top: 7 }}></View>
                              </View>
                              <Text style={{ fontSize: 10, left: -15 }}>In Process</Text>
                            </View>
                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={[item.state.id == 5 || item.state.id > 5 ? { borderRadius: 360, height: 15, width: 15, backgroundColor: Colors.primary } : { borderRadius: 360, height: 15, width: 15, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}></View>
                                <View style={item.state.id == 5 || item.state.id > 5 ? { borderWidth: 1, borderColor: Colors.primary, width: 85, height: 2, top: 7 } : { borderWidth: 0.8, borderColor: '#000', width: 85, height: 1, top: 7 }}></View>
                              </View>
                              <Text style={{ fontSize: 10, left: -15 }}>Shipped</Text>

                            </View>

                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={[item.state.id == 6 ? { borderRadius: 360, height: 15, width: 15, backgroundColor: Colors.primary } : { borderRadius: 360, height: 15, width: 15, backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}></View>

                              </View>
                              <Text style={{ fontSize: 10, left: -10 }}>Delivered</Text>
                            </View>

                          </View>
                        </View>
                      </View>}

                    </View>

                  </View>
                )
              }}
                ListEmptyComponent={this._renderItemEmpty}
                ItemSeparatorComponent={() => (
                  <View style={{ paddingVertical: 5 }} />
                )} />}
          </View>
        </View>


      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Order)