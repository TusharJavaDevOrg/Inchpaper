import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { View, Text, TouchableOpacity, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../config/GlobalContants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { findCartTotal } from '../Functions/functions';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        supplier: state.supplier,
        login: state.login,
        user: state.user,
        favourites: state.favourites,
        abandonedCheckout: state.abandonedCheckout,
    };
};
class BottomCart extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { moveTo } = this.props;
        return (
            <View style={{ paddingHorizontal: 10, height: 50, backgroundColor: Colors.success, borderRadius: 3, width: Dimensions.get('screen').width / 1 }}>
                <TouchableWithoutFeedback onPress={() => moveTo()} >
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingVertical: 5, paddingHorizontal: 10 }}>
                        <View>
                            <Text style={{ color: Colors.white, paddingVertical: 10 }}>
                                {this.props.cart.cart.length}{' '}{this.props.cart.cart.length === 1 ? 'Item' : 'Items'} | ₹ {findCartTotal(this.props.cart.cart)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                            <Text style={{ color: Colors.white }}>View Cart</Text>
                            <Icon name="cart-outline" size={15} style={{ paddingLeft: 5, paddingTop: 2 }} color={Colors.white} />
                        </View>




                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
export default connect(mapStateToProps)(BottomCart);