import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StatusBar, StyleSheet } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';

export default class ProductFullImageView extends Component {


    render() {
        const { images } = this.props.route.params;
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                    <Icon style={styles.close} name='close-outline' type='ionicon' color='white' size={30} />
                </TouchableWithoutFeedback>
                <View style={{}}>
                    <SliderBox images={images} sliderBoxHeight={'95%'} resizeMode={'contain'} />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    close: {
        paddingTop: 30,
        alignSelf: 'flex-start',
        left: 20
    }

})
