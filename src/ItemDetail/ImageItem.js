/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Button, Icon, Header, Right} from 'native-base';
import Slides from '../Slides/Slides';

const slides = [
  {
    key: 'one',
    image: require('../assets/sofa1.png'),
  },
  {
    key: 'two',
    image: require('../assets/sofa1.png'),
  },
  {
    key: 'three',
    image: require('../assets/sofa1.png'),
  },
  {
    key: 'four',
    image: require('../assets/sofa1.png'),
  },
];

export default class ImageItem extends Component {
  state = {showHomePage: false, categoryProductImages: []};
  componentDidMount() {
    // console.log(this.props.route.params);
    const {categoryProductImage} = this.props.route.params;
    this.setCategoryProductImage(categoryProductImage);
  }
  setCategoryProductImage(categoryProductImage) {
    this.setState({
      categoryProductImages: [{key: 'one', image: categoryProductImage}],
    });
  }
  _renderItem = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ItemDetail')}>
            <Icon
              style={{
                fontSize: 29,
                paddingTop: 15,
                marginLeft: 15,
              }}
              name="close"
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Cart')}>
            <Icon
              style={{
                fontSize: 25,
                marginRight: 15,

                paddingTop: 18,
              }}
              name="shopping-outline"
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Image
            source={{uri: item.image}}
            style={{
              height: 400,
              alignSelf: 'center',
              width: 380,
              marginVertical: 100,
            }}
          />
        </TouchableOpacity>
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
          data={this.state.categoryProductImages}
          activeDotStyle={{
            backgroundColor: '#B72304',
            width: 10,
          }}
        />
        // <Image
        //   source={{uri: this.state.categoryProductImage}}
        //   style={{height: 500, width: 400}}
        // />
      );
    }
  }
}
