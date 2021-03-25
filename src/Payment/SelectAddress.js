/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Icon, Left, Title, Right, Header} from 'native-base';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  StyleSheet,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import Style from '../Components/Style';

var radio_props = [{value: 0}];

export default class Notification extends Component {
  render() {
    return (
      <View style={Style.container}>
        <StatusBar backgroundColor="white" barStyle={'dark-content'} />
        <View style={Style.row}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CartItem')}>
            <Icon style={Style.icon} name="arrow-back" />
          </TouchableOpacity>

          <Title style={styles.heading}>Checkout</Title>
        </View>
        <View style={Style.line}></View>

        <ScrollView>
          <View>
            <Text style={Style.heading}>Shipping to</Text>

            <FlatList
              style={{
                marginHorizontal: 5,
                marginTop: 10,
              }}
              data={[
                {
                  name: 'Michlengo Flores',
                  phone: '9876543210',
                  address: '32D Yost Island ',
                },
                {
                  name: 'Michlengo Flores',
                  phone: '9876543210',
                  address: '32D Yost Island ',
                },
              ]}
              vertical
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              keyExtractor={(item, i) => i.toString()}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f5f5f5',
            }}>
            <Icon
              style={styles.icon}
              name="plus-circle"
              type="MaterialCommunityIcons"
            />
            <Text style={styles.text}>Add Address</Text>
          </View>
          <Text style={Style.heading}>Select a Card</Text>

          <View style={styles.cardview}>
            <View
              style={{
                flexDirection: 'row',
                width: 330,
              }}>
              <View style={Style.itembox}>
                <Image
                  source={require('../assets/visa.png')}
                  style={{height: 20, width: 80, alignSelf: 'center'}}
                />
              </View>
              <View style={Style.itembox}>
                <Image
                  source={require('../assets/paypal.png')}
                  style={{alignSelf: 'center', height: 20, width: 80}}
                />
              </View>
              <View style={Style.itembox}>
                <Image
                  source={require('../assets/mastercard.png')}
                  style={{height: 30, width: 80, alignSelf: 'center'}}
                />
              </View>
            </View>
          </View>
          <View style={{height: 250}}>
            <View style={Style.categoryview}>
              <Text style={Style.flatlistheading}>Shipping Fee </Text>
              <Text style={Style.flatlistheading}>Rs. 11,500</Text>
            </View>
            <View style={Style.categoryview}>
              <Text style={Style.flatlistheading}>Sub Total</Text>
              <Text style={Style.flatlistheading}>Rs.500</Text>
            </View>

            <View style={Style.line}></View>
            <View style={Style.categoryview}>
              <Text style={Style.totalheading}>Total</Text>
              <Text style={Style.totalheading}>Rs. 12,000</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('OrderConfirm')}>
          <View style={Style.filledbutton}>
            <Text style={Style.filledbuttontext}>Payment</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderItem = ({item, index}) => (
    <View style={styles.renderview}>
      <View style={{padding: 15}}>
        <RadioForm
          radio_props={radio_props}
          initial={0}
          buttonSize={15}
          onPress={(value) => {
            this.setState({value: value});
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginBottom: 15,
        }}>
        <Text style={Style.noftificationtext}>{item.name}</Text>
        <Text style={{color: 'grey', paddingStart: 5}}>{item.phone}</Text>

        <Text style={{color: 'grey', paddingStart: 5, marginTop: 7}}>
          {item.address}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardview: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginTop: 15,
    height: 75,
    alignSelf: 'center',
    width: '100%',
  },
  heading: {
    color: 'black',
    alignSelf: 'center',
    marginLeft: 110,
    marginTop: 15,
    fontWeight: 'bold',
  },
  icon: {
    alignSelf: 'center',
    fontSize: 22,
    padding: 5,
    marginStart: 130,
    color: 'grey',
  },
  text: {
    marginVertical: 10,
    alignSelf: 'center',

    fontSize: 16,
    fontWeight: 'bold',
  },
  renderview: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderWidth: 0.3,
    borderColor: '#f5f5f5',
    padding: 10,
    marginBottom: 18,
    borderRadius: 10,
    marginHorizontal: 15,
  },
});
