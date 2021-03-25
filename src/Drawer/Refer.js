import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  Share, Clipboard,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { getReferalCode } from '../Redux/Auth/ActionCreatore';
import { toast } from '../Functions/functions';
import { Colors } from '../config/GlobalContants';
import { Dimensions } from 'react-native';
import ElevatedView from 'react-native-elevated-view';

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    login: state.login,
    referalCode: state.referalCode,
    supplier: state.supplier,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
});

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refralCode: '5DFT87977',
    }
  }
  async componentDidMount() {
    await this.props.getReferalCode(this.props.login.userId);
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Hi, I recommend Inchpaper a one-stop solution for all your school textbooks and stationery, and office stationery. You should download the Mobile App and use my referral code ' + this.props.referalCode.code + '. To signup and get upto Rs. 200 cashback on your first order.'
        ,
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
  copyToClipboard = (string) => {
    Clipboard.setString(string);
    toast(
      'Copied to clipboard',
    );
  };
  render() {
    // console.log('reffff', this.props.referalCode.code)
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'Refer a Friend' }}
        />

        <View style={{ flex: 1 }}>
          <View style={{ paddingVertical: '10%' }}>
            <LottieView source={require('../assets/friend.json')} autoPlay loop style={{ height: 200, width: '100%', alignSelf: 'center' }} />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: '2%' }}>
            <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 20, color: '#000', width: '70%', textAlign: 'center' }}>Invite Friends and Get Exclusive Discount Vouchers.</Text>
          </View>
          <ElevatedView style={{ borderRadius: 3, borderWidth: 0.8, elevation: 2, borderColor: Colors.white, margin: 10, width: '90%', alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontWeight: "bold" }}>Get cashback worth</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Rs 200</Text>
                <Text style={{ fontWeight: "bold" }}>when you refer Inchpaper to your friend.</Text>
              </View>
              <Image source={require('../assets/rupee.png')} style={{ height: Dimensions.get('screen').height / 16, width: Dimensions.get('screen').height / 16 }} />
            </View>
          </ElevatedView>
          <ElevatedView style={{ borderRadius: 3, borderWidth: 0.8, elevation: 2, borderColor: Colors.white, margin: 10, width: '90%', alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontWeight: "bold" }}>Friend get cashback worth</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Rs 100</Text>
                <Text style={{ fontWeight: "bold" }}>when they use your Referral Coupon Code.</Text>
              </View>
              <Image source={require('../assets/rupee.png')} style={{ height: Dimensions.get('screen').height / 16, width: Dimensions.get('screen').height / 16 }} />
            </View>
          </ElevatedView>
          {/* <Text style={{ fontFamily: 'sans-serif-light', fontSize: 14, width: '80%', textAlign: 'center', paddingVertical: '3%' }}>You get cashback worth Rs 200 when you refer inchpaper to your friend.</Text>
          <Text style={{ fontFamily: 'sans-serif-light', fontSize: 14, width: '80%', textAlign: 'center', paddingVertical: '3%' }}>Your friends get cashback worth Rs 100 when they use the Referral Coupon Code.</Text> */}

          <View>
            <Text style={{ textTransform: 'uppercase', fontFamily: 'sans-serif-light', fontSize: 12, paddingLeft: '5%' }}>Your code</Text>
            <View style={{ paddingHorizontal: '5%' }}>
              <View style={{ backgroundColor: '#EEEEEE', padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', }}>{this.props.referalCode.code}</Text>
                <Icon name="copy" type="ionicon" color="#000" size={20} onPress={() => this.copyToClipboard(this.props.referalCode.code)} style={{}} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingVertical: '3%' }}>
          <TouchableOpacity onPress={() => this.onShare()} style={{ backgroundColor: Colors.primary, padding: 12, alignSelf: 'center', width: '50%', borderRadius: 5 }}>
            <Text style={{ fontFamily: 'sans-serif-light', textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, color: '#fff', textAlign: 'center' }}>Invite Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)