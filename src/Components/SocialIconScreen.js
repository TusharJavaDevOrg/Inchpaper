import React, { Component } from "react";
import { View, Text, Linking } from "react-native";
import { SocialIcon } from "react-native-elements";

export default class SocialScreen extends Component {
    navigate = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log("Don't know how to open URI: " + link);
            }
        });
    }

    render() {
        return (
            <View style={{ alignItems: 'center', paddingVertical: '10%' }}>
                <View style={{}}>
                    <View style={{ backgroundColor: '#949292', height: 1, width: 100, alignSelf: 'center' }} />
                    <Text style={{ color: '#949292', textTransform: 'capitalize', fontSize: 14, fontFamily: 'sans-serif-light', paddingVertical: 20 }}>Like What You see? you'll Like us even more here:</Text>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignSelf: 'center' }}>
                    <SocialIcon type="instagram" onPress={() => this.navigate('https://www.instagram.com/inchpaper/')} raised={false} iconSize={20} />
                    <SocialIcon type="facebook" onPress={() => this.navigate('https://www.facebook.com/inchpaper')} iconSize={20} raised={false} />
                    <SocialIcon type="twitter" onPress={() => this.navigate('https://twitter.com/inchpaper')} iconSize={20} raised={false} />
                </View>
            </View>
        )
    }
}