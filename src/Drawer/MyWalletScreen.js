import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StatusBar, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { getPaymentMode, getWalletData, getWalletTransactions, logOut } from '../Redux/Auth/ActionCreatore';
import { ActivityIndicator } from 'react-native';
import { getDate } from '../Functions/functions';
import { RefreshControl } from 'react-native';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        walletData: state.walletData,
        walletTransactions: state.walletTransactions,
    };
};

const mapDispatchToProps = (dispatch) => ({
    // getPromoWalletData: (customerId) => dispatch(getPromoWalletData(customerId)),
    getWalletData: (customerId) => dispatch(getWalletData(customerId)),
    logOut: () => dispatch(logOut()),
    getWalletTransactions: (customerId) =>
        dispatch(getWalletTransactions(customerId)),
    getPaymentMode: () => dispatch(getPaymentMode()),
});
const SCREEN_WIDTH = Dimensions.get('screen').width;
class MyWalletScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            walletTaranscitons: [
                { transId: '244', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                { transId: '200', transDate: '10-dec-2020', transStatus: 'Credit', transAmount: '1001' },
                { transId: '201', transDate: '20-may-2020', transStatus: 'Debit', transAmount: '4,0081' },
                { transId: '202', transDate: '20-jun-2020', transStatus: 'Debit', transAmount: '201' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
                // { transId: '55744', transDate: '20-dec-2020', transStatus: 'Debit', transAmount: '551' },
            ]
        }
    }
    componentDidMount() {
        this.props.getWalletData(this.props.login.userId);
        this.props.getWalletTransactions(this.props.login.userId);
        this.props.getPaymentMode();
    }
    onSingOut = async () => {
        await this.props.logOut();
        console.log('signout')
        this.props.navigation.navigate('Login')
    }
    render() {
        const totalNoOfTrans = this.props.walletTransactions.transactions.length;
        var threeMostRecentTransactions = [];
        if (totalNoOfTrans >= 3) {
            threeMostRecentTransactions = [
                this.props.walletTransactions.transactions[totalNoOfTrans - 1],
                this.props.walletTransactions.transactions[totalNoOfTrans - 2],
                this.props.walletTransactions.transactions[totalNoOfTrans - 3],
            ];
        } else if (totalNoOfTrans === 2) {
            threeMostRecentTransactions = [
                this.props.walletTransactions.transactions[totalNoOfTrans - 1],
                this.props.walletTransactions.transactions[totalNoOfTrans - 2],
            ];
        } else if (totalNoOfTrans === 1) {
            threeMostRecentTransactions = [
                this.props.walletTransactions.transactions[totalNoOfTrans - 1],
            ];
        }
        console.log('wallet dataa', this.props.walletData);
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'My Wallet' }}
                />
                {this.props.login.skippedLogin || !this.props.login.loginSuccess ? (
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ marginBottom: 20, marginTop: 70 }}>
                            <Image
                                style={{
                                    height: 200,
                                    width: 200,
                                    alignSelf: 'center',
                                }}
                                source={require('../assets/noLogin.png')}
                            />
                        </View>
                        <View style={{ marginVertical: 20 }}>
                            <Text
                                style={{
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                    color: '#a7a7a7',
                                    fontSize: 21,
                                }}>
                                You are not logged in
          </Text>
                        </View>
                        <View style={{ marginVertical: 20 }}>
                            <Text
                                style={{
                                    alignSelf: 'center',
                                    color: '#a7a7a7',
                                    fontSize: 15,
                                }}>
                                Please login to access your wallet.
          </Text>
                        </View>
                        <View style={{ marginVertical: 20, width: SCREEN_WIDTH }}>
                            <TouchableOpacity
                                onPress={() => this.onSingOut()}
                                style={{
                                    borderColor: Colors.primary,
                                    borderWidth: 1,
                                    padding: 10,
                                    marginHorizontal: 70,
                                }}>
                                <Text
                                    style={{
                                        color: Colors.primary,
                                        fontWeight: '700',
                                        alignSelf: 'center',
                                    }}>
                                    LOGIN / REGISTER
            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : <View style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }} refreshControl={
                            <RefreshControl
                                refreshing={this.props.walletData.isLoading}
                                onRefresh={() => {
                                    this.props.getWalletData(this.props.login.userId);
                                    this.props.getWalletTransactions(this.props.login.userId);
                                    // this.props.getPromoWalletData(this.props.login.userId);
                                }}
                                progressViewOffset={80}
                                progressBackgroundColor={Colors.primary}
                                colors={['#fff']}
                            />
                        } showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 20, paddingHorizontal: 10 }}>
                                    <Text style={{ fontFamily: 'sans-serif-light', fontSize: 14, fontWeight: 'bold', color: '#3C3C3C', textTransform: 'uppercase' }}>Total balance:</Text>
                                    <Text style={{ fontWeight: 'bold', fontFamily: 'sans-serif', color: Colors.primary, fontSize: 18, paddingLeft: 10 }}>₹ {!this.props.walletData.isLoading &&
                                        this.props.walletData.wallet ? (
                                            this.props.walletData.wallet.walletAmount
                                        ) : (
                                            <View style={{ height: 15, width: 15 }}>
                                                <ActivityIndicator size={15} color={Colors.primary} />
                                            </View>
                                        )}</Text>
                                </View>
                                <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RechargeWallet')} style={{ backgroundColor: Colors.primary, padding: 10, borderRadius: 5, width: '40%' }}>
                                        <Text style={{ fontWeight: 'bold', color: '#fff', fontFamily: 'sans-serif-light', textAlign: 'center', fontSize: 13 }}>Recharge wallet</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <View style={{ backgroundColor: '#fff', elevation: 2, padding: 10, width: '45%' }}>
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 13 }}>Order Refunds</Text>
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 15, fontWeight: 'bold' }}>₹ 0</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#fff', elevation: 2, padding: 10, width: '45%' }}>
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 13 }}>inchpaper Credits</Text>
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 15, fontWeight: 'bold' }}>₹ {!this.props.walletData.isLoading &&
                                            this.props.walletData.wallet ? (
                                                this.props.walletData.wallet.promoWalletAmount.toFixed(
                                                    0,
                                                )
                                            ) : (
                                                <View style={{ height: 15, width: 15 }}>
                                                    <ActivityIndicator size={15} color={Colors.primary} />
                                                </View>
                                            )}</Text>
                                    </View>
                                </View>

                                <View style={{ paddingVertical: '10%' }}>
                                    <View style={{ backgroundColor: '#fff', }}>
                                        <View style={{ paddingTop: 10 }}>
                                            <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', color: '#505050' }}>Recent transactions</Text>
                                        </View>
                                        <View style={{ paddingVertical: 20 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary, padding: 15 }}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }}>ID</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ color: '#fff', fontWeight: 'bold', paddingHorizontal: '20%', textTransform: 'uppercase' }}>Amount</Text>
                                                    <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }}>status</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <FlatList data={threeMostRecentTransactions}
                                                    ListEmptyComponent={() => <View>
                                                        <Text style={{
                                                            fontSize: 18,
                                                            fontFamily: 'SFUIText-Bold',
                                                            color: '#afafaf',
                                                            alignSelf: 'center',
                                                            marginVertical: 15,
                                                        }}> You have not made any transactions.</Text>
                                                    </View>}
                                                    keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => {
                                                        console.log('itemmm', item)
                                                        return (
                                                            <View>
                                                                <View style={{ paddingVertical: 15, borderBottomWidth: 1, borderColor: '#D0D0D0' }}>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
                                                                        <View style={{ paddingLeft: '2%' }}>
                                                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{getDate(item.createdDate)}</Text>
                                                                            <Text style={{ fontSize: 11, fontFamily: 'sans-serif-light' }}>Transaction ID: #{item.id}</Text>
                                                                        </View>
                                                                        <Text style={{ fontSize: 14 }}>{item.accountingEntryType === 'CREDIT'
                                                                            ? '+ '
                                                                            : '- '}{item.userRequestAmount}</Text>
                                                                        <Text style={{
                                                                            textTransform: 'uppercase', fontSize: 14, paddingRight: '5%', textAlign: 'center', color:
                                                                                item.accountingEntryType === 'CREDIT'
                                                                                    ? 'green'
                                                                                    : 'red',
                                                                        }}>{item.accountingEntryType === 'CREDIT'
                                                                            ? 'Credited'
                                                                            : 'Debited'}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )
                                                    }} />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                            </View>
                        </ScrollView>
                    </View>
                }
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyWalletScreen)