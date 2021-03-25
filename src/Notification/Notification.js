import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native"
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
class Notification extends Component {
    render() {
        return (
            <View>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Notifications', style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <View style={{ paddingVertical: '45%' }}>
                    <LottieView source={require('../assets/notification.json')} autoPlay loop style={{ width: '100%', height: 200, alignSelf: 'center' }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>No Notifications Available</Text>
                </View>
            </View>
        )
    }
}
export default Notification