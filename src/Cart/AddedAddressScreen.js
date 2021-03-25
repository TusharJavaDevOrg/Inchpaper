import Axios from 'axios';
import React, { Component } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import { deleteAddressUrl, deliveriblityCheckUrl, getNearestStoreUrl } from '../../Config/Constants';
import CartHeaderComopnent2 from '../Components/CartHeaderComopnent2';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { addNearestSupplier, addressSelected, addSelectedAddress, deleteNearestSupplier, getPaymentMode, getuserAddresses } from '../Redux/Auth/ActionCreatore';
import { addAbondonedId, deleteAbandoneId } from '../Redux/Cart/ActionCreators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { toast } from '../Functions/functions';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        user: state.user,
        addresses: state.addresses,
        abandonedCheckout: state.abandonedCheckout,
        favourites: state.favourites
    };
};

const mapDispatchToProps = (dispatch) => ({
    getuserAddresses: (data) => dispatch(getuserAddresses(data)),
    addAbondonedId: (id) => dispatch(addAbondonedId(id)),
    deleteAbandoneId: () => dispatch(deleteAbandoneId()),
    addSelectedAddress: (address) => dispatch(addSelectedAddress(address)),
    addressSelected: () => dispatch(addressSelected()),
    addNearestSupplier: (nearestSupplierData, minDist) =>
        dispatch(addNearestSupplier(nearestSupplierData, minDist)),
    deleteNearestSupplier: () => dispatch(deleteNearestSupplier()),
    getPaymentMode: () => dispatch(getPaymentMode()),
});
class AddedAddressScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: '',
            addressData: [
                { name: 'Sam Marshal', address1: 'R.N .D-74, sector 7, Mumbai', address2: 'Mumbai. Maharashtra-400505', phoneNumber: 9874563210 },
                { name: 'Jay Jain', address1: 'Roonm no 54, Sea View, Malbar Hill , Mumbai', address2: 'Mumbai. Maharashtra-400158', phoneNumber: 9002563210 },
            ]
        }
    }
    componentDidMount() {

        this.props.getPaymentMode();
        this._subscribe = this.props.navigation.addListener('focus', async () => {

            this.props.getPaymentMode();
        });
    }
    findNearestStore = async (lattitude, longitude) => {
        var url = getNearestStoreUrl(lattitude, longitude);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((resp) => {
                // console.log(
                //   'Nearesr supplies data=================================================================================================================================>',
                //   resp.data.object,
                // );
                var indexOfNearestSupplier = 0;
                var minimumDistance = 0;
                resp.data.object.map((item, index) => {
                    if (index === 0) {
                        indexOfNearestSupplier = 0;
                        minimumDistance = item.distance;
                    } else {
                        if (item.distance < minimumDistance) {
                            minimumDistance = item.distance;
                            indexOfNearestSupplier = index;
                        }
                    }
                });
                var nearestSupplierData = [resp.data.object[indexOfNearestSupplier]];
                this.props.addNearestSupplier(nearestSupplierData);
            })
            .catch((error) => {
                // console.log(
                //   'Error in fetching nearest supplier=================================>',
                //   error.message,
                // );
            });
    };

    checkDeliveriblity = async (slelectedAddress) => {
        // this.props.findDelivrableSocieties();
        this.setState({
            develireblityCheckLoading: true,
        });
        var url = deliveriblityCheckUrl(
            slelectedAddress.latitude,
            slelectedAddress.longitude,
        );

        console.log('URL', slelectedAddress.latitude, slelectedAddress.longitude, url);

        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('Deliveriblity check data->', response.data.object);
                this.setState({
                    deleveriblityCheckData: response.data.object,
                });
                if (response.data.object.length === 0) {
                    this.setState({
                        develireblityCheckModelShown: true,
                        develireblityCheckLoading: false,
                    });
                } else {
                    this.findNearestStore(
                        slelectedAddress.latitude,
                        slelectedAddress.longitude,
                    );
                    this.props.addSelectedAddress(slelectedAddress);
                    if (this.props.login.hasSelectedAddress) {
                        this.props.navigation.goBack();
                    } else this.props.addressSelected();
                    this.setState({
                        develireblityCheckLoading: false,
                    });
                }
            })
            .catch((error) => {
                // console.log('Error', error);
                this.setState({
                    develireblityCheckLoading: false,
                });
            });
    };
    deleteAddress = async (addressId) => {
        var url = deleteAddressUrl(addressId);

        var data = {
            currentSelectedAddress: this.props.addresses.selectedAddress,
            userId: this.props.login.userId,
        };

        await Axios.delete(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
        })
            .then((resp) => {
                // console.log('Here is address deletion resp', resp);
                this.props.getuserAddresses(this.props.login.userId);
                toast(
                    resp.data.message,

                );
            })
            .catch((err) => {
                // console.log('Here is address deletion error', err.message);
            });
    };
    handleAddress = () => {
        const { select } = this.state;
        if (select === "") {
            toast('please select an address to continue')
        }
        else {

            const { body, cartTotal } = this.props.route.params;
            var updatedBody = body;
            var addresses = [
                {
                    addressLine1: select.addressLine1,
                    addressLine2: select.addressLine2,
                    addressState: select.addressState,
                    city: select.city,
                    country: select.country,
                    customerId: this.props.login.userId,
                    customerName: select.customerName,
                    emailId: select.emailId,
                    landmark: select.landmark,
                    latitude: select.latitude,
                    longitude: select.longitude,
                    pincode: select.pincode,
                },
            ];
            updatedBody.addresses = addresses;
            this.props.navigation.navigate('Payments', { body: updatedBody, cartTotal: cartTotal })
        }
    }
    render() {
        const { body, cartTotal } = this.props.route.params;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={<CartHeaderComopnent2 />}
                />
                <View style={{ flex: 1 }}>
                    {/* ===== progress bar ====== */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '35%', backgroundColor: Colors.primary, height: 2 }} />
                        <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                        <View style={{ width: '30%', backgroundColor: Colors.primary, height: 2 }} />
                        <View style={{ width: 5, padding: 3, backgroundColor: Colors.primary, borderRadius: 30 }} />
                    </View>

                    <View style={{ padding: 8, paddingTop: '5%' }}>
                        <View style={{ backgroundColor: '#fff', padding: 15, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                <Text style={{ fontSize: 12, textTransform: 'uppercase', color: '#333333', fontFamily: 'sans-serif-light', fontWeight: 'bold' }}>select shipping address</Text>
                                <Text onPress={() => this.props.navigation.navigate('CheckoutAddress', { body: body, cartTotal: cartTotal })} style={{ fontSize: 12, textTransform: 'uppercase', color: Colors.primary, fontFamily: 'sans-serif-light', fontWeight: 'bold' }}>Add new</Text>
                            </View>
                            <View style={{ paddingTop: 15 }}>
                                <View style={{ backgroundColor: '#DDDDDD', height: 1, }} />
                            </View>
                            <View>
                                {this.props.addresses.isLoading ?
                                    <FlatList data={[1]} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => (
                                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                            <View>
                                                <TouchableOpacity style={{ paddingVertical: 10 }}>
                                                    <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef' }}>{ }</Text>
                                                    <View style={{ paddingVertical: 3 }}>
                                                        <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef', }}></Text>
                                                        <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef', }}></Text>
                                                    </View>
                                                    <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', backgroundColor: '#efefef', }}>{ }</Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row', paddingVertical: '4%', }}>
                                                    <Text style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#efefef', }}></Text>
                                                    <Text style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', paddingHorizontal: '10%', backgroundColor: '#efefef' }}></Text>
                                                </View>
                                            </View>

                                        </View>
                                    )} ItemSeparatorComponent={() => (
                                        <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />
                                    )} />
                                    :

                                    <FlatList data={this.props.addresses.userAddresses} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                                        console.log('adder item', item)
                                        return (
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ width: '92%' }}>
                                                    <TouchableOpacity onPress={() => this.setState({ select: item })} style={{ paddingVertical: 10 }}>
                                                        <View style={{ paddingVertical: 3 }}>
                                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{item.customerName}</Text>
                                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{item.addressLine1}</Text>
                                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{item.addressLine2}</Text>
                                                            <Text style={{ fontSize: 12, textTransform: 'capitalize', fontFamily: 'sans-serif', textAlign: 'justify' }}>{item.city}, {item.addressState}, {item.country} - {item.pincode}</Text>
                                                        </View>
                                                        <Text style={{ fontSize: 12, fontFamily: 'sans-serif', }}>{item.emailId}</Text>
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: 'row', paddingVertical: '4%', }}>
                                                        <Text onPress={() => Alert.alert(
                                                            'Are you sure?',
                                                            'This address will be deleted permanently.',
                                                            [
                                                                {
                                                                    text: 'Cancel',
                                                                    onPress: () =>
                                                                        console.log('Cancel Pressed'),
                                                                    style: 'cancel',
                                                                },
                                                                {
                                                                    text: 'Delete',
                                                                    onPress: () => {
                                                                        this.deleteAddress(item.id);
                                                                    },
                                                                },
                                                            ],
                                                            { cancelable: false })} style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', }}>Delete</Text>
                                                        <Text onPress={() => this.props.navigation.navigate('AddAddress', { data: item, from: 'EditAddress' })} style={{ color: Colors.primary, fontSize: 11, fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', paddingHorizontal: '10%' }}>Edit</Text>
                                                    </View>
                                                </View>
                                                {this.state.select?.id == item.id ? <Icon name="checkbox-marked-circle-outline" onPress={() => this.setState({ select: "" })} style={{ alignSelf: 'center' }} size={25} color={Colors.primary} /> : <Icon onPress={() => this.setState({ select: item })} name="checkbox-blank-circle-outline" style={{ alignSelf: 'center' }} size={25} color={Colors.primary} />}
                                            </View>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{ borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }} />
                                    )} />}
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.handleAddress()} style={{ padding: 15, backgroundColor: Colors.primary }}>
                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'sans-serif-light', letterSpacing: 1 }}>Continue to payments</Text>
                    </TouchableOpacity>
                </View>


            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddedAddressScreen)