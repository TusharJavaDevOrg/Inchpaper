import Axios from 'axios';
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { View, Text, ScrollView, Image, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { cancelOrderUrl, dunzoTrackStatus, fetchSupplierDetails, getDunzoAccessToken, supplierId } from '../../Config/Constants';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { Colors } from '../config/GlobalContants';
import { getDate, toast } from '../Functions/functions';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        favourites: state.favourites,
        defaultVariants: state.defaultVariants,
        login: state.login,
        visitedProfileOnes: state.visitedProfileOnes,
        addresses: state.addresses,
        nearestSupplier: state.nearestSupplier,
        abandonedCheckout: state.abandonedCheckout,
        user: state.user,
    };
};
class OrederDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancellationReason: '',
            isCancelLoading: false,
            isStatusLoading: false,
            isSupplierLoading: false,
            // statusData: response.data,
            latitude: 0,
            longitude: 0,
            trackState: false,
            client: null,
            token: null,
            task: null,
            address: '',
            order: null,
        }
        // this.getSupplierDetails();
    }
    async componentDidMount() {
        var url = fetchSupplierDetails();
        console.log('supplid', url)
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('supplier data->', response.data.object);
                this.setState({
                    isSupplierLoading: false,
                    // bannersData: response.data.object,

                });
                this.getAccessToken(response.data.object[0]?.clientId, response.data.object[0]?.clientSecret);
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isSupplierLoading: false });
                }
                console.log('Error supplier', error);
            });
    }
    getSupplierDetails = async () => {
        console.log('supplier data url',)
        var url = fetchSupplierDetails();


        this.setState({ isSupplierLoading: true });
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('supplier data->', response.data.object[0]);
                this.setState({
                    isSupplierLoading: false,
                    // bannersData: response.data.object,

                });
                this.getAccessToken(response.data.object[0].clientId, response.data.object[0].clientSecret);
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isSupplierLoading: false });
                }
                console.log('Error supplier', error);
            });
    };
    getAccessToken = async (clientId, clientSecret) => {
        var url = getDunzoAccessToken();


        this.setState({ isTokenLoading: true });

        await Axios.get(url, {
            headers: {

                'client-id': clientId,
                'client-secret': clientSecret,
                'Accept-Language': 'en-US',
                'Content-type': 'application/json',

            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('token data->', response.data.token);

                this.setState({
                    isTokenLoading: false,
                    client_id: clientId,
                    tokenData: response.data.token,

                });

                // this.getTrackingStatus(clientId,response.data.token)
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isTokenLoading: false });
                }
                console.log('Error token', error);
            });
    };

    getSupplierDetails = async () => {
        var url = fetchSupplierDetails();


        this.setState({ isSupplierLoading: true });

        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                // console.log('supplier data->', response.data.object[0]);
                // response.data.object.map((item, ind) => {
                //   this.state.supplierData.push(item)
                // })
                this.setState({
                    isSupplierLoading: false,
                    // bannersData: response.data.object,

                });
                this.getAccessToken(response.data.object[0].clientId, response.data.object[0].clientSecret);
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isSupplierLoading: false });
                }
                console.log('Error supplier', error);
            });
    };
    getAccessToken = async (clientId, clientSecret) => {
        var url = getDunzoAccessToken();


        this.setState({ isTokenLoading: true });

        await Axios.get(url, {
            headers: {

                'client-id': clientId,
                'client-secret': clientSecret,
                'Accept-Language': 'en-US',
                'Content-type': 'application/json',

            },
            timeout: 15000,
        })
            .then((response) => {
                // console.log('token data->', response.data.token);

                this.setState({
                    isTokenLoading: false,
                    client_id: clientId,
                    tokenData: response.data.token,

                });

                // this.getTrackingStatus(clientId,response.data.token)
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isTokenLoading: false });
                }
                console.log('Error token', error);
            });
    };

    getTrackingStatus = async (clientId, token, taskId, order) => {


        var url = dunzoTrackStatus(taskId);


        this.setState({ isStatusLoading: true });

        await Axios.get(url, {
            headers: {

                'client-id': clientId,
                'Authorization': token,
                'Accept-Language': 'en-US',
                'Content-type': 'application/json',

            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('status data->', response.data.state);
                this.setState({ trackState: response.data.state })


                if (response.data.state == 'runner_accepted' ||
                    response.data.state == 'reached_for_pickup' ||
                    response.data.state == 'started_for_delivery') {

                    this.setState({
                        isStatusLoading: false,
                        // statusData: response.data,
                        latitude: response.data.runner.location.lat,
                        longitude: response.data.runner.location.lng,
                        trackState: response.data.state
                    });

                    this.props.navigation.navigate('Tracking', {
                        client: this.state.client_id,
                        token: this.state.tokenData, task: taskId,
                        address: this.props.addresses, order: order
                    })
                    // console.log("ADDR4",this.props.addresses)

                }
                else {
                    warnToast("Delivery agent  not assigned")
                }
            })
            .catch((error) => {
                if (!error.status) {
                    this.setState({ isStatusLoading: false });
                }
                console.log('Error status', error);
            });
    };
    cancelThisOrder(item, toWallet1) {
        // const {orderData} = this.props.route.params;
        this.setState({ isCancelLoading: true })
        console.log(
            'Inside cancelling order here ====================================================',
            item.paymentMode,
            toWallet1,
        );
        var url = cancelOrderUrl();
        const authToken = this.props.login.accessToken;
        var toWallet = 0;
        if (item.paymentMode == 'wallet') {
            toWallet = 1;
        } else if (item.paymentMode == 'ONLINE') {
            toWallet = toWallet1;
        } else {
            toWallet = 0;
        }

        var params = {
            params: {
                cartId: item.id,
                state: 'Cancelled',
                toWallet: toWallet,
                message: '',
                cancellationReason:
                    this.state.cancellationReason.length > 0
                        ? this.state.cancellationReason
                        : 'Cancelled from app - No reason',
            },
            headers: {
                Authorization: 'bearer ' + authToken,
            },
        };
        console.log('cancel order paramsssssssss', params);
        Axios.patch(url, item, params)
            .then((response) => {
                console.log('response', response.data);
                if (response.data.message == 'Successfully Updated') {
                    Alert.alert('inchpaper', 'Order Cancelled Sucessfully');
                }
                this.props.navigation.goBack(null);
                this.setState({ isCancelLoading: false })
                this.props.getUserOrders(this.props.login.userId, supplierId);
                this.props.getWalletData(this.props.login.userId, supplierId);
                this.props.getWalletTransactions(this.props.login.userId);
            })
            .catch((error) => {
                console.log('Error while cancelling one order', error.response);
            });
    }
    render() {
        const { data } = this.props.route.params;
        // console.log('order deal', data.state.description)
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Order Details' }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ padding: 10 }}>
                            <Text style={{ color: '#1F1E1E', fontSize: 13, fontWeight: 'bold', fontFamily: 'sans-serif', }}>{data?.state?.description}</Text>
                        </View>
                        <View style={{ padding: 8, flex: 1 }}>
                            <View style={{ backgroundColor: '#fff', elevation: 2, padding: 10, flex: 1 }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize', flex: 0.3 }}>Order No</Text>
                                    <Text style={{ fontSize: 13, textTransform: 'capitalize', flex: 0.8 }}>{data.id}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize', flex: 0.3 }}>Order Date</Text>
                                    <Text style={{ fontSize: 13, textTransform: 'capitalize', flex: 0.8 }}>{getDate(data.createdDate)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 13, textTransform: 'capitalize', flex: 0.3 }}>Order Total</Text>
                                    <Text style={{ fontSize: 13, textTransform: 'capitalize', flex: 0.8 }}>₹ {data.orderAmount}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ padding: 8 }}>
                            <View style={{ backgroundColor: '#fff', elevation: 2 }}>
                                <FlatList data={data.cartProductRequests} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                                    <View style={{ padding: 10, }}>
                                        <View style={{ paddingVertical: 15 }}>
                                            <Text style={{ textTransform: 'uppercase', fontSize: 11, fontFamily: 'sans-serif-light', fontWeight: 'bold', color: '#787878' }}>{item.orderStauts}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Image source={{ uri: item?.medias[0]?.mediaUrl }} style={{ height: 100, width: 90 }} />
                                            </View>
                                            <View style={{ paddingLeft: 10, width: '70%', }}>
                                                <Text style={{ fontSize: 12, color: '#9C9A9A', fontFamily: 'sans-serif-light', fontWeight: 'bold', }} >SKU ID: {item.productListing.skuCode}</Text>
                                                <Text numberOfLines={3} ellipsizeMode="tail" style={{ width: '90%', fontSize: 12, color: '#595656', fontFamily: 'sans-serif-light', fontWeight: 'bold', paddingVertical: 5 }} >{item?.productListing?.product?.name}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
                                                    <Text style={{ fontSize: 13, color: '#414141', fontFamily: 'sans-serif-light', fontWeight: 'bold', }} >Qty {item.quantity}</Text>
                                                    <Text style={{ fontSize: 13, color: '#414141', fontFamily: 'sans-serif-light', fontWeight: 'bold', paddingRight: 10 }} >₹ {item.productListing.sellingPrice}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )} />
                                <View style={{ paddingVertical: 10 }}>
                                    <View style={{ backgroundColor: '#EAEAEA', height: 1 }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15 }}>
                                        <TouchableOpacity onPress={() => {
                                            // this.props.navigation.navigate('Tracking', {
                                            //     client: 1,
                                            //     token: 1513, task: 3,
                                            //     address: data.addresses[0], order: data
                                            // })
                                            data?.cartlogs[0]?.taskId == null ?
                                                toast("Delivery agent not assigned") :

                                                this.getTrackingStatus(this.state.client_id,
                                                    this.state.tokenData,
                                                    data?.cartlogs[0]?.taskId, data)


                                        }}>
                                            <Icon name="location-outline" color={Colors.primary} type="ionicon" size={25} />
                                            <Text style={{ fontFamily: 'sans-serif-light', color: Colors.primary, fontSize: 14 }}>Track</Text>
                                        </TouchableOpacity>
                                        {data.state.id === 6 ? <TouchableOpacity onPress={() => this.props.navigation.navigate('RefundProcedure', { orderData: data })}>
                                            <Icon name="return-up-back-outline" color={Colors.primary} type="ionicon" size={25} />
                                            <Text style={{ fontFamily: 'sans-serif-light', color: Colors.primary, fontSize: 14 }}>Return</Text>
                                        </TouchableOpacity> :
                                            <View>
                                                <Icon name="return-up-back-outline" color='#c1c1c1' type="ionicon" size={25} />
                                                <Text style={{ fontFamily: 'sans-serif-light', color: '#c1c1c1', fontSize: 14 }}>Return</Text>
                                            </View>
                                        }
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('WriteReview', { id: data.id, data: data.cartProductRequests })}>
                                            <Icon name="star-outline" color={Colors.primary} type="ionicon" size={25} />
                                            <Text style={{ fontFamily: 'sans-serif-light', color: Colors.primary, fontSize: 14 }}>Feedback</Text>
                                        </TouchableOpacity>
                                        {data.state.id >= 4 ? null : <TouchableOpacity onPress={() => {
                                            if (data.paymentMode == 'ONLINE') {
                                                Alert.alert(
                                                    'Urban Grocery',
                                                    'Send order amount to wallet',
                                                    [
                                                        {
                                                            text: 'No',
                                                            onPress: () => {
                                                                this.cancelThisOrder(data, 0);
                                                                this.props.navigation.goBack();
                                                                this.setState({
                                                                    orderCancellationModalVisible: false,
                                                                });
                                                            },
                                                            style: 'cancel',
                                                        },
                                                        {
                                                            text: 'Yes',
                                                            onPress: () => {
                                                                this.cancelThisOrder(data, 1);
                                                                this.props.navigation.goBack();
                                                                this.setState({
                                                                    orderCancellationModalVisible: false,
                                                                });
                                                            },
                                                        },
                                                    ],
                                                    { cancelable: false },
                                                );
                                            } else {
                                                this.cancelThisOrder(data);
                                                // this.props.navigation.goBack();
                                                this.setState({
                                                    orderCancellationModalVisible: false,
                                                });
                                            }
                                        }}>
                                            {!this.state.isCancelLoading ? <Icon name="close" color={Colors.primary} type="ionicon" size={25} /> : <ActivityIndicator size="small" color={Colors.primary} />}
                                            <Text style={{ fontFamily: 'sans-serif-light', color: Colors.primary, fontSize: 14 }}>Cancel</Text>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            </View>
                        </View>
                        {data.refundStatus == 'approved' ?
                            <View style={{ margin: 8, backgroundColor: '#fff', padding: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: '#333',

                                        // borderTopWidth: 1,
                                        // borderTopColor: '#efefef',
                                        paddingTop: 12,
                                        fontWeight: '700',
                                    }}>
                                    Refund Pickup Timing
              </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#a7a7a7',

                                        paddingVertical: 7,
                                        // borderTopColor: '#efefef',
                                        paddingTop: 2,
                                    }}
                                    numberOfLines={2}>

                                    {data.refundTime}

                                </Text></View> : null}
                        {data.refundedProducts.length > 0 && <View style={{ margin: 8, padding: 8, marginTop: 5, backgroundColor: '#fff' }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    // borderBottomWidth: 1,
                                    // borderBottomColor: '#efefef',
                                    // marginBottom: 10,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: 'black',
                                        // marginVertical: 10,
                                        fontWeight: 'bold',
                                    }}>
                                    Your Refund Order
                </Text>
                            </View>

                            <FlatList data={data.refundedProducts} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                                return (
                                    <View style={{ padding: 10, }}>
                                        <View style={{ paddingVertical: 10 }}>
                                            <Text style={{ textTransform: 'uppercase', fontSize: 11, fontFamily: 'sans-serif-light', fontWeight: 'bold', color: '#787878' }}>{item.orderStauts}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Image source={{ uri: item?.productImage }} style={{ height: 100, width: 90 }} />
                                            </View>
                                            <View style={{ paddingLeft: 10, width: '70%', }}>
                                                <Text style={{ fontSize: 12, color: '#9C9A9A', fontFamily: 'sans-serif-light', fontWeight: 'bold', }} >SKU ID: {item.skuCode}</Text>
                                                <Text numberOfLines={3} ellipsizeMode="tail" style={{ width: '90%', fontSize: 12, color: '#595656', fontFamily: 'sans-serif-light', fontWeight: 'bold', paddingVertical: 5 }} >{item?.productName}</Text>
                                                <Text style={{ fontSize: 13, color: '#414141', fontFamily: 'sans-serif-light', fontWeight: 'bold', }} >Status {item.refundStatus}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 }}>
                                                    <Text style={{ fontSize: 13, color: '#414141', fontFamily: 'sans-serif-light', fontWeight: 'bold', }} >Qty {item.quantity}</Text>
                                                    <Text style={{ fontSize: 13, color: '#414141', fontFamily: 'sans-serif-light', fontWeight: 'bold', paddingRight: 10 }} >₹ {item.sellingPrice}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }} />
                        </View>}
                        <View style={{ padding: 8 }}>
                            <View style={{ backgroundColor: '#fff', elevation: 2, padding: 10 }}>
                                <Text style={{ fontFamily: 'sans-serif-light', color: '#373737', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>shipping address</Text>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontSize: 12, fontFamily: 'sans-serif-light', color: '#797979' }}>{data.addresses[0].customerName}</Text>
                                    <Text style={{ fontSize: 12, fontFamily: 'sans-serif-light', color: '#797979' }}>{data.addresses[0].addressLine1 + ', ' + data.addresses[0].addressLine2 + ', ' + data.addresses[0].city + ', ' + data.addresses[0].addressState + ', ' + data.addresses[0].country + ' - ' + data.addresses[0].pincode}</Text>
                                    <Text style={{ fontSize: 12, fontFamily: 'sans-serif-light', color: '#797979' }}>{data.addresses[0].contactNo}</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>
        )
    }
}
export default connect(mapStateToProps)(OrederDetailScreen);