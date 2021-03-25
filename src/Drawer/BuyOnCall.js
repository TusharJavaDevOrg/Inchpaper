import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import ElevatedView from 'react-native-elevated-view';
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
import { TouchableOpacity, Linking, Platform } from "react-native";
import { Colors } from "../config/GlobalContants";
import { Dimensions } from "react-native";
class BuyOnCall extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    onCall = (phone) => {
        console.log('callNumber ----> ', phone);
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:+91${phone}`;
        }
        else {
            phoneNumber = `tel:+91${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Buy On Call', style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => this.onCall(7703860982)} style={{ width: '100%' }}>
                        <Image source={require('../assets/buyoncall.png')} style={{ height: Dimensions.get('window').height / 2.01, width: Dimensions.get('window').width / 1 }} resizeMethod="auto" resizeMode="contain" />
                    </TouchableOpacity>


                    <ElevatedView elevation={1} style={{ marginVertical: 20 }}>
                        <TouchableOpacity onPress={() => {

                            this.props.navigation.navigate('Refer')

                        }} style={[{}]}>

                            <Image source={require('../assets/refer.png')} style={{ height: Dimensions.get('screen').width / 4, width: Dimensions.get('screen').width / 1, }} resizeMode="stretch" />

                        </TouchableOpacity>
                    </ElevatedView>


                    <ElevatedView elevation={1} style={{ marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => {

                            this.props.navigation.navigate('Bulk')

                        }} style={[{}]}>
                            <Image source={require('../assets/bulk.png')} style={{ height: Dimensions.get('screen').width / 4, width: Dimensions.get('screen').width / 1, }} resizeMode="stretch" />
                        </TouchableOpacity>
                    </ElevatedView>
                </ScrollView>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Contact')} style={{ position: 'absolute', bottom: 0, padding: 15, width: '100%', backgroundColor: Colors.primary }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: Colors.white, textTransform: 'uppercase' }}>CONTACT US</Text>
                </TouchableOpacity>

            </View>

        )
    }
}
export default BuyOnCall