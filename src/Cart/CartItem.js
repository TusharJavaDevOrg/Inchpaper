/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { Button, Icon, Header, Right, Left, Body, Title } from 'native-base';
import Style from '../Components/Style';

import { ScrollView } from 'react-native-gesture-handler';

const clearSession = () => {
  console.log('Clear Session function is called');
};
const logout = () => {
  Alert.alert(
    'Clear Cart',
    'Are you sure you want to Clear Cart?',
    [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => clearSession(),
      },
    ],
    { cancelable: false },
  );
};

export default class CartItem extends Component {
  render() {
    return (
      <View style={Style.container}>
        <Header style={{ backgroundColor: 'white', elevation: 0.8 }}>
          <StatusBar backgroundColor="white" barStyle={'dark-content'} />
          <Left>
            <Button transparent>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon style={{ color: 'black', fontSize: 26 }} name="close" />
              </TouchableOpacity>
            </Button>
          </Left>
          <Body>
            <Title
              style={{
                width: 200,
                color: 'black',
                marginLeft: 50,
                marginTop: 5,
              }}>
              Shopping Cart
            </Title>
          </Body>
          <Right>
            <Button transparent>
              <TouchableOpacity onPress={logout}>
                <Text style={Style.bluetext}>Clear all</Text>
              </TouchableOpacity>
            </Button>
          </Right>
        </Header>
        <ScrollView>
          {/* <FlatList
            style={{
              marginHorizontal: 5,
              marginTop: 10,
            }}
            data={[
              {
                // image: require('../../screens/images/F1.png'),
                image: require('../assets/F1.png'),

                title: 'Alinium Chairs',
                subtitle: 'Buy product related to lazy boy chair products',
              },
              {
                image: require('../assets/F2.png'),
                title: 'Table',
                subtitle: 'Buy product related to lazy boy chair products',
              },
            ]}
            vertical
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
            keyExtractor={(item, i) => i.toString()}
          /> */}
          <View style={Style.line}></View>
          <View style={{ padding: 10 }}>
            <Text style={Style.flatlisttitle}>
              Custom Order: Your Item may charged before the order shiped
            </Text>
            <Text style={Style.flatlisttitle}>
              Ready to shiped to your location within 4-5 bussines days.
            </Text>
          </View>
          <View style={{ backgroundColor: '#f5f5f5', height: 320 }}>
            <View style={Style.categoryview}>
              <Text style={Style.flatlistheading}>Subtotal</Text>
              <Text style={Style.flatlistheading}>Rs. 11,500</Text>
            </View>
            <View style={Style.categoryview}>
              <Text style={Style.flatlistheading}>Shipping</Text>
              <Text style={Style.flatlistheading}>Rs.500</Text>
            </View>
            <View style={Style.categoryview}>
              <Text style={Style.flatlistheading}>Estimate Tax</Text>
              <Text style={Style.flatlistheading}>Rs. 1199</Text>
            </View>
            <View style={Style.line}></View>
            <View style={Style.categoryview}>
              <Text style={Style.totalheading}>Total</Text>
              <Text style={Style.totalheading}>Rs. 13,199</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ marginBottom: 15 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SelectAddress')}>
            <View style={Style.filledbutton}>
              <Text style={Style.filledbuttontext}>Proceed to pay </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderItem = ({ item, index }) => (
    <View style={Style.flatlistview}>
      <Image source={item.image} style={Style.flatlistitemimage} />

      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 20,
          marginTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginEnd: 10,
          }}>
          <TouchableOpacity>
            <Text style={Style.flatlistheading}>{item.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              style={{
                color: 'grey',
                fontSize: 24,
              }}
              name="trash-can-outline"
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={Style.text}>
          {item.subtitle}
        </Text>
        <Text style={Style.flatlisttitle}>Rs.2,500</Text>
      </View>
    </View>
  );
}
