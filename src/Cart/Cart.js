/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  THEME_COLOR,
  StatusBar,
  ScrollView,
  FlatList
} from 'react-native';
// import {Button, Icon, Header, Right} from 'native-base';
import Style from '../Components/Style';
import { Header, Icon } from 'react-native-elements';
import CartHeaderComopnent1 from '../Components/CartHeaderComopnent1';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import PlusMinusIcon from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native';
import { connect } from 'react-redux';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteOneItemFromCart, editDefaultVariant, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { findCartTotal, findCouponDiscount, toast } from '../Functions/functions';
import { abondendCheckoutUrl, getCouponsUrl, supplierId, updateAbondendCheckoutUrl, validateCouponsUrl } from '../../Config/Constants';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';
import { Alert } from 'react-native';
import { deleteCouponResponse, logOut, saveCouponResponse } from '../Redux/Auth/ActionCreatore';
import LottieView from 'lottie-react-native';
import { Colors } from '../config/GlobalContants';
import { CheckBox } from 'native-base';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    user: state.user,
    addresses: state.addresses,
    abandonedCheckout: state.abandonedCheckout,
    favourites: state.favourites,
    walletData: state.walletData,
    couponeResp: state.couponeResp,
  };
};

const mapDispatchToProps = (dispatch) => ({
  createDefaultVariants: (allProducts) =>
    dispatch(createDefaultVariants(allProducts)),
  deleteAllDefaultVarinats: () => dispatch(deleteAllDefaultVarinats()),
  editDefaultVariant: (newVariant, indexOfProduct) =>
    dispatch(editDefaultVariant(newVariant, indexOfProduct)),
  logOut: () => dispatch(logOut()),
  addOneItemToCart: (newProduct) => dispatch(addOneItemToCart(newProduct)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  deleteOneItemFromCart: (index) => dispatch(deleteOneItemFromCart(index)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
  addOneFavourite: (item) => dispatch(addOneFavourite(item)),
  removeOneFavourite: (productId) => dispatch(removeOneFavourite(productId)),
  addAbondonedId: (id) => dispatch(addAbondonedId(id)),
  deleteAbandoneId: () => dispatch(deleteAbandoneId()),
  deleteCouponResponse: () => dispatch(deleteCouponResponse()),
  saveCouponResponse: (resp, code) => dispatch(saveCouponResponse(resp, code)),
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promoDiscount: 0,
      deliveryCharge: 50,
      gift: false, wrapAmount: 0,
      coupons: [],
      couponIndex: -1,
      isCouponsLoading: false,
      couponCode: '',
      hasAppliedCouponCode: false,
      validatingCoupon: false,

    };
  }
  async componentDidMount() {
    this.props.deleteCouponResponse();
    await this.getPromoWalletAndMainWalletBalance();
    await this.getCoupons();
  }
  getCoupons = async () => {
    this.setState({ isCouponsLoading: true });
    var url = getCouponsUrl(supplierId);
    console.log('Getting coupons with url', url);
    await axios.get(url)
      .then((res) => {
        console.log(
          'here are the coupons - - - - - > ' + JSON.stringify(res.data.object),
        );
        this.setState({ coupons: res.data.object, isCouponsLoading: false });
      })
      .catch((err) => {
        this.setState({ isCouponsLoading: false });
        toast('Error in loading coupons.');
        // console.log('error' + err);
      });
  };
  getPromoWalletAndMainWalletBalance = async () => {
    var walletData = this.props.walletData.wallet;
    this.setState({
      walletbalanncedata: walletData,
    });
    var promoDiscount = 0;
    if (this.props.walletData.wallet.promoWalletAmount != 0) {
      if (
        Math.round(findCartTotal(this.props.cart.cart) * 0.1) >
        this.props.walletData.wallet.promoWalletAmount
      ) {
        promoDiscount = this.props.walletData.wallet.promoWalletAmount;
      } else {
        promoDiscount = Math.round(findCartTotal(this.props.cart.cart) * 0.1);
      }
      this.setState({ promoDiscount: promoDiscount });
    } else {
      this.setState({ promoDiscount: 0 });
    }
  };
  handleCart = (couponDiscount) => {
    if (this.props.login.loginSuccess) {
      if (!this.props.user.firstName) {
        Alert.alert(
          'You have not updated your profile.',
          'Please update your profile to place order.',
          [
            {
              text: 'Update profile',
              onPress: () => {
                this.props.navigation.navigate('ProfileEditScreen');
              },
            },
          ],
          { cancelable: false },
        );
      } else {


        var cartArray = [];
        this.props.cart.cart.map((item, index) => {
          console.log('cart data', item.indexOfselectedVariant, item.productListings[0]?.id)
          var mediaUrl =
            item?.productListings[item.indexOfselectedVariant]?.medias[0]?.mediaUrl;
          var oneCartitemToBePosted = {
            productListingId:
              item.productListings[item.indexOfselectedVariant].id,
            productId: item.id,
            productName: item.name,
            sellingPrice:
              item.productListings[item.indexOfselectedVariant].sellingPrice,
            mrp: item.productListings[item.indexOfselectedVariant].mrp,
            productDes: item.description,
            productImage:
              mediaUrl,
            quantity: item.productCountInCart,
            variantValues:
              item.productListings[item.indexOfselectedVariant]
                .variantValues.toString(),
            // tax: null,
            maxQuantityPerUser: item.maxOrderQty,
          };
          cartArray.push(oneCartitemToBePosted);
        });
        var deliveryFee = this.state.deliveryCharge, couponDiscount = couponDiscount;
        var promoDisc = this.state.promoDiscount, wrap = this.state.wrapAmount;
        console.log('Here is cart array', cartArray);
        var today = new Date();
        var cartTotal = findCartTotal(this.props.cart.cart);
        var oAmount = cartTotal;
        var fAmount = oAmount + deliveryFee - couponDiscount - promoDisc + wrap;
        var paymentMode = 'Uknown';
        var body = {
          cartProductRequests: cartArray,
          paymentMode: "NOT SELECTED YET",
          orderAmount: fAmount,

          supplier:
            supplierId,
          customer: this.props.login.userId,
          orderFrom: Platform.OS === 'ios' ? 'ios' : 'android',
          promoWallet: promoDisc,
          couponDiscount: couponDiscount,
          giftWrap: wrap,
          mainWallet: 0,
          tip: 0,
          tax: 0,
          paidAmount:
            paymentMode === 'ONLINE' || paymentMode === 'wallet' ? fAmount : 0,
          unpaidAmount:
            paymentMode === 'ONLINE' || paymentMode === 'wallet' ? 0 : fAmount,
          convenienceFee: deliveryFee,
          // couponDiscount: 0.0,
          deliveryType: 'HOME-DELIVERY',
          requiredDate: today, //doubt
          requiredTimeString: '',
          message: '',
          subTotal: cartTotal,
        };
        console.log('body of cart', this.props.addresses.userAddresses.length)
        if (this.props.addresses.userAddresses.length > 0) {
          this.props.navigation.navigate('AddedScreenAddress', { body: body, cartTotal: cartTotal })
        } else {
          this.props.navigation.navigate('CheckoutAddress', { body: body, cartTotal: cartTotal })
        }
      }
    }
    else {
      Alert.alert(
        'You are not logged in.',
        'Please login to add a delivery address.',
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
  }
  addAbondonedData = async (object) => {
    var url = abondendCheckoutUrl();
    var cartArray = [];
    await this.props.cart.cart.map((item, index) => {
      var indexOfVariantInProductListing = 0;
      item.productListings.map((x, y) => {
        if (x.variantValues[0] === item.variantSelectedByCustome) {
          indexOfVariantInProductListing = y;
        }
      });
      var selectedVariant = "";
      if (item.variantSelectedByCustome == undefined) {
        selectedVariant = "";
      } else {
        selectedVariant = item.variantSelectedByCustome;
      }
      var mediaUrl =
        item.medias &&
        item.medias[0] &&
        item.medias[0].mediaUrl &&
        item.medias[0].mediaUrl;
      console.log('media url at checkout', mediaUrl);
      var oneCartitemToBePosted = {
        productListingId:
          item.productListings[item.variantSelectedByCustome].id,
        productId: item.id,
        productName: item.name,
        sellingPrice: item.priceOfVariantSelectedByCustomer,
        mrp: item.productListings[item.variantSelectedByCustome].mrp,
        productDes: item.description,
        productImage: mediaUrl,
        quantity: item.productCountInCart,
        variantValues: item.variantSelectedByCustome,
        // tax: null,
        maxQuantityPerUser: item.maxOrderQty,
      };
      cartArray.push(oneCartitemToBePosted);
    });
    var body = {
      id: this.props.abandonedCheckout.id,
      abondenedCheckoutProductRequests: cartArray, supplier: supplierId,
      customerName: this.props.user.firstName
        ? this.props.user.firstName
        : this.props.login.userId,
      contactNo: this.props.user.phoneNumber,
      customer: this.props.login.userId,
    }
    // console.log('AddAbandoned data', url, JSON.stringify(body));

    Axios.post(url, body, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        // console.log('No of abandoned request->', JSON.stringify(response.data));
        this.props.addAbondonedId(response.data.object[0]?.id)
      })
      .catch(error => {
        toast('Error while loading abandoned data');
        console.log('Error in fetching abandoned data', error.message);
      });
  };
  updateAbondendCheckout = (idType) => {
    var url = updateAbondendCheckoutUrl(this.props.abandonedCheckout.id, idType);
    console.log('clear checkout data', url)
    Axios.put(url, {
      header: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      }
    }).then(response => {
      if (idType === 21) {
        this.props.deleteAbandoneId();
        console.log('clear abandonedrequest', response.data);
      }
      if (idType === 18) {
        console.log('moving to checkout', response.data.object)
      }
    })
      .catch(error => {
        // errorToast('Error while loading abandoned data');
        console.log('Error in clearing abandoned state data', error.message);
      });
  }
  handleGiftWrap = () => {
    this.setState({ gift: !this.state.gift }, () => {
      if (this.state.gift) {

        this.setState({ wrapAmount: 50 })
      } else {
        this.setState({ wrapAmount: 0 })
      }
    })
  }
  validateCoupon = async (couponCode, index) => {
    this.setState({ validatingCoupon: true });
    var url = validateCouponsUrl();
    console.log('Validating coupon with url', url);
    const cartTotal = parseInt(findCartTotal(this.props.cart.cart));
    var body = {
      couponCode: couponCode,
      supplierId: supplierId,
      orderAmount: cartTotal,
      customerId: this.props.login.userId,
    };
    await axios.post(url, body, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
    })
      .then((res) => {
        console.log(JSON.stringify(res.data));
        this.setState({ validatingCoupon: false });
        if (res.data.object != null) {
          const couponDiscount = findCouponDiscount(res, cartTotal);
          // console.log('Here is coupon discount', couponDiscount);
          if (couponDiscount > cartTotal) {
            toast('Not enough cart amount.');
          } else {
            toast('Coupon Applied Successfully');
            this.setState({ couponIndex: index })
            // this.props.navigation.goBack();
            this.props.saveCouponResponse(res, couponCode);
          }
        } else {
          toast(res.data.message + '\n    COUPON NOT APPLIED');
        }
      })
      .catch((err) => {
        toast('COUPON NOT APPLIED');
        this.setState({ validatingCoupon: false });
        // console.log('error in validating coupon' + err);
      });
  };
  render() {
    const cartTotal =
      this.props.cart.cart.length > 0
        ? findCartTotal(this.props.cart.cart)
        : 0;
    const couponDiscount = this.props.couponeResp.hasAddedCoupon
      ? findCouponDiscount(this.props.couponeResp.resp, cartTotal)
      : 0;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={<CartHeaderComopnent1 />}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* ===== progress bar ====== */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '35%', backgroundColor: Colors.primary, height: 2 }} />
              <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
              <View style={{ flex: 1 }}>
                <View style={{ paddingTop: 10 }}>
                  <FlatList data={this.props.cart.cart} keyExtractor={(index, item) => String(index)} renderItem={({ item, index }) => {
                    // console.log('cart item', item?.productListings[0]?.medias[0]?.mediaUrl)
                    return (
                      <View style={{ backgroundColor: '#fff', padding: 8 }}>
                        <View>
                          <View style={{ flexDirection: 'row', }} >

                            <View>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', {
                                from: 'Cart',
                                product: {
                                  id: item.id,
                                  name: item.name,
                                },
                              })}>
                                <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ height: 100, width: 90, }} />
                              </TouchableOpacity>
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', {
                                from: 'Cart',
                                product: {
                                  id: item.id,
                                  name: item.name,
                                },
                              })}>
                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 13, color: '#424242', paddingVertical: 10 }}>{item.name}</Text>
                                {/* <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: Colors.primary, paddingVertical: 10, textTransform: 'capitalize' }}>{item.return}</Text> */}
                              </TouchableOpacity>
                              <View style={styles.plusMinusButtonStyle}>
                                <TouchableOpacity
                                  style={{
                                    height: 28,
                                    justifyContent: 'center',
                                    backgroundColor: Colors.primary,
                                    borderRadius: 3,
                                  }}>
                                  <PlusMinusIcon
                                    onPress={async () => {
                                      this.props.decreaseProductCount(
                                        item.id,
                                        item.variantSelectedByCustome,
                                      );
                                      if (this.props.cart.cart.length == 0) {

                                        console.log('last data removed', this.props.cart.cart.length)
                                        this.updateAbondendCheckout(21);
                                      } else {
                                        this.addAbondonedData();
                                      }
                                    }}

                                    name="minus"
                                    size={18}
                                    style={{ padding: 8 }}
                                    color="#fff"
                                  />
                                </TouchableOpacity>
                                <Text style={styles.txtStyle}>{
                                  this.props.cart.cart[
                                    this.props.cart.cart.findIndex(
                                      (x) =>
                                        x.id === item.id &&
                                        x.variantSelectedByCustome ===
                                        item.variantSelectedByCustome,
                                    )
                                  ].productCountInCart
                                }</Text>
                                <TouchableOpacity
                                  style={{
                                    height: 25,
                                    //   padding: 5,
                                    justifyContent: 'center',
                                    backgroundColor: Colors.primary,
                                    borderRadius: 3,
                                  }}>
                                  <PlusMinusIcon
                                    onPress={async () => {
                                      // if (
                                      //   item.productListings[
                                      //     item.productListings.findIndex(
                                      //       (x) =>
                                      //         x.variantValues[0] ===
                                      //         item.variantSelectedByCustome,
                                      //     )
                                      //   ].maxOrderQty
                                      // ) {
                                      //   if (
                                      //     this.props.cart.cart[
                                      //       this.props.cart.cart.findIndex(
                                      //         (x) =>
                                      //           x.id === item.id &&
                                      //           x.variantSelectedByCustome ===
                                      //           item.variantSelectedByCustome,
                                      //       )
                                      //     ].productCountInCart <
                                      //     item.productListings[
                                      //       item.productListings.findIndex(
                                      //         (x) =>
                                      //           x.variantValues[0] ===
                                      //           item.variantSelectedByCustome,
                                      //       )
                                      //     ].inStockQuantity
                                      //   ) {
                                      //     await this.props.increaseProductCount(
                                      //       item.id,
                                      //       item.variantSelectedByCustome,
                                      //     );
                                      //     this.addAbondonedData();
                                      //   } else {
                                      //     toast(
                                      //       'You have reached the maximum order quantity for this product!',

                                      //     );
                                      //   }
                                      // } else {
                                      if (
                                        this.props.cart.cart[
                                          this.props.cart.cart.findIndex(
                                            (x) =>
                                              x.id === item.id &&
                                              x.variantSelectedByCustome ===
                                              item.variantSelectedByCustome,
                                          )
                                        ].productCountInCart <
                                        item.productListings[
                                          item.productListings.findIndex(
                                            (x) =>
                                              x.variantValues[0] ===
                                              item.variantSelectedByCustome,
                                          )
                                        ].inStockQuantity
                                      ) {
                                        await this.props.increaseProductCount(
                                          item.id,
                                          item.variantSelectedByCustome,
                                        );
                                        this.addAbondonedData();
                                      } else {
                                        toast(
                                          'You have reached the maximum order quantity for this product!',

                                        );
                                      }
                                      // }
                                    }}
                                    name="plus"
                                    size={18}
                                    style={{ padding: 8 }}
                                    color="#fff"
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', color: '#424242', fontSize: 13 }}>₹ {item.productListings.findIndex(
                                  (x) =>
                                    x.variantValues[0] === item.variantSelectedByCustome,
                                ) === -1
                                  ? item.productListings[0].sellingPrice
                                  : item.productListings[
                                    item.productListings.findIndex(
                                      (x) =>
                                        x.variantValues[0] ===
                                        item.variantSelectedByCustome,
                                    )
                                  ].sellingPrice}</Text>
                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', color: '#929292', fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 5 }}>₹ {item.productListings.findIndex(
                                  (x) => x.variantValues[0] === item.variantSelectedByCustome,
                                ) === -1
                                  ? item.productListings[0].mrp
                                  : item.productListings[
                                    item.productListings.findIndex(
                                      (x) =>
                                        x.variantValues[0] ===
                                        item.variantSelectedByCustome,
                                    )
                                  ].mrp}</Text>
                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', color: Colors.primary, fontSize: 10, textTransform: 'capitalize' }}>(Saved ₹ {(item.productListings.findIndex(
                                  (x) => x.variantValues[0] === item.variantSelectedByCustome,
                                ) === -1
                                  ? item.productListings[0].mrp
                                  : item.productListings[
                                    item.productListings.findIndex(
                                      (x) =>
                                        x.variantValues[0] ===
                                        item.variantSelectedByCustome,
                                    )
                                  ].mrp) -
                                  (item.productListings.findIndex(
                                    (x) =>
                                      x.variantValues[0] === item.variantSelectedByCustome,
                                  ) === -1
                                    ? item.productListings[0].mrp
                                    : item.productListings[
                                      item.productListings.findIndex(
                                        (x) =>
                                          x.variantValues[0] ===
                                          item.variantSelectedByCustome,
                                      )
                                    ].sellingPrice)})</Text>
                              </View>
                            </View>
                          </View>
                          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingHorizontal: '8%' }}>
                            <View>
                              <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#929292' }}>Delivery:</Text>
                              <Text style={{ fontFamily: 'sans-serif-light', fontSize: 10, color: '#929292' }}>Mon, 15 Feb:</Text>
                              <Text style={{ fontFamily: 'sans-serif-light', fontSize: 10, color: '#929292' }}>Charges: ₹449</Text>
                            </View>
                            <View>
                              <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#929292' }}>Assembly:</Text>
                              <Text style={{ fontFamily: 'sans-serif-light', fontSize: 10, color: '#929292', textTransform: 'capitalize' }}>Offered By inchpaper</Text>
                              <Text style={{ fontFamily: 'sans-serif-light', fontSize: 10, color: '#929292' }}>Charges: ₹399</Text>
                            </View>
                          </View> */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => { this.props.deleteOneItemFromCart(index); toast('Removed from Cart') }} style={{ padding: 10, width: '40%', borderColor: '#E6E6E6', borderTopWidth: 1, borderRightWidth: 1 }}>
                              <Text style={{ fontFamily: 'san-serif-light', fontSize: 13, textTransform: 'uppercase', color: '#646464', textAlign: 'center' }}>Remove</Text>
                            </TouchableOpacity>
                            {this.props.favourites.products.findIndex(
                              (it, ind) => it.id === item.id,
                            ) === -1 ? <TouchableOpacity onPress={() => this.props.addOneFavourite(item)} style={{ padding: 10, width: '60%', borderColor: '#E6E6E6', borderTopWidth: 1, }}>
                                <Text style={{ fontFamily: 'san-serif-light', fontSize: 13, textTransform: 'uppercase', color: '#646464', textAlign: 'center', fontWeight: 'bold' }}>move to Wishlist</Text>
                              </TouchableOpacity> : <TouchableOpacity onPress={() => this.props.removeOneFavourite(item.id)} style={{ padding: 10, width: '60%', borderColor: '#E6E6E6', borderTopWidth: 1, }}>
                                <Text style={{ fontFamily: 'san-serif-light', fontSize: 13, textTransform: 'uppercase', color: '#646464', textAlign: 'center', fontWeight: 'bold' }}>moved to Wishlist</Text>
                              </TouchableOpacity>}
                          </View>
                        </View>
                      </View>
                    )
                  }} ItemSeparatorComponent={() => (
                    <View style={{ paddingVertical: 5 }} />
                  )} />
                </View>
                {/* ======Coupons====== */}
                <View style={{ backgroundColor: '#fff', elevation: 2, marginTop: 10, padding: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, paddingBottom: 10 }}>Coupon Codes</Text>
                  <FlatList data={this.state.coupons} keyExtractor={index => String(index)} renderItem={({ item, index }) => {
                    console.log('coupons', item)
                    return (
                      <View>

                        <TouchableOpacity onPress={() => this.validateCoupon(item.couponCode, index)}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                            <View style={{ flexDirection: "row" }}>
                              {<MCIcon name={this.state.couponIndex === index ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"} style={{ paddingTop: 5 }} size={20} />}
                              <View style={{ paddingLeft: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.couponCode}</Text>
                                <Text>{item.description}</Text>
                              </View>
                            </View>
                            <View>
                              <Text style={{ color: Colors.success, paddingTop: 10 }}>
                                {couponDiscount > 0 ? '₹ ' + couponDiscount : ''}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                    ItemSeparatorComponent={() => { return (<View style={{ height: 1, backgroundColor: Colors.gray }} />) }}
                    ListFooterComponent={() => {
                      return (<View style={{ marginTop: 5, borderTopWidth: 1, borderTopColor: Colors.gray, padding: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Coupon')}>
                          <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 16 }}>Have A Coupon Code?</Text>
                        </TouchableOpacity>
                      </View>)
                    }}
                  />
                </View>
                {/* ====== BIlling  ====*/}
                {this.props.cart.cart.length > 0 ? <View style={{ paddingVertical: 15 }}>
                  <View style={{ padding: 10, backgroundColor: '#fff', }}>
                    {/* == ( Items and Price ) === */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                      <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 13, }}>{this.props.cart.cart.length} {this.props.cart.cart.length === 1 ? 'Item' : 'Items'}</Text>
                      <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 13, }}>you pay ₹ {findCartTotal(this.props.cart.cart) - this.state.promoDiscount - couponDiscount + this.state.deliveryCharge + this.state.wrapAmount}</Text>
                    </View>

                    {/* ==== Cupon Code  ====*/}
                    {/* <View style={{ paddingVertical: 8 }}>
                      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
                        <Text onPress={() => this.props.navigation.navigate('Coupon')} style={{ fontFamily: 'sans-serif-light', fontSize: 16, color: '#6E6E6E', width: '80%', fontWeight: 'bold', }} >{this.props.couponeResp.hasAddedCoupon
                          ? 'COUPON APPLIED - ' + this.props.couponeResp.code
                          : 'APPLY COUPON'}</Text>
                        {this.props.couponeResp.hasAddedCoupon ? <Icon onPress={() => this.props.deleteCouponResponse()} name="close" size={25} color={Colors.primary} /> : <Icon name="chevron-right" size={25} color={Colors.primary} />}
                      </TouchableOpacity>
                    </View> */}
                    {/* -===== price details ===== */}

                    <View>
                      <View style={{ paddingVertical: 4, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444' }}>MRP</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444' }}>₹ {findCartTotal(this.props.cart.cart)}</Text>
                      </View>
                      <View style={{ paddingVertical: 4, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#3A9F08' }}>Promo Discount</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#3A9F08' }}>(-)₹ {this.state.promoDiscount}</Text>
                      </View>
                      <View style={{ paddingVertical: 4, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444', fontWeight: 'bold' }}>Coupon Discount <Text onPress={() => { this.props.deleteCouponResponse(), this.setState({ couponIndex: -1 }) }} style={{ color: '#ea0016' }}> {this.props.couponeResp.hasAddedCoupon ? 'Remove' : ''}</Text></Text>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444', fontWeight: 'bold' }}>(-)₹ {couponDiscount}</Text>
                      </View>
                      <View style={{ paddingVertical: 4, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444' }}>Delivery Fees</Text>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444' }}>₹ {this.state.deliveryCharge}</Text>
                      </View>
                      <View style={{ paddingVertical: 4, paddingHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TouchableOpacity onPress={() => this.handleGiftWrap()} style={{}} >
                            <CheckBox checked={this.state.gift} color={Colors.success} style={{ left: 0 }} onPress={() => this.handleGiftWrap()} />
                          </TouchableOpacity>
                          <Text style={{ fontSize: 13, marginLeft: 10, fontFamily: 'sans-serif-condensed', color: '#454444', }}>Gift Wrapping</Text>
                        </View>
                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#454444' }}>₹ {this.state.wrapAmount}</Text>
                      </View>

                      <View style={{ paddingTop: 10, paddingHorizontal: 5 }}>
                        <View style={{ height: 1, backgroundColor: '#CECECE', }} />
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 5 }}>
                        <Text style={{ fontSize: 14, textTransform: 'capitalize', fontWeight: 'bold' }}>Total Pay</Text>
                        <View>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>₹ {findCartTotal(this.props.cart.cart) - this.state.promoDiscount - couponDiscount + this.state.deliveryCharge + this.state.wrapAmount}</Text>
                          <Text style={{ fontSize: 11, color: '#7A7B7A' }}>(Incl. of all taxes)</Text>
                        </View>
                      </View>
                    </View>

                  </View>
                </View> :
                  <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: '40%' }}>
                    {/* <Image source={require('../assets/noCart.jpg')} style={{ height: 200, width: 200, }} /> */}
                    <View>
                      <LottieView source={require('../assets/dlivery-man.json')} autoPlay loop style={{ width: '100%', height: 200 }} />
                    </View>
                    <Text style={{ fontSize: 22, color: '#000', paddingVertical: 5 }}>
                      No Products Added in Cart
                  </Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#000', fontFamily: 'sans-serif-light' }}>
                      Please Add Product to Checkout
                  </Text>

                  </View>
                }
              </View>
            </ScrollView>
          </View>

          {this.props.cart.cart.length > 0 && <View>
            <TouchableOpacity onPress={() => this.handleCart(couponDiscount)} style={{ padding: 15, backgroundColor: Colors.primary }}>
              <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'sans-serif-light', letterSpacing: 1 }}>Place Order</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  plusMinusButtonStyle: {
    height: 40,
    width: 100,
    borderRadius: 5,
    justifyContent: 'space-around',
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'flex-end',
  },
  txtStyle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlignVertical: 'center',
    fontFamily: 'sans-serif-light'
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Login)