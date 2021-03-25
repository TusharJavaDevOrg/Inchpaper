import Axios from 'axios';
import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import { View, Text, TextInput, StatusBar, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import { testPhoneNumber, uploadAddressUrl, emailRe } from '../../Config/Constants';
import CartHeaderComopnent2 from '../Components/CartHeaderComopnent2';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { Colors } from '../config/GlobalContants';
import { toast } from '../Functions/functions';
import { getPaymentMode, getuserAddresses } from '../Redux/Auth/ActionCreatore';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        addresses: state.addresses,
        googleAddress: state.googleAddress,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getuserAddresses: (customerId) => dispatch(getuserAddresses(customerId)),
    getGoogleAddress: (lat, lng, address) =>
        dispatch(getGoogleAddress(lat, lng, address)),
    getPaymentMode: () => dispatch(getPaymentMode()),
});
class CheckoutAddressScreen extends Component {
    state = {
        tagSelected: 'none',
        address: '',
        latitude: 0,
        longitude: 0,
        completeAddress: '',
        floor: '',
        landmark: '',
        addressGeoCodedData: '',
        wholeAddress: '',
        locationName: '',
        currentLocation: '',
        fullName: '',
        phoneNo: '',
        city: '',
        addressState: '',
        pincode: '',
        isDataLoading: true,
        firstName: '',
        lastName: '',
        emailId: '',
    };
    componentDidMount() {
        this.props.getPaymentMode();
    }
    postAddress = async () => {
        const { body, cartTotal } = this.props.route.params;

        if (this.state.firstName === '') {
            ToastAndroid.showWithGravity(
                'Please enter first name',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.lastName === '') {
            ToastAndroid.showWithGravity(
                'Please enter last name',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.emailId === '') {
            ToastAndroid.showWithGravity(
                'Please enter email address',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.completeAddress === '') {
            ToastAndroid.showWithGravity(
                'Please enter Complete Address',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.city === '') {
            ToastAndroid.showWithGravity(
                'Please enter city',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.pincode === '') {
            ToastAndroid.showWithGravity(
                'Please enter pincode',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.addressState === '') {
            ToastAndroid.showWithGravity(
                'Please enter state',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        if (this.state.floor === '') {
            ToastAndroid.showWithGravity(
                'Please enter Society name',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            return;
        }
        const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
            this.state.emailId !== '' &&
            emailRe.test(String(this.state.emailId).toLowerCase())
        ) {

        } else if (this.state.emailId !== '') {

            toast('Please enter a valid email.');
            return;
        }

        // const addressCompoennt = this.state.addressGeoCodedData.address_components;
        const addressToBePosted = {
            customerName: this.state.firstName + ' ' + this.state.lastName,
            emailId: this.state.emailId,
            addressLine1: this.state.floor,
            addressLine2: this.state.completeAddress,
            addressOf: this.state.tagSelected,

            addressState: this.state.addressState,
            emailId: this.state.emailId,
            city: this.state.city,

            country: 'India',

            customerId: this.props.login.userId,
            landmark: this.state.landmark,
            latitude: 0,
            longitude: 0,
            pincode: this.state.pincode,
        };

        console.log('address compo', addressToBePosted)
        // console.log(addressToBePosted);
        let data_res = JSON.stringify(addressToBePosted);

        try {
            await Axios.post(uploadAddressUrl, data_res, {
                headers: {
                    Authorization: 'Bearer ' + this.props.login.accessToken,
                    'Content-Type': 'application/json',
                },
            }).then((resp) => console.log('resssss', resp.data))
            // console.log('Post address response', response);

            var data = {
                currentSelectedAddress: this.props.addresses.selectedAddress,
                userId: this.props.login.userId,
            };
            this.props.getuserAddresses(this.props.login.userId);
            // this.props.getuserAddresses(this.props.login.userId);
            this.props.navigation.navigate('AddedScreenAddress', { body: body, cartTotal: cartTotal })
            ToastAndroid.showWithGravity(
                'Address Added',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
            // this.props.navigation.goBack();
            // console.log('response.data.accessToken', response.data.access_token);
        } catch (e) {
            // console.log('e', e);
            // this.props.loginFail();
            return;
        }

        // console.log(data_res);
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={<CartHeaderComopnent2 />}
                />

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {/* ===== progress bar ====== */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '35%', backgroundColor: Colors.primary, height: 2 }} />
                            <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                            <View style={{ width: '30%', backgroundColor: Colors.primary, height: 2 }} />
                            <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                        </View>

                        {/* ====== Address INput ===== */}
                        <KeyboardAvoidingView style={{ flex: 1 }}>
                            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                                <View style={{ padding: 8 }}>
                                    <View style={{ paddingVertical: 8 }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'sans-serif-light', fontWeight: 'bold', paddingLeft: 10, color: '#848583' }}>Add Shiping Address</Text>
                                    </View>

                                    <View style={{ backgroundColor: '#fff', padding: 10 }}>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ firstName: text })} value={this.state.firstName} placeholder="First Name" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ lastName: text })} value={this.state.lastName} placeholder="Last Name" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ emailId: text })} value={this.state.emailId} placeholder="Email Address" keyboardType="email-address" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput keyboardType="default" onChangeText={(text) => this.setState({ floor: text })} value={this.state.floor} placeholder="House / Apartment No. and Floor No." style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ completeAddress: text })} value={this.state.completeAddress} placeholder="Road / Sector Name" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ landmark: text })} value={this.state.landmark} placeholder="Landmark" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ city: text })} value={this.state.city} placeholder="City" style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ pincode: text.replace(testPhoneNumber, '') })} value={this.state.pincode.replace(testPhoneNumber, '')} placeholder="Pincode" keyboardType="phone-pad" maxLength={6} style={styles.inputStyle} />
                                        </View>
                                        <View style={styles.inputViewStyle}>
                                            <TextInput onChangeText={(text) => this.setState({ addressState: text })} value={this.state.addressState} placeholder="State" style={styles.inputStyle} />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.postAddress()} style={{ padding: 15, backgroundColor: Colors.primary }}>
                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'sans-serif-light', letterSpacing: 1 }}>Save and continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    inputStyle: {
        borderBottomColor: '#AAADA9',
        borderBottomWidth: 1,
        color: '#636363',
        fontSize: 15,
        height: 40,
    },
    inputViewStyle: {
        paddingVertical: 20
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(CheckoutAddressScreen);