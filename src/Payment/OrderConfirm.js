/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FastImage,
} from 'react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import NumericInput from 'react-native-numeric-input';
import {Icon} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {SliderBox} from 'react-native-image-slider-box';
import Style from '../Components/Style';

export default class ItemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Home')}>
          <Icon style={Style.icon} name="close" />
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
            style={{
              borderRadius: 70,
              height: 120,
              alignSelf: 'center',
              width: 120,
              marginBottom: 25,
              marginTop: 150,
              backgroundColor: '#1976d2',
            }}>
            <Icon
              style={{
                color: 'white',
                fontSize: 75,
                paddingTop: 20,
                paddingLeft: 22,
              }}
              name="check"
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 28, alignSelf: 'center', marginBottom: 25}}>
          Rs.45,999
        </Text>
        <Text style={{fontSize: 14, color: 'grey', alignSelf: 'center'}}>
          Your Payment Is complete Please
        </Text>
        <Text style={{fontSize: 14, color: 'grey', alignSelf: 'center'}}>
          check the delivery Status at
        </Text>
        <Text style={{fontSize: 14, alignSelf: 'center', marginTop: 10}}>
          Order Tracking
        </Text>
        <View style={{marginTop: 50}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <View style={Style.filledbutton}>
              <Text style={Style.filledbuttontext}>Continue Shopping</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
