import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';
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
class TwoIconHeaderComponent extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '150%', paddingRight: 10 }}>
                <MCIcon name="bell-outline" size={22} style={{ padding: 5 }} onPress={this.props.onPressBell} />
                <MCIcon name="heart-outline" size={22} style={{ padding: 5 }} onPress={this.props.onPressMark} />
                {this.props.favourites.products.length > 0 ? (
                    <Badge
                        status="warning"
                        containerStyle={{
                            position: 'absolute',
                            top: -7,
                            right: 40,
                        }}
                        value={this.props.favourites.products.length}
                    />
                ) : null}
                <MCIcon name="cart-outline" size={22} style={{ padding: 5 }} onPress={this.props.onPressCart} />
                {this.props.cart.cart.length > 0 ? (
                    <Badge
                        status="success"
                        containerStyle={{
                            position: 'absolute',
                            top: -7,
                            right: -3,
                        }}
                        value={this.props.cart.cart.length}
                    />
                ) : null}
            </View>
        )
    }
}

export default connect(mapStateToProps)(TwoIconHeaderComponent)
