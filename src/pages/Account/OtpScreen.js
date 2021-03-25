import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, StatusBar, StyleSheet } from 'react-native';
import { Header, Icon, SocialIcon } from 'react-native-elements';
import { customerAddressesUrl, otpVerificationUrl, postFCMTokenUrl, supplierId, updateHashKeyOnServerUrl, validatePhoneNumberUrl } from '../../../Config/Constants';
import IconHeaderComponenet from '../../Components/IconHeaderComponenet';
import Axios from 'axios';
import RNOtpVerify from 'react-native-otp-verify';
import SmsRetriever from 'react-native-sms-retriever';
import { errorToast, warnToast } from '../../Functions/functions'
import { addressSelected, getuserAddresses, getUserData, getWalletData, loginFail, loginSuccess, skipLogin } from '../../Redux/Auth/ActionCreatore';
var Querystringified = require('querystringify');
import { connect } from 'react-redux'
import { Colors } from '../../config/GlobalContants';
import { Dimensions } from 'react-native';
import messaging from '@react-native-firebase/messaging';
class OtpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            firstCode: '',
            secondCode: '',
            thirdCode: '',
            fourthCode: '',
            fifthCode: '',
            sixthCode: '',
            code: '',
            resendOtp: 1,
            showlogin: true,
            down: true,
            time: 0
        }
    }
    async componentDidMount() {
        var mobile = this.props.route.params?.mobile;
        this.setState({
            mobile: mobile, firstCode: '',
            secondCode: '',
            thirdCode: '',
            fourthCode: '',
            fifthCode: '',
            sixthCode: '',
            code: '',
        });
        await this._onSmsListenerPressed();
        setInterval(() => {
            var t = this.state.time;
            this.setState({ time: t - 1 });
        }, 1000);
    }
    async validatePhoneNumber(phoneNumber) {
        this.setState({ validatingPhoneNumber: true, code: '' });
        console.log('Validating phone number', phoneNumber);
        var phoneno = /^\d{10}$/;

        if (phoneNumber.length < 10) {
            warnToast(
                'Please Enter a Valid Phone Number For OTP Verification.',

            );
        } else if (!phoneno.test(parseInt(phoneNumber))) {
            warnToast(
                'Please Enter a Valid Phone Number For OTP Verification.',

            );
        } else {
            var url = validatePhoneNumberUrl(supplierId, phoneNumber);
            console.log('login urlllll', url);
            await Axios.get(url)
                .then(async (resp) => {
                    console.log('Responce from server =====================', resp);
                    //   this.setState({ showModal: true, validatingPhoneNumber: false });
                    await this._onSmsListenerPressed();
                })
                .catch((err) => {
                    this.setState({ validatingPhoneNumber: false });
                    errorToast(err.message)
                    console.log('phone validation error =====================', err.message);
                });
        }
    }
    validateOTP = async (requestObject) => {
        console.log('otp from read::::', requestObject.otp, this.state.code);
        console.log('otp manual::::', this.state.code);
        console.log('requestObject in otp', requestObject);
        var otpCode = '';
        if (this.state.code != '') {
            otpCode = this.state.code;
        } else {
            if (!requestObject.otp) {
                warnToast(
                    'Please enter the OTP.',

                );
                return;
            } else if (requestObject.otp) {
                otpCode = requestObject.otp;
            }
        }
        var body = {
            username: requestObject.phoneNo + '/' + supplierId,
            password: otpCode,
            grant_type: 'password',
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
            .then((response) => {
                console.log('login response', response);
                console.log('response.data.accessToken', response.data.access_token);
                this.setState({ code: '' })
                var userObject = {
                    accessToken: response.data.access_token,
                    refreshToken: response.data.refresh_token,
                    userId: response.data.userId.toString(),
                    loginCount: response.data.loginCount.toString(),
                    hasSelectedAddress: false,
                };

                if (response.data.personName != null) {
                    userObject.userName = response.data.personName;
                } else {
                    userObject.userName = this.state.mobile;
                }
                this.props.loginSuccess(userObject);
                this.props.getWalletData(response.data.userId.toString(), supplierId);
                this.props.getUserData(response.data.userId.toString());
                this.props.getuserAddresses(response.data.userId.toString());
                this.getUserAddresses(response.data.userId.toString());
                this.getFCMToken(response.data.access_token, response.data.userId);
            })
            .catch((err) => {
                console.log('e', err.message);
                this.props.loginFail();
                // this.props.navigation.navigate('Home')
                warnToast(
                    'Login failed',

                );
            });
    };

    getFCMToken = async (accessToken, id) => {
        await messaging().registerDeviceForRemoteMessages();

        // Get the token
        const token = await messaging().getToken();

        this.postTokenToServer(token, accessToken, id)
    }
    postTokenToServer = async (tokenCode, accessToken, id) => {


        var url = postFCMTokenUrl(tokenCode, id);
        console.log('FCM URLTOK', url)
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
    getUserAddresses = async (userId) => {
        console.log('customer get user address funcc', userId);

        var url = customerAddressesUrl(userId);

        Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('Addresses data->', response.data.object);
                console.log(
                    'Here are user addresses length',
                    response.data.object.length,
                );
                /*  response.data.object.length > 0
                   ? this.props.navigation.navigate('Address', {
                     fromLogin: true,
                   })
                 //   :  */
                if (this.props.addresses.selectedAddress) {
                    this.props.navigation.push('Home')
                    this.props.addressSelected();
                } else {
                    this.props.navigation.push('Home', { fromWhere: 'Login' });
                }
                this.setState({ showModal: false, time: 0 });
            })
            .catch((error) => {
                console.log('Error in fetching addresses', error.message);
            });
    };

    updateHashKeyOnServer(hashCodeKey) {
        console.log('thi is the hash code', hashCodeKey);
        var url = updateHashKeyOnServerUrl();
        var body = {
            hashCodeKey: hashCodeKey,
            notificationSubType: 20,
            notificationType: 4,
            supplier: supplierId,
        };
        Axios.patch(url, body)
            .then((response) => {
                console.log('sucessfully sent has code', response);
            })
            .catch((error) => {
                console.log('Error in has code key', error.message);
            });
    }

    _onSmsListenerPressed = async () => {
        // console.log('Sms retriver started');
        RNOtpVerify.getHash()
            .then((p) => {
                console.log('App code is ', p);
                this.updateHashKeyOnServer(p[0]);
            })
            .catch((err) => {
                // console.log('Here is error in updating hash cide', err)
            });

        try {
            const registered = await SmsRetriever.startSmsRetriever();
            if (registered) {
                SmsRetriever.addSmsListener((event) => {
                    console.log('here is the retrived sms', event);
                    if (event.message == undefined) {
                    } else {
                        var msgArray = event.message.split(' ');
                        var otp = event.message.split(' ')[msgArray.length - 3];
                        this.validateOTP({ phoneNo: this.state.mobile, otp: otp });
                        var firstCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[0]
                            .toString();
                        var secondCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[1]
                            .toString();
                        var thirdCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[2]
                            .toString();
                        var fourthCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[3]
                            .toString();
                        var fifthCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[4]
                            .toString();
                        var sixthCode = event.message
                            .split(' ')
                        [msgArray.length - 3].toString()
                            .split('')[5]
                            .toString();

                        var newState = {
                            code: otp,
                            firstCode: firstCode,
                            secondCode: secondCode,
                            thirdCode: thirdCode,
                            fourthCode: fourthCode,
                            fifthCode: fifthCode,
                            sixthCode: sixthCode,
                        };
                        this.setState(newState);
                        SmsRetriever.removeSmsListener();
                    }
                });
            }
        } catch (error) {
            console.log('here is error in retriving sms', JSON.stringify(error));
        }
    };
    moveToSecond(text) {
        this.setState({ firstCode: text });
        this.refs.input2.focus();
    }
    moveToThird(text) {
        this.setState({ secondCode: text });
        this.refs.input3.focus();
    }
    moveToFourth(text) {
        this.setState({ thirdCode: text });
        this.refs.input4.focus();
    }
    moveToFifth(text) {
        this.setState({ fourthCode: text });
        this.refs.input5.focus();
    }
    moveToSixth(text) {
        this.setState({ fifthCode: text });
        this.refs.input6.focus();
    }
    moveToNext(text) {
        this.setState({ sixthCode: text });
        let one = this.state.firstCode.toString();
        let two = this.state.secondCode.toString();
        let three = this.state.thirdCode.toString();
        let four = this.state.fourthCode.toString();
        let five = this.state.fifthCode.toString();
        let six = text.toString();
        let code = +''.concat(one, two, three, four, five, six);
        this.setState({ code: code });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
                <StatusBar hidden={false} backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack(null)} iconName='close-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                />
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ paddingVertical: '20%' }}>
                            <View style={{ paddingVertical: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 30, textAlign: 'center', color: Colors.black }}>Welcome!</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: 13, paddingLeft: '3%', width: '98%', paddingVertical: 5, fontFamily: 'sans-serif', fontSize: 14 }}>You are just one step away from</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingLeft: '3%', color: Colors.primary, paddingTop: 15 }}>Awesome Offers</Text>
                                {/* <Text style={{ fontSize: 13, paddingLeft: '3%', textTransform: 'capitalize', width: '98%', paddingVertical: 5, fontFamily: 'sans-serif', fontSize: 14 }}>Get upto 80% Discount on your Favourite Stationery</Text> */}
                            </View>
                            <View style={{ paddingVertical: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 14, paddingLeft: '3%', fontFamily: 'Roboto', color: '#424242' }}>Waiting for OTP to verify your mobile number</Text>
                                <Text style={{ fontSize: 14, paddingLeft: '3%', fontFamily: 'Roboto', color: Colors.primary, fontWeight: 'bold' }}>{this.state.mobile}</Text>
                            </View>
                            <View style={{ paddingVertical: '15%' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <TextInput keyboardType="number-pad" onChangeText={(text) => {
                                        this.moveToSecond(text);
                                    }} maxLength={1} style={styles.textInputStyle} />

                                    <TextInput keyboardType="number-pad" ref="input2" onChangeText={(text) => {
                                        this.moveToThird(text);
                                    }} maxLength={1} style={styles.textInputStyle} />

                                    <TextInput keyboardType="number-pad" ref="input3" onChangeText={(text) => {
                                        this.moveToFourth(text);
                                    }} maxLength={1} style={styles.textInputStyle} />

                                    <TextInput keyboardType="number-pad" ref="input4" onChangeText={(text) => {
                                        this.moveToFifth(text);
                                    }} maxLength={1} style={styles.textInputStyle} />
                                    <TextInput keyboardType="number-pad" ref="input5" onChangeText={(text) => {
                                        this.moveToSixth(text);
                                    }} maxLength={1} style={styles.textInputStyle} />
                                    <TextInput keyboardType="number-pad" ref="input6" onChangeText={(text) => {
                                        this.moveToNext(text);
                                    }} maxLength={1} style={styles.textInputStyle} />

                                </View>
                            </View>
                            <View style={{ paddingHorizontal: '5%' }} >
                                <TouchableOpacity onPress={() => this.validateOTP({ phoneNo: this.state.mobile, otp: this.state.code })} style={{ backgroundColor: Colors.primary, padding: 10, width: Dimensions.get('screen').width / 2, alignSelf: 'center' }}>
                                    <Text style={{ color: '#fff', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 'bold', fontFamily: 'sans', textAlign: 'center', fontSize: 14 }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingVertical: '5%', flexDirection: "row", justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'sans-serif-light', fontSize: 12, color: '#424242', fontWeight: 'bold', textAlign: 'center' }}>Didn't Receive Your OTP?{' '}
                                    {/* <Text onPress={} style={{ color: Colors.primary, textDecorationLine: 'underline', fontWeight: 'bold' }}>Resend Code</Text> */}
                                </Text>
                                {this.state.time <= 0 ? (
                                    <TouchableOpacity>

                                        <Text
                                            // activeOpacity={this.state.time < 0 ? 0.5 : 1}
                                            onPress={() => {
                                                this.validatePhoneNumber(this.state.mobile)
                                                this.state.time < 1 ? this.setState({ time: 30 }) : null;
                                            }} style={{ bottom: 2, color: Colors.primary, textDecorationLine: 'underline', fontWeight: 'bold' }}>Resend Code</Text>

                                    </TouchableOpacity>
                                ) : (
                                        <Text
                                            style={{ bottom: 2 }}
                                        >
                                            {this.state.time} Seconds
                                        </Text>
                                    )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    textInputStyle: {
        height: 40,
        width: 40,
        padding: 5,
        borderColor: '#A5A6A5',
        borderBottomWidth: 1,
        borderRadius: 5,
        fontSize: 25,
        textAlign: 'center',
        color: Colors.primary,
        fontWeight: 'bold'
    },
})
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        addresses: state.addresses,
        supplier: state.supplier,
    };
};
var fromPage = '';
const mapDispatchToProps = (dispatch) => ({
    addressSelected: () => dispatch(addressSelected()),
    // skipLoginForNow: () => dispatch(skipLoginForNow()),
    // addStoreData: (id) => dispatch(addStoreData(id)),
    // toggleLogin: (bool) => dispatch(toggleLogin(bool)),
    loginSuccess: (userData) => dispatch(loginSuccess(userData)),
    loginFail: () => dispatch(loginFail()),
    skipLogin: () => dispatch(skipLogin()),
    getuserAddresses: (customerId) => dispatch(getuserAddresses(customerId)),
    getWalletData: (customerId, supplId) =>
        dispatch(getWalletData(customerId, supplId)),
    getUserData: (customerId) => dispatch(getUserData(customerId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen)