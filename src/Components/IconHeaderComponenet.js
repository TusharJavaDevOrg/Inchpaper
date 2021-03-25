import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Badge } from 'react-native-elements';
import { Component } from 'react';
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
class IconHeaderComponenet extends Component {
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Icon name={this.props.iconName} color={this.props.iconColor} type={this.props.iconType} size={this.props.iconSize} onPress={this.props.onPress} />
                {this.props.showImage && <Image source={require('../assets/header1.png')} style={{ marginLeft: 8, alignSelf: 'flex-start', maxHeight: 30, width: 50 }} resizeMode={'contain'} />}
                {this.props.showCart ? this.props.cart.cart.length > 0 ? (
                    <Badge
                        status="success"
                        containerStyle={{
                            position: 'absolute',
                            top: -7,
                            right: -10,
                        }}
                        value={this.props.cart.cart.length}
                    />
                ) : null : null}
            </View>
        )
    }
}

export default connect(mapStateToProps)(IconHeaderComponenet)
