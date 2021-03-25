import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import { Image } from 'react-native';
import { Colors } from '../config/GlobalContants'


export default class Splash extends Component {
    constructor(props) {
        super(props);
        // setTimeout(() => SplashScreen.hide(), 2000);
        SplashScreen.hide()
    }
    componentDidMount() {
        SplashScreen.hide();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

                <View style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center' }}>
                    {/* <LottieView source={require('../assets/spl.json')} autoPlay loop={false} style={{ height: 300, alignSelf: 'center', paddingBottom: '50%' }} /> */}
                    <Image source={require('../assets/logo.png')} height={300} resizeMethod="auto" resizeMode="center" width={'100%'} style={{ alignSelf: 'center' }} />
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                        <View>
                            <Text style={{ fontFamily: 'sans-serif-light', color: '#581845', fontSize: 40, fontWeight: 'bold', left: 10 }}>Inch Paper</Text>
                            <Text style={{ fontFamily: 'sans-serif-light', color: '#ff', fontSize: 13, fontWeight: 'bold', textAlign: 'right' }}>We Desgin Art</Text>

                        </View>
                    </View> */}
                </View>
            </View>
        )
    }
}
