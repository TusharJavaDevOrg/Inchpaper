/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Container,
  Item,
  Button,
  Input,
  Icon,
  Left,
  Title,
  Body,
  Right,
  Header,
} from 'native-base';
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import RangeSlider from 'rn-range-slider';
import Style from '../Components/Style';


const colorSlot = [
  {
    color: '#000000',
  },
  {
    color: 'red',
  },
  {
    color: '#000000',
  },
  {
    color: 'blue',
  },
];

export default class Filter extends Component {
  state = { subCategoryList: [], productBrands: [] };

  _renderItem = ({ item }) => {
    return (
      <View style={Style.itembox}>
        <Text style={Style.itemtext}>{item.title}</Text>
      </View>
    );
  };

  componentDidMount() {
    // make a call to the api for subCatergory by passing the category id
    // getSubCategory();
    // console.log(this.props);
    //  console.log('category Id', this.props.route.params);
    const { categoryId } = this.props.route.params;


  }

  render() {
    // console.log('product brands', this.state.productBrands);
    return (
      <View style={Style.container}>
        <Header style={{ backgroundColor: 'white', elevation: 0.8 }}>
          <StatusBar backgroundColor="white" barStyle={'dark-content'} />
          <Left>
            <Button transparent>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Items')}>
                <Icon style={{ color: 'black', fontSize: 26 }} name="close" />
              </TouchableOpacity>
            </Button>
          </Left>
          <Body style={{ marginStart: 40 }}>
            <Title style={{ width: 200, color: 'black', marginLeft: 70 }}>
              Filters
            </Title>
          </Body>
          <Right>
            <Button transparent>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Items')}>
                <Text style={Style.bluetext}>Done</Text>
              </TouchableOpacity>
            </Button>
          </Right>
        </Header>

        <View style={Style.container}>
          <ScrollView>
            <View style={Style.container}>
              <View style={styles.headingview}>
                <Text style={Style.heading}>Brand</Text>
              </View>
              <View style={Style.keywordview}>
                {this.state.productBrands.length > 0 ? (
                  <FlatList
                    data={this.state.subCategoryList}
                    renderItem={this._renderItem}
                    keyExtractor={(item, i) => i.toString()}
                    numColumns={3}
                  />
                ) : (
                    <View>
                      <Text>No Categories Found</Text>
                    </View>
                  )}
              </View>
              {/* <View style={Style.keywordview}>
                <View style={styles.brandview}>
                  <Image
                    source={require('../assets/B3.jpg')}
                    style={{height: 30, width: 104}}
                  />
                </View>
                <View style={styles.brandview}>
                  <Image
                    source={require('../assets/B2.png')}
                    style={{height: 30, width: 104}}
                  />
                </View>
                <View style={styles.brandview}>
                  <Image
                    source={require('../assets/B3.jpg')}
                    style={{height: 30, width: 104}}
                  />
                </View>
              </View>
              <View style={Style.keywordview}>
                <View style={styles.brandview}>
                  <Image
                    source={require('../assets/B2.png')}
                    style={{height: 30, width: 104}}
                  />
                </View>
                <View style={styles.brandview}>
                  <Image
                    source={require('../assets/B3.jpg')}
                    style={{height: 30, width: 104}}
                  />
                </View>
              </View> */}
              <View style={styles.headingview}>
                <Text style={Style.heading}> Sub Categories</Text>
              </View>
              {/* {this.state.subCategoryList.map((item, index) => {
                //  console.log('item title', item.title);
                return (
                  <View style={{flexDirection: 'row'}}>
                    <View style={Style.keywordview}>
                      <View style={Style.itembox}>
                        <Text style={Style.itemtext}>{item.title}</Text>
                      </View>
                    </View>
                  </View>
                );
              })} */}
              <View style={Style.keywordview}>
                <FlatList
                  data={this.state.subCategoryList}
                  renderItem={this._renderItem}
                  keyExtractor={(item, i) => i.toString()}
                  numColumns={3}
                />
              </View>

              {/* <View style={Style.keywordview}>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Accent Chair</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Kitchen & dining chairs</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Baar stools</Text>
                </View>
              </View>
              <View style={Style.keywordview}>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Office furniture</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Folding Chairs</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Stackting chairs</Text>
                </View>
              </View>
              <View style={Style.keywordview}>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Living Room Furniture</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Reclining sectional</Text>
                </View>
                <View style={Style.itembox}>
                  <Text style={Style.itemtext}>Garden Chairs</Text>
                </View>
              </View>
              <View style={styles.headingview}>
                <Text style={Style.heading}>Price Range</Text>
              </View> */}
              <RangeSlider
                style={{ width: null, marginHorizontal: 15, height: 80 }}
                gravity={'center'}
                min={5000}
                max={50000}
                step={20}
                selectionColor="#B72304"
                blankColor="#f5f5f5"
                onValueChanged={(low, high, fromUser) => {
                  this.setState({ rangeLow: low, rangeHigh: high });
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 17,
                }}>
                <Text style={{ color: 'grey' }}>Rs.1000</Text>
                <Text style={{ color: 'grey' }}>Rs.50000</Text>
              </View>
              <Text style={{ fontWeight: 'bold', marginRight: 300 }}></Text>
              <FlatList
                style={{ marginTop: 5 }}
                contentContainerStyle={{ marginLeft: 15 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={colorSlot}
                keyExtractor={(item, index) => item.index}
                renderItem={this.renderItem}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  headingview: {
    flex: 1,
    marginTop: 19,
    backgroundColor: '#f5f5f5',
    height: '100%',
    width: '100%',
  },
  brandview: {
    height: 45,
    width: '33%',
    marginStart: 15,
    marginTop: 15,
    borderColor: '#bdbdbd',
    borderRadius: 2,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
