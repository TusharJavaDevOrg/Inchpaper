import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import Axios from 'axios';
import {
  getCouponsUrl,
  validateCouponsUrl,
  supplierId,
} from '../../Config/Constants';
import { connect } from 'react-redux';

import { saveCouponResponse } from '../Redux/Auth/ActionCreatore';


import { findCartTotal, findCouponDiscount, toast } from '../Functions/functions';

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    login: state.login,
    couponeResp: state.couponeResp,
  };
};

const mapDispatchToProps = (dispatch) => ({
  saveCouponResponse: (resp, code) => dispatch(saveCouponResponse(resp, code)),
});

class Coupons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      isCouponsLoading: false,
      couponCode: '',
      hasAppliedCouponCode: false,
      validatingCoupon: false,
    };
  }

  componentDidMount() {
    this.getCoupons();
  }

  getCoupons = async () => {
    this.setState({ isCouponsLoading: true });
    var url = getCouponsUrl(supplierId);
    console.log('Getting coupons with url', url);
    await Axios.get(url)
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

  validateCoupon = async (couponCode) => {
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
    await Axios.post(url, body, {
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
            this.props.navigation.goBack();
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
    // console.log(
    //   'here is the coupone response saved in local from coupons',
    //   this.props.couponeResp,
    // );
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ea0016' }}>
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'Enter Code' }}
        />
        {this.state.validatingCoupon || this.state.isCouponsLoading ? (
          <View
            style={{
              position: 'absolute',
              marginTop: 300,
              zIndex: 1000,
              alignSelf: 'center',
            }}>
            <ActivityIndicator size={35} color="#ea0016" />
          </View>
        ) : null}
        <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 5 }}>
            <View style={styles.codeInputMainView}>
              <View style={{ flex: 8 }}>
                <TextInput
                  placeholder="Enter coupon code"
                  placeholderTextColor="#afafaf"
                  style={styles.codeTextInput}
                  value={this.state.couponCode}
                  onChangeText={(txt) => {
                    this.setState({ couponCode: txt });
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.validateCoupon(this.state.couponCode);
                }}
                style={styles.applyBtn}>
                <Text style={{ color: '#ea0016', fontSize: 16 }}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!this.state.isCouponsLoading && this.state.coupons.length === 0 ? (
            <Text style={styles.noCouponFoundTxt}>No Coupons Found</Text>
          ) : (
              <View style={{ marginTop: 5, margin: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 12, paddingTop: 10 }}>
                  LIST OF AVAILABLE COUPONS
              </Text>
                {this.state.coupons.map((it, ind) => {
                  return (
                    <View
                      style={{
                        marginVertical: 10,
                        borderColor: '#efefef',
                        borderWidth: 1,
                        borderRadius: 4,
                        backgroundColor: '#fff',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: 15,
                          paddingHorizontal: 5,
                          borderBottomColor: '#efefef',
                          borderBottomWidth: 1,
                        }}>
                        <View style={{ flex: 1 }}>
                          <Image
                            source={require('../assets/logo.png')}
                            style={{ height: 60, width: 60, marginVertical: 5 }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 3,
                            color: '#555',
                            alignSelf: 'center',
                            width: '100%',
                            paddingVertical: 10,
                            alignItems: 'center',
                          }}>
                          <Text>{it.description && it.description}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 5,
                          paddingVertical: 10,
                          marginHorizontal: 10,
                        }}>
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            fontSize: 17,
                            fontWeight: 'bold',
                          }}>
                          {it.couponCode && it.couponCode}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.validateCoupon(it.couponCode);
                          }}>
                          <Text
                            style={{
                              color: '#ea0016',
                              fontSize: 16,
                            }}>
                            SELECT
                        </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Coupons);

const styles = StyleSheet.create({
  codeTextInput: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#efefef',
    borderRadius: 4,
    backgroundColor: '#efefef',
  },
  codeInputMainView: {
    flexDirection: 'row',
    borderColor: '#efefef',
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  panel: {
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
  },
  noCouponFoundTxt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#cfcfcf',
    alignSelf: 'center',
    paddingTop: 200,
  },
  applyBtn: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
