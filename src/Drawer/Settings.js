/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Icon, Left, Title, Right, Header} from 'native-base';
import {View, Text, ScrollView, Image, StatusBar, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Style from '../Components/Style';

export default class Settings extends Component {
  render() {
    return (
      <View style={Style.container}>
        <Header style={{backgroundColor: 'white', elevation: 0.8}}>
          <StatusBar backgroundColor="white" barStyle={'dark-content'} />
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}>
              <Icon style={Style.icon} name="close" />
            </TouchableOpacity>
          </Left>

          <Title
            style={{
              color: 'black',
              alignSelf: 'center',
              marginLeft: 80,
              marginTop: 10,
              fontWeight: 'bold',
            }}>
            Settings
          </Title>

          <Right>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Items')}>
              <Text style={Style.bluetext}>Clear All</Text>
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }
}
