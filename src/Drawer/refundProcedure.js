import Axios from 'axios';
import React from 'react';
import {
    ActivityIndicator, Dimensions, SafeAreaView,
    ScrollView,
    StatusBar, Text,
    ToastAndroid, TouchableOpacity, View
} from 'react-native';
import { Header } from 'react-native-elements';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { refundGenerateUrl } from '../../Config/Constants';
import { getUserOrders, getWalletData, getWalletTransactions } from '../Redux/Auth/ActionCreatore';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { Colors } from '../config/GlobalContants';

const mapStateToProps = state => {
    return {
        user: state.user,
        nearestSupplier: state.nearestSupplier,
        addresses: state.addresses,
        login: state.login,
        supplier: state.supplier,
    };
};

const mapDispatchToProps = dispatch => ({
    getUserOrders: (customerId, supplId) =>
        dispatch(getUserOrders(customerId, supplId)),
    getWalletData: (customerId, supplId) =>
        dispatch(getWalletData(customerId, supplId)),
    getWalletTransactions: customerId =>
        dispatch(getWalletTransactions(customerId)),
});

class RefundProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderCancellationModalVisible: false,
            cancellationReason: '',
            orderData: [],
            refundModal: false,
            refundReason: '',
            refundProducts: [],
            quant: [],
            isLoading: false,

        };
    }
    async componentDidMount() {
        const { orderData } = this.props.route.params;
        // console.log('OrderData from order summery screen', orderData);
        await this.setQuantity(orderData);
        // await this.getOrderDetail(cartId);
    }
    setQuantity = async (orderData) => {
        var quantArray = [];
        orderData.cartProductRequests.map((item, index) => {
            quantArray.push({
                'productListingId': item.productListingId,
                'quantity': 0,
                'cartId': orderData.id,
                'productId': item.productListing?.product?.id,
                'skuCode': item.productListing?.skuCode,
                'productName': item.productListing?.product?.name,
                'productImage': item?.medias[0]?.mediaUrl,
                'brandName': item.productListing?.product?.brand?.name,
                'sellingPrice': item.productListing?.sellingPrice,
            });

        });
        this.setState({ quant: quantArray }, () => console.log('quant final', this.state.quant))

    }
    placeRefundOrder = async (id) => {
        // console.log('final order ', this.state.quant)

        this.setState({ isLoading: true })
        var refundArray = [];
        this.state.quant.map((item, index) => {
            // console.log('final', item)
            if (item.quantity > 0) {
                refundArray.push(item);
            } else {
                return null;
            }
            return refundArray;
        })
        // console.log('refund array', refundArray)
        var url = refundGenerateUrl();
        var body = { refundedProducts: refundArray }
        // let data_res = Querystringified.stringify(body);
        console.log('data_res', body)
        await Axios.post(url, body, {
            headers: {
                Authorization: 'bearer ' + this.props.login.accessToken,
                'Content-type': 'application/json',
            },
        }).then((response) => {

            console.log('refund response', response.data)
            if (response.data) {
                this.setState({ isLoading: false })
                ToastAndroid.showWithGravity('Refund Order Placed Successfully', ToastAndroid.SHORT, ToastAndroid.CENTER);
                // this.props.navigation.goBack(null);
                this.props.navigation.navigate('Order', {
                    // cartId: id, refresh: true
                })
            }
        }).catch((err) => { this.setState({ isLoading: false }); console.log('refund error', err); ToastAndroid.showWithGravity(err.message, ToastAndroid.SHORT, ToastAndroid.CENTER); })
    }
    addQuantity = async (index) => {
        var quanar = [...this.state.quant];
        quanar[index].quantity = quanar[index].quantity + 1
        this.setState({ quant: quanar });

    }
    removeQuantity = async (index) => {
        var quanar = [...this.state.quant];
        quanar[index].quantity = quanar[index].quantity - 1
        this.setState({ quant: quanar });
    }


    // findCartTotal = productsArray => {
    //     let total = 0;
    //     productsArray.map((it, ind) => {
    //         total += it.sellingPrice * it.quantity;
    //     });
    //     return total;
    // };




    render() {
        const { orderData } = this.props.route.params;
        const { quant } = this.state;

        console.log('order dataaaa at refund', JSON.stringify(orderData.id))
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                        leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                        centerComponent={{ text: 'Order Details' }}
                    />

                    <ScrollView
                        style={{ paddingHorizontal: 15, paddingTop: 10 }}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: '#333',
                                    // borderTopWidth: 1,
                                    // borderTopColor: '#efefef',
                                    // paddingTop: 12,
                                    fontWeight: '700',
                                }}>
                                Invoice Id
              </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#a7a7a7',
                                    paddingTop: 2,
                                }}
                                numberOfLines={2}>
                                {orderData.invoiceId || orderData.invoiceId > 0
                                    ? orderData.invoiceId
                                    : 'NOT AVAILABLE'}
                            </Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#efefef',
                                    marginBottom: 10,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: 'black',
                                        marginVertical: 10,
                                        fontWeight: 'bold',
                                    }}>
                                    Your Order
                </Text>
                            </View>

                            {orderData.cartProductRequests.map((item, index) => {
                                // console.log('quannnnn', item)
                                return (
                                    <View
                                        key={index}
                                        style={{ flex: 1, height: '50%' }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: 'black',
                                            }}>
                                            {item.productListing.product.name + ','}
                                            {/* <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: '700',
                                                    color: 'black',
                                                }}>
                                                {' Brand: ' + item.productListing.product.brand.name}
                                            </Text> */}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#efefef',
                                                marginBottom: 10,
                                                justifyContent: 'space-between',
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    marginBottom: 10,
                                                }}>
                                                Ordered Quantity: {item.quantity} x {item.sellingPrice}
                                            </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', right: 10, marginBottom: 10 }}>
                                                <TouchableOpacity onPress={() => {
                                                    if (quant[index]?.quantity < item.quantity) {
                                                        this.addQuantity(index)
                                                        // quant[index]?.quantity = quant[index]?.quantity + 1;
                                                    } else if (quant[index]?.quantity == item.quantity || quant[index]?.quantity >= item.quantity) {
                                                        ToastAndroid.showWithGravity('Reached Maximum Quantity', ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                    }
                                                }} style={{ borderRadius: 5, borderWidth: 0.5, backgroundColor: Colors.primary, borderColor: Colors.primary }} >
                                                    <FontAwesome5Icon color={'#fff'} name='plus' style={{ justifyContent: 'center', padding: 5 }} size={12} />
                                                </TouchableOpacity>
                                                <Text style={{
                                                    fontSize: 13,
                                                    color: 'black',
                                                    // marginBottom: 10,
                                                    // paddingBottom: 14,
                                                    paddingHorizontal: 10,

                                                }}>
                                                    {quant[index]?.quantity}
                                                </Text>
                                                <TouchableOpacity onPress={() => {
                                                    if (quant[index]?.quantity === 0) {
                                                        ToastAndroid.showWithGravity('Reached Zero Quantity', ToastAndroid.SHORT, ToastAndroid.CENTER)
                                                    }
                                                    else {
                                                        // this.setState({ quant: quant[index] - 1 })
                                                        this.removeQuantity(index)
                                                        // console.log('quant', quant[index]?.quantity - 1)
                                                    }
                                                }} style={{ padding: 5, backgroundColor: Colors.primary, borderRadius: 5, borderWidth: 0.5, borderColor: Colors.primary }}>
                                                    <FontAwesome5Icon color={'#fff'} name='minus' size={12} />
                                                </TouchableOpacity>
                                            </View>
                                            {/* <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: 'black',
                                                    marginBottom: 10,
                                                }}>
                                                Rs.{item.sellingPrice * item.quantity}
                                            </Text> */}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>





                    </ScrollView>
                    <View style={{ position: 'absolute', bottom: 10, justifyContent: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity style={{ borderRadius: 10, width: Dimensions.get('window').width / 1.2, alignSelf: 'center', justifyContent: 'center', backgroundColor: Colors.primary, padding: 10 }} onPress={() => this.state.isLoading ? null : this.placeRefundOrder()}>
                            {this.state.isLoading ? <ActivityIndicator size='large' style={{ justifyContent: 'center' }} /> : <Text style={{ textAlign: 'center', color: '#fff' }}>
                                Place Refund Request
        </Text>}
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView >
        );

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RefundProcedure);
