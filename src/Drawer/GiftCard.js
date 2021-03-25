import React, { Component } from "react";
import { View, Text, StyleSheet, Image, RefreshControl } from "react-native"
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
import { Colors } from "../config/GlobalContants";
import ElevatedView from "react-native-elevated-view";
import { TextInput } from "react-native";
import { bulkOrderUrl, getGiftCardDataUrl, giftCardUrl, supplierId, testPhoneNumber } from "../../Config/Constants";
import { TouchableOpacity } from "react-native";
import { toast, warnToast } from "../Functions/functions";
import { Platform } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { ActivityIndicator } from "react-native";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { getPaymentMode } from "../Redux/Auth/ActionCreatore";
import { connect } from "react-redux";
import { Dimensions } from "react-native";
const mapStateToProps = (state) => {
    return {
        login: state.login,
        user: state.user,
        paymentGateway: state.paymentGateway,

    };
};


const mapDispatchToProps = (dispatch) => ({
    getUserData: (customerId) => dispatch(getUserData(customerId)),
    getPaymentMode: () => dispatch(getPaymentMode()),
});
class GiftCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            email: '',
            city: '',
            isLoading: false,
            isLoadingState: true,
            show: true,
            amount: '',
            amountList: [{ amount: '500', value: '500' }, { amount: '1,000', value: '1000' }, { amount: '1,500', value: '1500' }, { amount: '2,000', value: '2000' }, { amount: '2,500', value: '2500' }],
            rzpKey: '',
            supplierName: '',
            giftCard: [],

            isGiftLoading: false,

        }
    }
    async componentDidMount() {

        await this.setPayOnline();
        this.getGiftCardData();

    }
    setPayOnline = () => {

        this.props.paymentGateway?.mode.map(async (it, ind) => {
            if (it.activeStatus == '1') {
                if (it?.paymentServiceEntity?.name === 'RazorPay') {
                    console.log('itttt', it.paymentServiceEntity.name, it.paymentConfigurations[0])
                    this.setState({ rzpKey: it.paymentConfigurations[0]?.secretKey, supplierName: it.supplier?.storeList[0]?.legalNameOfBusiness, isLoadingState: false })
                    // payModeData.push({ type: it.paymentServiceEntity.name, config: it.paymentConfigurations, id: it.id, mode: it.paymentServiceEntity, supplier: it.supplier, rzpkey: rzkey })
                }
                // return payModeData;
            } else {
                this.setState({ rzpKey: '', supplierName: '', isLoadingState: false });
            }
        })
        // this.setState({ payData: payModeData })
    }

    startRazorpay = (
        body,
        key, suppName
    ) => {
        console.log('key', key, key.split('_')[0] == 'rzp', 'suppName', suppName)
        if (key !== "" && key.split('_')[0] == 'rzp') {

            var newAmount = this.state.amount;
            // newAmount = newAmount.toFixed(2)
            newAmount = Math.round(newAmount * 100) / 100;
            newAmount = newAmount * 100;
            var options = {
                description: 'Payment For Gift Card',
                currency: 'INR',
                key: key,
                amount: newAmount,
                name: suppName,
                theme: { color: Colors.primary },
            };
            RazorpayCheckout.open(options)
                .then((data) => {
                    // handle success
                    // alert(`Success: ${data.razorpay_payment_id}`);
                    this.setState({ isLoading: false })
                    this.postDataToServer(
                        body,
                        data.razorpay_payment_id,
                    );
                })
                .catch((error) => {
                    // handle failure
                    this.setState({ isLoading: false })
                    // console.log('error', error);
                    toast(`${error.error.description}`);
                });

        }
        else {
            toast('Provider has not added Online payment key for transaction')
        }
    };
    randomStr = (len, arr) => {
        var ans = '';
        for (var i = len; i > 0; i--) {
            ans +=
                arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
    }
    onOrderPlace = async () => {
        const { name, number, email, amount } = this.state;
        var fName = "", lName = "";
        if (name == "") {
            warnToast('Please enter name');
        }
        else if (number == "") {
            warnToast('Please enter mobile number');
        }
        else if (email == "") {
            warnToast('Please enter email address');
        }
        else if (amount === "") {
            warnToast('Please enter amount');
        } else {
            const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (
                this.state.email !== '' &&
                emailRe.test(String(this.state.email).toLowerCase())
            ) {

            } else if (this.state.email !== '') {

                toast(
                    'Please enter a valid email.');
                return;
            }
            if (number.length < 10) {
                toast('Please enter a valid number')
            }

            this.setState({ isLoading: true })
            var customString = this.randomStr(20, '12345abcde')
            var body = {
                customerName: name,
                customerId: this.props.login.userId,
                name: customString + ' Inchpaper Pvt Ltd Gift Card',
                emailId: email,
                phoneNo: number,
                amount: this.state.amount,
                paymentMode: "Online",
                supplierId: supplierId,
                id: 0,
            }

            // var url = 'https://www.krenai.online/api/v3/account/countactUs/';
            this.startRazorpay(body, this.state.rzpKey, this.state.supplierName)
            // this.postDataToServer(body)
        }
    }
    postDataToServer = async (body) => {
        var url = giftCardUrl;
        console.log('body of bulk order', url, body)
        await axios.post(url, body, {
            header: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            }
        }).then((resp) => {
            console.log('resp of gift card order', resp.data)
            this.setState({ name: '', email: '', number: '', amount: '', isLoading: false })
            toast('Gift Card Generated Succesfully')

        }).catch((err) => {
            this.setState({ isLoading: false })
            console.log('err at gift card order', err)
        })
    }
    getGiftCardData = async () => {
        this.setState({ isGiftLoading: true })
        var url = getGiftCardDataUrl(this.props.login.userId);
        console.log('url of gift order', url,)
        await axios.get(url, {
            header: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            }
        }).then((resp) => {
            console.log('resp of gift card data', resp.data)
            this.setState({ giftCard: resp.data.object, isGiftLoading: false })

        }).catch((err) => {
            this.setState({ isGiftLoading: false })
            console.log('err at gift card order', err)
        })
    }
    setDisable = () => {
        const { amount, name, email, number } = this.state;
        if (amount == "" && name == "" && email == "" && number == "") { return true }
        else { return false }
    }
    render() {
        if (this.state.isLoadingState) {
            return (<View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} style={{ justifyContent: 'center', alignSelf: 'center' }} color={Colors.primary} />
            </View>)
        }
        {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Header backgroundColor="#fff"
                        leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                        centerComponent={{ text: 'Gift Cards', style: { right: 15 } }}
                        rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                    />
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                        <ScrollView refreshControl={
                            <RefreshControl
                                refreshing={this.state.isGiftLoading}
                                onRefresh={() => {
                                    this.getGiftCardData();
                                    // this.props.getPromoWalletData(this.props.login.userId);
                                }}
                                progressViewOffset={80}
                                progressBackgroundColor={Colors.primary}
                                colors={['#fff']} />
                        } keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }}>
                            <View style={{}}>
                                <ElevatedView elevation={3} style={{ margin: 10, borderRadius: 3 }}>
                                    <View style={{ padding: 10 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: Colors.primary }}>Gift Cards</Text>
                                        <Text style={{ fontSize: 14 }}>Gift cards from inchpaper - a thoughtful present.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, paddingVertical: 5 }}>
                                        <View style={{ width: '30%', paddingVertical: 5 }}>
                                            <Image source={require('../assets/document.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>PERSONALISED MESSAGING</Text>
                                        </View>
                                        <View style={{ width: '30%', }}>
                                            <Image source={require('../assets/calendar.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>NO EXPIRY DATE</Text>
                                        </View>
                                        <View style={{ width: '30%', }}>
                                            <Image source={require('../assets/gift-card.png')} style={{ height: 30, width: 30, alignSelf: 'center', borderColor: Colors.primary }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>DIGITAL CARDS</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                        <View style={{ width: '30%', }}>
                                            <Image source={require('../assets/money.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>STARTS AT ₹1000</Text>
                                        </View>
                                        <View style={{ width: '30%', }}>
                                            <Image source={require('../assets/card-type.png')} style={{ height: 30, width: 30, alignSelf: 'center' }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>UPLOAD CARD DESIGN</Text>
                                        </View>
                                        <View style={{ width: '30%', }}>
                                            <Image source={require('../assets/gift-email.png')} style={{ height: 30, width: 30, alignSelf: 'center', borderColor: Colors.primary }} />
                                            <Text style={{ fontSize: 12, textAlign: 'center', paddingTop: 10 }}>EMAIL CARD</Text>
                                        </View>
                                    </View>
                                </ElevatedView>
                                {!this.state.isGiftLoading && this.state.giftCard.length === 0 ? null : <ElevatedView elevation={0} style={{ margin: 10, borderRadius: 3 }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16, paddingVertical: 5 }}>Earlier Generated Gift Cards</Text>
                                    <View style={{ marginVertical: 10 }}>
                                        {this.state.isGiftLoading ?
                                            <FlatList horizontal data={this.state.giftCard} keyExtractor={index => String(index)}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View style={{ width: Dimensions.get('screen').width / 1.08, justifyContent: 'center', alignContent: "center", alignItems: 'center', backgroundColor: Colors.white, elevation: 2, borderRadius: 5 }}>
                                                            <View style={{ width: '25%' }}>
                                                                <Image style={{ height: 100, width: '95%', backgroundColor: Colors.placeholder }} />
                                                            </View>
                                                            <View style={{}}>
                                                                <Text style={{}} numberOfLines={2} ellipsizeMode={'tail'} >{item.name}</Text>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.placeholder }}>
                                                                    <Text ></Text>
                                                                    <Text></Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.placeholder }}>
                                                                    <Text></Text>
                                                                    <Text></Text>
                                                                </View>

                                                            </View>
                                                        </View>)
                                                }} />
                                            : <FlatList horizontal showsHorizontalScrollIndicator={false} data={this.state.giftCard} keyExtractor={index => String(index)}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View style={{ padding: 10, marginRight: 10, borderWidth: 0.5, borderColor: Colors.lightGray, width: Dimensions.get('screen').width / 1.1, justifyContent: 'center', alignContent: "center", alignItems: 'center', backgroundColor: Colors.white, elevation: 2, borderRadius: 5 }}>
                                                            <View style={{ marginVertical: 5 }}>
                                                                <Image source={item.imageUrl ? { uri: item.imageUrl } : require('../assets/giftCard.png')} style={{ height: 100, width: 135 }} />
                                                            </View>
                                                            <View style={{}}>
                                                                <Text style={{ fontWeight: "bold" }} numberOfLines={2} ellipsizeMode={'tail'} >{item.name}</Text>
                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 5 }}>
                                                                        <View style={{ flexDirection: "row" }}>
                                                                            <Icon name="account" size={20} color={Colors.gray} />
                                                                            <Text style={{ fontWeight: 'bold' }}>{item.customerName}</Text>
                                                                        </View>
                                                                        <View style={{ flexDirection: "row", paddingVertical: 5 }}>
                                                                            <Icon name="email" size={20} color={Colors.gray} />
                                                                            <Text style={{ fontWeight: 'bold', color: Colors.gray, fontSize: 12 }}>{item.emailId}</Text>
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 5 }}>
                                                                        <View style={{ flexDirection: "row" }}>
                                                                            <Icon name="currency-inr" size={20} color={Colors.gray} />

                                                                            <Text style={{ fontWeight: 'bold' }}>{item.amount}</Text>
                                                                        </View>
                                                                        <View style={{ flexDirection: "row", paddingVertical: 5 }}>
                                                                            <Icon name="cellphone" size={20} color={Colors.gray} />
                                                                            <Text style={{ fontWeight: 'bold', color: Colors.gray, fontSize: 12 }}>{item.phoneNo}</Text>
                                                                        </View>
                                                                    </View>

                                                                </View>

                                                            </View>
                                                        </View>)
                                                }} />}
                                    </View>
                                </ElevatedView>}
                                <ElevatedView elevation={3} style={{ margin: 10, backgroundColor: '#defff9', borderRadius: 3 }}>
                                    <View style={{ paddingHorizontal: 10, paddingBottom: 20, borderBottomColor: Colors.gray, borderBottomWidth: 0.8 }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }} onPress={() => this.setState({ show: !this.state.show })}>
                                            <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>
                                                How do I buy Inchpaper’s Gift Card?
                                    </Text>
                                            <MCIcon name={this.state.show ? 'chevron-down' : 'chevron-up'} size={20} color={Colors.primary} />
                                        </TouchableOpacity>
                                        {this.state.show && (
                                            <Text style={{ textAlign: 'justify', color: Colors.gray }}>

                                                Enter the name, email address and mobile number of the person you want to send the Inchpaper Gift Card to.{
                                                    '\n\n'
                                                }

                                            Select the value of the card you want to purchase, then click ‘Proceed To Pay’.{
                                                    '\n\n'
                                                }

                                            Complete the checkout process to receive an email with the Gift Card details.

                                            </Text>
                                        )}
                                    </View>
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                        <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', paddingVertical: 5, color: Colors.primary }}>please note</Text>

                                        <Text style={{ color: Colors.gray }}>{'\u2022'} The Gift Card cannot be cancelled, refunded or returned.</Text>
                                        <Text style={{ color: Colors.gray }}>{'\u2022'} Once purchased, the recipient email cannot be changed.</Text>
                                        <Text style={{ color: Colors.gray }}>{'\u2022'} Credit & Debit Cards issued outside India cannot be used to purchase inchpaper Gift Cards.</Text>
                                    </View>
                                </ElevatedView>
                                <ElevatedView elevation={1} style={{ margin: 10, borderRadius: 3 }}>
                                    <View style={{ borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: Colors.lightGray, }}>
                                        <Text style={{ padding: 10, textAlign: 'center', fontWeight: "400" }}>ENTER DETAILS</Text>
                                    </View>

                                    <View style={{ paddingVertical: 10 }}>
                                        <View style={{ borderBottomColor: Colors.lightGray, borderBottomWidth: 0.8, }}>
                                            <Text style={{ paddingVertical: 5, paddingLeft: 10, color: Colors.gray }}>Choose an amount *</Text>
                                            <View style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                                                <FlatList horizontal showsHorizontalScrollIndicator={false} keyExtractor={index => String(index)} renderItem={({ item, index }) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => this.setState({ amount: item.value })} style={[this.state.amount === item.value ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.white }, { borderRadius: 5, borderColor: Colors.primary, borderWidth: 1, padding: 10, marginRight: 20 }]}>
                                                            <Text style={[this.state.amount === item.value ? { color: Colors.white } : { color: Colors.primary }]}>₹ {item.amount}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                                    data={this.state.amountList}
                                                />


                                            </View>
                                            <View style={{ marginVertical: 8, marginHorizontal: 10 }}>
                                                <TextInput placeholder={'Enter other amount *'} keyboardType="number-pad" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ amount: text.replace(testPhoneNumber, '') })} value={this.state.amount.replace(testPhoneNumber, '')} style={styles.inputBox} />
                                            </View>

                                        </View>
                                        <Text style={{ paddingVertical: 10, paddingLeft: 10, color: Colors.gray }}>
                                            Recipient Details *
                            </Text>
                                        <View style={{ marginHorizontal: 10 }}>
                                            <TextInput placeholder={'Enter recipient name *'} placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ name: text })} value={this.state.name} style={[styles.inputBox, { textTransform: 'capitalize' }]} />
                                            <TextInput placeholder={"Enter friend's email address *"} keyboardType="email-address" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ email: text })} value={this.state.email} style={styles.inputBox} />
                                            <TextInput placeholder={'Enter recipient mobile number *'} maxLength={10} keyboardType="number-pad" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ number: text.replace(testPhoneNumber, '') })} value={this.state.number.replace(testPhoneNumber, '')} style={styles.inputBox} />
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                                        <TouchableOpacity onPress={() => this.onOrderPlace()} style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 3 }}>
                                            {this.state.isLoading ?
                                                <ActivityIndicator size="small" style={{ alignSelf: 'center' }} color={Colors.white} />
                                                : <Text style={[{ textTransform: 'capitalize', textAlign: 'center', fontWeight: 'bold', color: Colors.white }]}>
                                                    Buy Gift Card
                                </Text>}
                                        </TouchableOpacity>
                                    </View>
                                </ElevatedView>

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    inputBox: {

        padding: 10,
        marginBottom: 10,
        height: 50,
        borderWidth: 0.8,
        borderColor: Colors.lightGray
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(GiftCard)