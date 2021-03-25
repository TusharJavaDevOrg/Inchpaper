/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  Skip,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {color} from 'react-native-reanimated';

import Login from '../pages/Account/Signup';

const slides = [
  {
    key: 'one',
    title: 'Office Furniture',
    text: 'Lorem ipsum dolor sit amet consectetur adipicing elit',
    image: require('../assets/slide1.png'),
  },
  {
    key: 'two',
    title: 'Relexing Furniture',
    text: 'Lorem ipsum dolor sit amet consectetur adipicing elit',
    image: require('../assets/slide2.png'),
  },
  {
    key: 'three',
    title: 'Home Furniture',
    text: 'Lorem ipsum dolor sit amet consectetur adipicing elit',
    image: require('../assets/slide3.png'),
  },
];

export default class Slides extends Component {
  state = {showHomePage: false};
  _renderItem = ({item}) => {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Image style={styles.logo} source={item.image} />
        <Text style={styles.tittletext}>{item.title}</Text>
        <Text style={styles.textcontainer}>{item.text}</Text>
      </View>
    );
  };

  render() {
    if (this.state.showHomePage) {
      return <Slides />;
    } else {
      return (
        <AppIntroSlider
          renderItem={this._renderItem}
          data={slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          activeDotStyle={{
            backgroundColor: '#B72304',
            width: 10,
          }}
          dotStyle={{ width: 10, backgroundColor: '#A59F9F' }}
        />
      );
    }
  }
  _renderNextButton = () => {
    return (
      <View>
        <Text style={styles.next}>Next</Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Landing')}>
          <Text style={styles.done}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  logo: {
    height: '65%',
    width: '100%',
    resizeMode: 'center'
  },
  tittletext: {
    paddingTop: 25,
    paddingBottom: 10,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#21465b',
    alignSelf: 'center',
  },
  textcontainer: {
    textAlign: 'center',
    color: '#b5b5b5',
    fontSize: 15,
    paddingHorizontal: 30,
  },
  skip: {
    fontSize: 12,
    color: 'white',
    marginEnd: 16,
    // alignSelf: 'center',

    // borderRadius: 40,
    height: 25,
    //  alignSelf: 'flex-end',
    width: 60,
    textAlign: 'center',
    borderRadius: 30,
    padding: 4,

    marginTop: 15,

    backgroundColor: '#B72304',
    alignSelf: 'flex-end',
  },
  done: {padding: 15, color: '#A50000', fontSize: 15, fontWeight: 'bold'},
  next: {padding: 15, color: 'grey', fontSize: 15},
});
