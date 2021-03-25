import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
  Share, Clipboard, ScrollView
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from './IconHeaderComponenet';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { addedRefferalCode, getReferalCode } from '../Redux/Auth/ActionCreatore';
import { toast } from '../Functions/functions';
import { Colors } from '../config/GlobalContants';
import { TextInput } from 'react-native';
import { verifyRefferalCodeUrl } from '../../Config/Constants';
import axios from 'axios';
import { KeyboardAvoidingView } from 'react-native';

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
  addedRefferalCode: () => dispatch(addedRefferalCode()),
});

class EnterRefer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refralCode: '5DFT87977',
      code: '',
    }
  }
  async componentDidMount() {
    await this.props.getReferalCode(this.props.login.userId);
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Inviting you to inchpaper , a division of Stationary and Home Decor, Pioneers in Creating Classic Things. Download Now!!!  REFERRAL CODE: ' +
          this.props.referalCode.code,
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
  onSubmit = async () => {
    var url = verifyRefferalCodeUrl(
      this.state.code,
      this.props.login.userId,
    );
    // console.log('Verifying refferal code using this url', url);

    await axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
    })
      .then((resp) => {
        console.log('Here is the response for refferal code', resp.data);
        if (resp.data.status) {
          this.props.addedRefferalCode();
          toast(
            resp.data.message,

          );
        } else
          toast(
            resp.data.message,

          );
      })
      .catch((err) => {
        // console.log('Err in verifying refferal code', err.message);
      });
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
          centerComponent={{ text: 'Enter Code' }}
        />

        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={{ paddingVertical: '10%' }}>
              <LottieView source={require('../assets/refer.json')} autoPlay loop style={{ height: 200, width: '100%', alignSelf: 'center' }} />
            </View>
            <View style={{ alignItems: 'center', paddingVertical: '10%' }}>
              <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 20, color: '#000', width: '70%', textAlign: 'center' }}>Enter Code And Get Awesome Gifts.</Text>
              <Text style={{ fontFamily: 'sans-serif-light', fontSize: 14, width: '80%', textAlign: 'center', paddingVertical: '3%' }}>Download and Referral credits will be uitlised to give a 5% discount on your orders.</Text>
            </View>
            <View>
              <Text style={{ textTransform: 'uppercase', fontFamily: 'sans-serif-light', fontSize: 12, paddingLeft: '10%' }}>Enter Code</Text>
              <View style={{ paddingHorizontal: '10%' }}>
                <View style={{ backgroundColor: '#EEEEEE', alignItems: 'center', }}>

                  <TextInput placeholder="Enter Code" value={this.state.code} style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }} onChangeText={(text) => this.setState({ code: text })} />

                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={{}}>
          <TouchableOpacity onPress={() => this.state.code !== "" ? this.onSubmit() : toast('Please Enter Code')} style={{ backgroundColor: Colors.primary, padding: 12, alignSelf: 'center', width: '100%', borderRadius: 5 }}>
            <Text style={{ fontFamily: 'sans-serif-light', textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, color: '#fff', textAlign: 'center' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterRefer)