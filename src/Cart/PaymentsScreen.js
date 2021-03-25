import axios from 'axios';
import Axios from 'axios';
import AllInOneSDKManager from 'paytm_allinone_react-native';
import React, { Component } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from 'react-native-elements';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { cartPostUrl, paytmGWUrl, updateAbondendCheckoutUrl } from '../../Config/Constants';
import CartHeaderComopnent3 from '../Components/CartHeaderComopnent3';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { Colors } from '../config/GlobalContants';
import { toast } from '../Functions/functions';
import { deleteCouponResponse, getPaymentMode, getUserData, getUserOrders, getWalletData, getWalletTransactions } from '../Redux/Auth/ActionCreatore';
import { deleteAbandoneId, deleteAllItemsFromCart } from '../Redux/Cart/ActionCreators';
var Querystringified = require('querystringify');
const mapStateToProps = (state) => {
    return {
        defaultVariants: state.defaultVariants,
        cart: state.cart,
        couponeResp: state.couponeResp,
        login: state.login,
        user: state.user,
        nearestSupplier: state.nearestSupplier,
        addresses: state.addresses,
        walletData: state.walletData,
        supplier: state.supplier,
        paymentGateway: state.paymentGateway,
        abandonedCheckout: state.abandonedCheckout
    };
};


const mapDispatchToProps = (dispatch) => ({
    getUserData: (customerId) => dispatch(getUserData(customerId)),
    deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
    getWalletTransactions: (custId) => dispatch(getWalletTransactions(custId)),
    getWalletData: (custId) => dispatch(getWalletData(custId)),
    getUserOrders: (custId) => dispatch(getUserOrders(custId)),
    deleteCouponResponse: () => dispatch(deleteCouponResponse()),
    deleteAbandoneId: () => dispatch(deleteAbandoneId()),
    getPaymentMode: () => dispatch(getPaymentMode()),
});
class PaymentsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWalletOpen: false,
            isCardOpen: false,
            isBankOpen: false,
            isCodOpen: false,
            paymentMode: '',
            payData: [],
            uploadingOrderDataToServer: false,
            confermationModalVisible: false,
            paymentType: '',
            cardNumber: '',
            cardCvc: '',
            cardMonth: '',
            cardYear: '',
            isCardValid: undefined,
            rzpKey: '',
            supplierName: '',
            mid: '',
            key: '',
            paymentSecureImage: [require('../assets/visa.png'), require('../assets/master.png'), require('../assets/maestro.png'), require('../assets/Rupay.png')]
        };
    }

    async componentDidMount() {
        console.log('payment screent', this.props.paymentGateway)
        // await this.props.getPaymentMode();
        await this.setPayMode();
        await this.setPayOnline();
        this.props.getUserOrders(this.props.login.userId);

    }

    setPayMode = async () => {
        var payModeData = [];
        this.props.paymentGateway?.mode.map((it, ind) => {
            // console.log('ppppppp', it)
            if (it.activeStatus == '1') {
                payModeData.push({ type: it.paymentServiceEntity.name, config: it.paymentConfigurations, id: it.id, mode: it.paymentServiceEntity, supplier: it.supplier, config: it.paymentConfigurations })
            }
            return payModeData;
        })
        this.setState({ payData: payModeData })
    }
    setPayOnline = () => {

        this.props.paymentGateway?.mode.map(async (it, ind) => {
            if (it.activeStatus == '1') {
                if (it?.paymentServiceEntity?.name === 'RazorPay') {
                    console.log('itttt', it.paymentServiceEntity.name, it.paymentConfigurations[0])
                    this.setState({ rzpKey: it.paymentConfigurations[0]?.secretKey, supplierName: it.supplier?.storeList[0]?.legalNameOfBusiness })
                    // payModeData.push({ type: it.paymentServiceEntity.name, config: it.paymentConfigurations, id: it.id, mode: it.paymentServiceEntity, supplier: it.supplier, rzpkey: rzkey })
                }
                // return payModeData;
            } else {
                this.setState({ rzpKey: '' });
            }
            if (it.activeStatus == '1') {
                if (it?.paymentServiceEntity?.name === 'Paytm') {
                    console.log('itttt', it.paymentServiceEntity.name, it.paymentConfigurations[0])
                    this.setState({ mid: it.paymentConfigurations[0]?.secretKey, key: it.paymentConfigurations[0]?.apiKey, supplierName: it.supplier?.storeList[0]?.legalNameOfBusiness })
                    // payModeData.push({ type: it.paymentServiceEntity.name, config: it.paymentConfigurations, id: it.id, mode: it.paymentServiceEntity, supplier: it.supplier, rzpkey: rzkey })
                }
                // return payModeData;
            } else {
                this.setState({ rzpKey: '' });
            }
        })
        // this.setState({ payData: payModeData })
    }

    updateAbondendCheckout = (idType) => {
        var url = updateAbondendCheckoutUrl(this.props.abandonedCheckout.id, idType);
        console.log('updater checkout data', url)
        Axios.put(url, {
            header: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            }
        }).then(response => {
            if (idType === 22) {
                console.log('successfully checked out', response.data)
                this.props.deleteAbandoneId();
            }
            console.log('checkout failed', response.data)
            console.log('not checked out', response.data, 'abandonedId', this.props.abandonedCheckout.id)
        })
            .catch(error => {
                // errorToast('Error while loading abandoned data');
                console.log('Error in updating abandoned state data', error.message);
            });
    }
    startRawTransaction = async (total, body) => {
        this.setState({ uploadingOrderDataToServer: true })
        console.log('paytm karo')
        var orderId = "", chksmhsh = "", mid = "";


        var mid = this.state.mid,
            key = this.state.key,
            websiteName = "WEBSTAGING",
            callbackUrl = "",
            requestType = "Payment",
            paymentMode = "BALANCE";

        let data_res = Querystringified.stringify();
        var url = paytmGWUrl(mid, key, this.props.login.userId, this.props.user.phoneNumber, total, websiteName, callbackUrl, requestType, paymentMode);
        console.log("pay url", url)
        await axios.get(url).then((resp) => {
            console.log('pay resp', resp.data)
            if (resp.data?.body?.txn_details) {
                let data = resp.data?.body?.txn_details;
                mid = data.mid,
                    orderId = data.orderId;
                chksmhsh = resp.data?.body?.txnToken;
            }
        }).catch((err) => console.log('pay err', err));
        console.log('order id', orderId, total)
        AllInOneSDKManager.startTransaction(
            orderId,
            mid,
            chksmhsh,
            '100',
            "",
            false,
            true,
        )
            .then((result) => {

                console.log("result", JSON.stringify(result));
                this.setState({ uploadingOrderDataToServer: false })
                this.postDataToServer(
                    body,
                    total,
                    result.id,
                );
                // setShowToast(JSON.stringify(result));
                // setOrderIdUpdated(false);
            })
            .catch((err) => {
                // setResult(err);
                this.setState({ uploadingOrderDataToServer: false })
                console.log("Error: " + err);
                // setOrderIdUpdated(false);
            });
    }
    startRazorpay = (
        clubbedPayment,
        walletAmount,
        finalOrderAmount,
        dataToBePostedOnServer,
        key, suppName
    ) => {
        console.log('key', key, key.split('_')[0] == 'rzp', 'suppName', suppName)
        if (key !== "" && key.split('_')[0] == 'rzp') {
            if (clubbedPayment === 1) {
                var newAmount = finalOrderAmount - walletAmount;
                // newAmount = newAmount.toFixed(2)
                newAmount = Math.round(newAmount * 100) / 100;
                newAmount = newAmount * 100;
                var options = {
                    description: 'Payment For Order',
                    // image: 'https://i.ibb.co/444z8vLzxB/asdfa.jpg',
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
                        this.postDataToServer(
                            dataToBePostedOnServer,
                            walletAmount,
                            data.razorpay_payment_id,
                        );
                    })
                    .catch((error) => {
                        this.updateAbondendCheckout(20);
                        // handle failure
                        // console.log('error', error);
                        toast(`${error.error.description}`);
                    });
            } else {
                var newAmount = finalOrderAmount;
                newAmount = Math.round(newAmount * 100) / 100;
                newAmount = newAmount * 100;
                var options = {
                    description: 'Payment For Order',
                    // image: 'https://i.ibb.co/z8vLzxB/asdfa.jpg',
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
                        this.postDataToServer(
                            dataToBePostedOnServer,
                            0,

                            data.razorpay_payment_id,
                        );
                    })
                    .catch((error) => {
                        this.updateAbondendCheckout(20);
                        // handle failure
                        // console.log('error', error);
                        toast(`${error.error.description}`);
                    });
            }
        }
        else {
            toast('Provider has not added Online payment key for transaction')
        }
    };
    navigateToSuccess = async (
        payMode, total, payId
    ) => {
        console.log('payMode', payMode)
        const { body } = this.props.route.params;
        var updatedData = body;
        var paymentMode = 'Uknown';
        var paidAmount = 0;
        var unpaidAmount = 0;
        if (payMode === 'ONLINE') {
            paymentMode = 'ONLINE';
            paidAmount = total;
            unpaidAmount = 0;
        } else if (payMode === 'Cash') {
            paymentMode = 'COD';
            paidAmount = 0;
            unpaidAmount = total;
        } else if (payMode === 'Wallet') {
            paymentMode = 'Wallet';
            paidAmount = total;
            unpaidAmount = 0;
        } else if (payMode === 'Paytm') {
            paymentMode = 'Paytm';
            paidAmount = total;
            unpaidAmount = 0;
        }


        updatedData.paymentMode = paymentMode

        if (paymentMode === 'ONLINE') {
            this.startRazorpay(
                0, 0,
                parseInt(total),
                body,
                this.state.rzpKey,
                this.state.supplierName
            );
            // toast('Online Payment option not available');
            // this.startRazorpay(0, 0, cartTotal, body);
        } else if (paymentMode === "Paytm") {
            this.startRawTransaction(parseInt(total), body)
        }
        else if (paymentMode === 'COD') {
            Alert.alert(
                `Have you verified your order`,
                `Please verify your order before confirming.`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Place Order',
                        onPress: () => {
                            this.postDataToServer(body, total, null);
                        },
                    },
                    ,
                ],
                { cancelable: false },
            );
        } else if (paymentMode === 'Wallet') {
            this.handleWalletPayment(total, body, this.state.rzpKey);
        }
    };
    handleWalletPayment = (finalOrderAmount, dataToBePostedOnServer) => {
        const walletData = this.props.walletData.wallet;
        var walletAmount = walletData.walletAmount;
        if (walletAmount < finalOrderAmount) {
            Alert.alert('Low wallet balance');
            Alert.alert(
                `You do not have enough wallet balance!`,
                `Your wallet ballance is ${walletAmount}. Please recharge your wallet or pay through online payment.`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Recharge',
                        onPress: () => {
                            var walletRechargeAmount =
                                finalOrderAmount - walletAmount > 1
                                    ? finalOrderAmount - walletAmount
                                    : 1;
                            this.props.navigation.navigate('RechargeWallet', {
                                walletRechargeAmount: walletRechargeAmount,
                            });
                        },
                    },
                    {
                        text: 'Online',
                        onPress: () => {
                            this.startRazorpay(
                                1,
                                walletAmount,
                                finalOrderAmount,
                                dataToBePostedOnServer,
                                this.state.rzpKey,
                                this.state.supplierName
                            );
                        },
                    },
                    ,
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                `Have you verified your order`,
                `Please verify your order before confirming.`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Place Order',
                        onPress: () => {
                            this.postDataToServer(
                                dataToBePostedOnServer,
                                finalOrderAmount,
                                null,
                            );
                        },
                    },
                    ,
                ],
                { cancelable: false },
            );
        }
    };


    postDataToServer = async (body, cartTotal, transactionId) => {

        this.setState({ uploadingOrderDataToServer: true });
        body.transactionId = transactionId;
        console.log('Posting order body using ', body);

        const url = cartPostUrl();
        await Axios.post(url, body, {
            headers: {
                Authorization: 'Bearer ' + this.props.login.accessToken,
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                console.log('Here is final place response', resp, '00000000000000000', body);
                this.setState({ uploadingOrderDataToServer: false });
                toast(resp.data.message);
                this.props.getUserOrders(this.props.login.userId);
                // this.props.getWalletData(this.props.login.userId);
                // this.props.getWalletTransactions(this.props.login.userId);
                this.props.navigation.navigate('OrderConfirmed')
                // this.props.navigation.navigate('CheckoutSuccess', {
                //     orderData: body,
                //     promoDiscount: 0,
                //     cartTotal: cartTotal,
                //     serverResp: resp,
                // });
                this.props.deleteAllItemsFromCart();
            })
            .catch((err) => {
                console.log('errorrrrr', err);
                this.setState({ uploadingOrderDataToServer: false });
            });
    };
    // calculateDeliveryCharge = () => {
    //   if (distance > 0 && distance < 3) return 0;
    //   if (distance >= 3 && distance < 10) return 50;
    // };

    handlePlaceOrder = (payMode, total, payId) => {
        // console.log('cartt total', cartTotal);
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

            this.navigateToSuccess(
                payMode, total, payId
            );
        }

    };

    render() {
        const { body, cartTotal } = this.props.route.params;
        console.log('addresss', body?.addresses[0])
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={<CartHeaderComopnent3 />}
                />
                {this.state.uploadingOrderDataToServer ? (
                    <View
                        style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: 300,
                            zIndex: 1000,
                        }}>
                        <ActivityIndicator size={35} color={Colors.primary} />
                    </View>
                ) : null}

                {/* ===== progress bar ====== */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '35%', backgroundColor: Colors.primary, height: 2 }} />
                    <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                    <View style={{ width: '30%', backgroundColor: Colors.primary, height: 2 }} />
                    <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                    <View style={{ width: '35%', backgroundColor: Colors.primary, height: 2 }} />
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{}}>
                            <View style={{ backgroundColor: '#fff', padding: 10, elevation: 2, marginTop: 10, marginHorizontal: 5 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', fontFamily: 'sans-serif-light', textTransform: 'uppercase' }}>Delivery Address</Text>
                                    <Text onPress={() => this.props.navigation.navigate('AddedScreenAddress', { body: body, cartTotal: cartTotal })} style={{ fontSize: 12, color: Colors.primary, fontFamily: 'sans-serif-light', textTransform: 'uppercase', fontWeight: 'bold' }}>Change</Text>
                                </View>

                                <View style={{ paddingVertical: 5, }}>
                                    <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                        <Icon name="account" size={15} color={Colors.primary} style={{ paddingTop: 2 }} />
                                        <Text style={{ paddingLeft: 5, fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{body.addresses[0].customerName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 5 }}>
                                        <Icon name="email" size={15} color={Colors.primary} style={{ paddingTop: 2 }} />
                                        <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif', fontSize: 13 }}>{body?.addresses[0]?.emailId}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Icon name="map-marker" size={15} color={Colors.primary} style={{ paddingTop: 2 }} />
                                        <View style={{ paddingLeft: 5 }}>
                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{body.addresses[0].addressLine1}</Text>
                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{body.addresses[0].addressLine2}</Text>
                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{body.addresses[0].city}, {body.addresses[0].addressState}, {body.addresses[0].country} - {body.addresses[0].pincode}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </View>

                        <View style={{ backgroundColor: '#fff', marginTop: 10, elevation: 2, marginHorizontal: 5 }}>
                            <View style={{}}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 }} >
                                    <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 13, }}>{body.cartProductRequests.length} {body.cartProductRequests.length === 1 ? 'Item' : 'Items'}</Text>
                                    {/* <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: 13, }}>you pay ₹ {body.subTotal}</Text> */}
                                </View>
                                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>Item Total</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>₹ {body.subTotal}</Text>
                                </View>
                                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: Colors.success }}>Promo Discount</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: Colors.success }}>-₹ {body.promoWallet}</Text>
                                </View>
                                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>Coupon Discount</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>-₹ {body.couponDiscount}</Text>
                                </View>
                                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>Delivery Fees</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: '#7A7A7A' }}>+₹ {body.convenienceFee}</Text>
                                </View>
                                {body.giftWrap > 0 && <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: Colors.success }}>Gift Wrapping Fee</Text>
                                    <Text style={{ fontSize: 13, fontFamily: 'sans-serif-condensed', color: Colors.success }}>+₹ {body.giftWrap}</Text>
                                </View>}
                                <View style={{ paddingTop: 10, }}>
                                    <View style={{ height: 1, backgroundColor: '#CECECE', }} />
                                </View>
                                <View style={{ paddingVertical: 10, paddingBottom: 20, backgroundColor: '#defff9' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}>
                                        <Text style={{ fontSize: 14, textTransform: 'capitalize', fontWeight: 'bold' }}>Total Pay</Text>
                                        <View>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}>₹ {body.orderAmount}</Text>
                                            <Text style={{ fontSize: 11, color: '#7A7B7A' }}>(Incl. of all taxes)</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>


                        <View>
                            <Text style={{ fontSize: 10, color: '#585858', textTransform: 'uppercase', paddingVertical: 20, paddingLeft: 10, fontWeight: 'bold', fontFamily: 'sans-serif-light' }}>Choose payment Method</Text>
                            <FlatList data={this.state.payData} keyExtractor={index => String(index)}
                                ItemSeparatorComponent={() => <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />}
                                renderItem={({ item, index }) => {

                                    console.log('pay', item.mode.name === "Paytm" && JSON.stringify(item))
                                    return (
                                        <TouchableOpacity onPress={() => this.state.uploadingOrderDataToServer ? null : this.handlePlaceOrder(item.type === "RazorPay" ? "ONLINE" : item.type === "Stripe" ? "Stripe" : item.type, body.orderAmount, item?.config[0]?.secretKey)} >
                                            <View style={{ padding: 10, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {/* <SvgUri
                                                        width="50"
                                                        height="50"
                                                        source={{ uri: item?.mode?.logo_irl }}
                                                    /> */}
                                                    <Image source={{ uri: item?.mode?.logo_irl }} style={{ height: 50, width: 50 }} />
                                                    <View style={{ paddingTop: 8 }}>
                                                        <Text style={[styles.paymentOptionStyle, { paddingHorizontal: 10 }]}>{item?.mode?.name === 'Cash' ? 'Cash On Delivery' : item?.mode?.name === 'RazorPay' ? 'NetBanking & UPI' : item.mode.name === 'Stripe' ? 'Credit/Debit Card' : item.mode.name}</Text>
                                                        <Text style={[styles.paymentOptionStyle, { paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal', width: Dimensions.get('screen').width / 1.3 }]} numberOfLines={1} ellipsizeMode={'tail'}  >{item?.mode?.description}</Text>
                                                    </View>
                                                </View>

                                                <Icon name={'chevron-right'} style={{ alignSelf: 'center' }} size={30} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }} />
                            {/* <View style={{ backgroundColor: '#fff', padding: 5 }}>
                                
                                <View style={{ paddingVertical: 5 }}>
                                    <View style={{ backgroundColor: '#D1D1D1', height: 1, }} />
                                </View>
                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.paymentOptionStyle}>Credit Card</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderConfirmed')} style={{ backgroundColor: Colors.primary, width: 80, paddingVertical: 10, borderRadius: 10 }}>
                                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>Pay</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 5 }}>
                                    <View style={{ backgroundColor: '#D1D1D1', height: 1, }} />
                                </View>
                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.paymentOptionStyle}>Internet Banking</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderConfirmed')} style={{ backgroundColor: Colors.primary, width: 80, paddingVertical: 10, borderRadius: 10 }}>
                                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>Pay</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 5 }}>
                                    <View style={{ backgroundColor: '#D1D1D1', height: 1, }} />
                                </View>
                                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.paymentOptionStyle}>Wallet</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderConfirmed')} style={{ backgroundColor: Colors.primary, width: 80, paddingVertical: 10, borderRadius: 10 }}>
                                        <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>Pay</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 10 }}>
                                    <View style={{ backgroundColor: '#D1D1D1', height: 1, }} />
                                </View> */}

                            {/* </View> */}
                        </View>

                        <View style={{ backgroundColor: Colors.white, marginVertical: 10 }}>
                            <Text style={{ padding: 10, fontFamily: 'sans-serif-light', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, }}>100% Safe & secure shopping</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Image source={require('../assets/pci.png')} style={{ resizeMode: 'center', height: 100, width: 100 }} />
                                <Image source={require('../assets/comodo.png')} style={{ height: 100, width: 100, resizeMode: 'center' }} />
                            </View>
                            <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />
                            <FlatList horizontal data={this.state.paymentSecureImage} keyExtractor={index => String(index)}
                                renderItem={({ item, index }) => {
                                    return (<View>
                                        <Image source={item} style={{ resizeMode: 'center', height: 100, width: 100 }} />
                                    </View>)
                                }}
                            />

                        </View>

                    </View>

                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    paymentOptionStyle: {
        fontWeight: 'bold',
        fontSize: 13,
        fontFamily: 'Roboto',
        textAlignVertical: 'center'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(PaymentsScreen);