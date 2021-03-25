import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, StyleSheet, FlatList, Image } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { supplierId, updateWalletDataUrl } from '../../Config/Constants';
import { toast } from '../Functions/functions';
import Axios from 'axios';
import { getWalletData, getWalletTransactions } from '../Redux/Auth/ActionCreatore';
import { Colors } from '../config/GlobalContants';
import RazorpayCheckout from 'react-native-razorpay';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        walletData: state.walletData,
        paymentGateway: state.paymentGateway
    };
};

const mapDispatchToProps = (dispatch) => ({
    getWalletData: (customerId) => dispatch(getWalletData(customerId)),
    getWalletTransactions: (customerId) =>
        dispatch(getWalletTransactions(customerId)),
});
class RechargeWalletScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            addMoney: [
                { money: '500', value: '500' },
                { money: '1,000', value: '1000' },
                { money: '1,500', value: '1500' },
                { money: '2,000', value: '2000' },

            ],
            rzpKey: '',
            supplierName: ''
        }
    }
    async componentDidMount() {
        await this.setPayOnline();
        if (
            this.props.route.params &&
            this.props.route.params.walletRechargeAmount
        ) {
            var defaultAmount = this.props.route.params.walletRechargeAmount;
            this.setState({ amount: defaultAmount.toString() });
        }
    }
    setPayOnline = () => {
        console.log('pay gate', this.props.paymentGateway.mode)
        this.props.paymentGateway?.mode.map(async (it, ind) => {
            if (it.activeStatus == '1') {
                if (it?.paymentServiceEntity?.name === 'RazorPay') {
                    console.log('itttt', it.paymentServiceEntity.name, it.paymentConfigurations[0])
                    this.setState({ rzpKey: it.paymentConfigurations[0]?.secretKey, supplierName: it.supplier?.storeList[0]?.legalNameOfBusiness })
                    // payModeData.push({ type: it.paymentServiceEntity.name, config: it.paymentConfigurations, id: it.id, mode: it.paymentServiceEntity, supplier: it.supplier, rzpkey: rzkey })
                }
                // return payModeData;
            } else {
                this.setState({ rzpKey: '', supplierName: '' });
            }
        })
        // this.setState({ payData: payModeData })
    }

    updateWalletAmount = async (updateAmount) => {
        this.setState({ isLoading: true });
        var url = updateWalletDataUrl();
        console.log('Sending payment data to server, url', url);
        const authToken = this.props.login.accessToken;
        const userId = this.props.login.userId;
        var data = {
            accountingEntryType: 'CREDIT',
            customer: userId,
            userRequestAmount: updateAmount,
            supplier: supplierId,
        };
        console.log('Url and param', url, data);
        Axios.post(url, data, {
            headers: {
                Authorization: 'Bearer ' + authToken,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Recharge Wallet to the Server', response);
                this.setState({ isLoading: false });
                this.props.getWalletData(this.props.login.userId);
                this.props.getWalletTransactions(this.props.login.userId);
                this.props.navigation.goBack();
                toast('Wallet recharge complete');
                // this.props.navigation.goBack();
            })
            .catch((error) => {
                this.setState({ isLoading: false });
                console.log(error);
            });
    };

    addMoneyToWallet(amount) {
        console.log('In Razerpay on wallet recharge page');
        if (this.state.rzpKey !== "" && this.state.rzpKey.split('_')[0] == 'rzp') {
            amount = amount * 100;

            if (amount < 1) {
                Alert.alert('inchpaper Wallet\nEnter Recharge Amount');
            } else {
                var options = {
                    description: 'Payment For Wallet Recharge',
                    // image: require('Assets.appstore'),
                    currency: 'INR',
                    key: this.state.rzpKey,
                    amount: amount,
                    name: this.state.supplierName,
                    theme: { color: Colors.primary },
                };
                RazorpayCheckout.open(options)
                    .then((data) => {
                        toast(`Success: ${data.razorpay_payment_id}`);
                        var dd = '';
                        dd = amount / 100;
                        this.updateWalletAmount(dd);
                        this.props.getWalletData(this.props.login.userId);
                    })
                    .catch((error) => {
                        // handle failure
                        console.log('error in payment on wallet recharge page', error);
                        alert(`${error.error.description}`);
                    });
            }
        } else {
            toast('Provider has not added online payment key')
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF6F4' }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Recharge Wallet' }}
                />

                <View style={{ flex: 1, }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView style={{ flex: 1 }}>

                            <View>
                                <Image source={{ uri: 'https://ezulix.com/assets/img/service/services_banner/mobile_recharge_software.Webp' }} style={{ height: 150, resizeMode: 'center', width: '100%', backgroundColor: '#4A3B64' }} />
                            </View>
                            <View style={{ padding: 10, }}>
                                <View style={{ padding: 15, backgroundColor: '#fff', elevation: 5, borderRadius: 3 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }} >Wallet Recharge</Text>
                                    <View style={{ paddingVertical: 8, }}>
                                        <Text style={{ fontFamily: 'sans-serif-light', fontSize: 13, color: '#434343', fontWeight: 'bold' }}>Recharge once and avaol benefits whenever you want</Text>
                                    </View>
                                    <View style={{ paddingVertical: 8, }}>
                                        <Text style={{ fontFamily: 'sans-serif-light', fontSize: 13, color: '#434343', fontWeight: 'bold' }}>We will not save your Card No. or any payment details</Text>
                                    </View>
                                    <View style={{ paddingVertical: 8, }}>
                                        <Text style={{ fontFamily: 'sans-serif-light', fontSize: 13, color: '#434343', fontWeight: 'bold' }}>Thankyou for letting us serve you</Text>
                                    </View>
                                </View>

                                <View style={{ paddingVertical: '5%' }}>
                                    <TextInput placeholder="Enter Amount" value={this.state.amount} style={{ backgroundColor: '#fff', padding: 10, elevation: 5, fontWeight: 'bold' }} />
                                </View>

                                <View>
                                    <FlatList
                                        horizontal
                                        data={this.state.addMoney}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => this.setState({ amount: item.value })} style={{ padding: 10, }}>
                                                <View style={{ backgroundColor: '#fff', borderRadius: 3, padding: 5, borderColor: '#626262', borderWidth: 1 }}>
                                                    <Text style={{ textAlign: 'center', fontSize: 15, }}>
                                                        ₹ {item.money}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )} />
                                </View>

                                <View style={{ paddingVertical: '10%' }}>
                                    <TouchableOpacity onPress={() => this.addMoneyToWallet(this.state.amount)} style={{ padding: 15, backgroundColor: Colors.primary, borderRadius: 5 }}>
                                        <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, color: '#fff', textAlign: 'center' }}>Recharge</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeWalletScreen)