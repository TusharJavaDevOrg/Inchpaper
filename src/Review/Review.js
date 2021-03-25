/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  Colors,
} from 'react-native';
import { Button, Icon, Container } from 'native-base';
import StarRating from 'react-native-star-rating';
import Style from '../Components/Style';

import ReadMore from 'react-native-read-more-text';

export default class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5,
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.container}>
          <View style={Style.row}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Items')}>
              <Icon style={Style.icon} name="arrow-back" />
            </TouchableOpacity>
            <Text style={Style.headertext}> Reviews</Text>
          </View>
          <View style={Style.line} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={styles.ratingtext}> 4.1 </Text>
            <View
              style={{ marginStart: 15, marginTop: 18, flexDirection: 'column' }}>
              <StarRating
                disabled={false}
                fullStarColor={'#ffab00'}
                starSize={20}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
              <Text style={styles.reviewtext}>24 Review</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Image
              style={Style.profileicon}
              source={require('../assets/P1.png')}
            />
            <View style={Style.column}>
              <Text style={styles.name}>Bridge Murpfy</Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  marginStart: 15,
                }}>
                <StarRating
                  disabled={false}
                  fullStarColor={'#ffab00'}
                  starSize={15}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
                <Text style={styles.date}> 11-09-2020 </Text>
              </View>
              <View
                style={{
                  padding: 15,
                  width: 310,
                }}>
                <ReadMore
                  numberOfLines={3}
                  renderTruncatedFooter={this._renderTruncatedFooter}
                  renderRevealedFooter={this._renderRevealedFooter}
                  onReady={this._handleTextReady}>
                  <Text>
                    With Trevi Furniture you get nothing but the best. With
                    advanced manufacturing facility,tight control on quality and
                    cost, Trevi Furniture has been positioned as a trusted brand
                    since two decades.. Modern Style Sofas usually come in fixed
                    back with cushions attached to the frame. They mostly come
                    with minimal details & compact proportions. These sofas can
                    be with or without arms.
                  </Text>
                </ReadMore>
              </View>
              {/* <FlatList
                style={{
                  marginStart: 10,
                  marginBottom: 20,
                  marginEnd: 12,
                }}
                data={[
                  {
                    image: require('../assets/F1.png'),
                  },
                  {
                    image: require('../assets/F2.png'),
                  },
                  {
                    image: require('../assets/F3.png'),
                  },
                  {
                    image: require('../assets/F4.png'),
                  },
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={this._renderItem}
                keyExtractor={(item, i) => i.toString()}
              /> */}
            </View>
          </View>
          <View style={Style.line} />
        </View>
      </Container>
    );
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#03a9f4', marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#03a9f4', marginTop: 5 }} onPress={handlePress}>
        Show less
      </Text>
    );
  };

  _renderItem = ({ item, index }) => (
    <View
      style={{
        maxHeight: 180,
        maxWidth: 130,
      }}>
      <Image
        source={item.image}
        style={{
          height: 100,
          marginHorizontal: 5,
          width: 100,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  ratingtext: {
    fontSize: 60,
    fontWeight: 'bold',
    marginStart: 15,
  },
  name: {
    marginStart: 15,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15,
  },
  date: {
    color: 'grey',
    marginStart: 140,
  },
  reviewtext: {
    color: 'grey',
    fontSize: 14,
    marginTop: 5,
  },
});
