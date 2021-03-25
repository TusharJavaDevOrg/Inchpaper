import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import LottieView from 'lottie-react-native';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { getReferalCode } from '../Redux/Auth/ActionCreatore';
import { StackActions } from '@react-navigation/native';
import { Colors } from '../config/GlobalContants';


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
});
class OrderConfirmedScreen extends Component {
    backHandler = (type) => {
        console.log('type', type)
        if (type === "button") {
            this.props.navigation.dispatch(StackActions.pop(3));
            this.props.navigation.goBack(null);
        } else {
            this.props.navigation.dispatch(StackActions.pop(4));

        }
        // this.props.navigation.navigate('Home');
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
        this.props.getReferalCode(this.props.login.userId);
        // setTimeout(this.backHandler(), 10000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.backHandler('button')} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Order Confirmed' }}

                />
                <View style={{ flex: 1, }}>
                    <View style={{}} >
                        <LottieView source={require('../assets/order-packed.json')} autoPlay loop={false} style={{ height: 200, width: '100%', alignSelf: 'center' }} />
                    </View>
                    <View>
                        <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 20, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Order Confirmed</Text>
                        <Text style={{ fontFamily: 'sans-serif-light', width: '70%', textAlign: 'center', alignSelf: 'center', paddingVertical: 5 }}>Sit back and relax. Your Express Package is arriving Soon</Text>
                    </View>
                    <View style={{ paddingHorizontal: '5%', paddingVertical: '15%' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Order')} style={{ padding: 15, backgroundColor: Colors.primary, borderRadius: 10, }}>
                            <Text style={{ fontFamily: 'sans', color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center', letterSpacing: 1 }}>Track Package</Text>
                        </TouchableOpacity>
                        <View style={{ paddingVertical: '4%' }} />
                        <TouchableOpacity onPress={() => this.backHandler('button')} style={{ padding: 15, borderColor: Colors.primary, borderWidth: 1, borderRadius: 10 }}>
                            <Text style={{ fontFamily: 'sans', color: Colors.primary, fontWeight: 'bold', fontSize: 15, textAlign: 'center', letterSpacing: 1 }}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text onPress={() => this.props.navigation.navigate('Support')} style={{ fontFamily: 'sans-serif-light', fontSize: 14, textAlign: 'center', paddingVertical: 10 }}>Facing issue? <Text style={{ fontWeight: 'bold' }}>Chat with Customer Support</Text></Text>
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmedScreen)