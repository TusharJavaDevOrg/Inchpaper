import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../config/GlobalContants';

function CartHeaderComopnent2() {
    return (
        <View style={{ width: '100%', padding: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 'bold', paddingHorizontal: '2%', fontFamily: 'sans-serif-light', color: "#A4A4A4" }}>Cart</Text>
                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 'bold', paddingHorizontal: '25%', fontFamily: 'sans-serif-light', color: Colors.primary }}>Address</Text>
                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'sans-serif-light', color: "#A4A4A4" }}>payment</Text>
            </View>
        </View>
    )
}

export default CartHeaderComopnent2
