/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FastImage,
  Dimensions,
  Image,
} from 'react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import NumericInput from 'react-native-numeric-input';
import { Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';

import HTML from 'react-native-render-html';

export default class ItemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: '',
      categoryProductName: '',
      categoryProductDescription: '',
    };
  }
  componentDidMount() {
    // console.log(this.props.route.params);
    // let fetchedCategoryProductId = this.props.route.params;
    // call a function to get the details of this particular product
    //console.log(this.props.route.params);
    const { categoryId, categoryProductId } = this.props.route.params;

  }

  render() {
    // console.log('product details', this.state);
    // const contentWidth = useWindowDimensions().width;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Items')}>
          <Icon
            style={{
              fontSize: 26,
              marginStart: 15,
              marginTop: 15,
            }}
            name="arrow-back"
          />
        </TouchableOpacity>
        <ScrollView>
          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ImageItem', {
                  categoryProductImage: this.state.images,
                })
              }>
              {/* <SliderBox
                ImageComponent={FastImage}
                images={this.state.images}
                dotColor="#B72304"
                inactiveDotColor="#90A4AE"
                paginationBoxVerticalPadding={20}
                autoplay
                circleLoop
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(128, 128, 128, 0.92)',
                }}
                ImageComponentStyle={{
                  height: 400,
                  marginTop: 15,
                  marginBottom: 15,
                }}
              /> */}
              <Image
                source={{ uri: this.state.images }}
                style={{
                  height: 400,
                  marginTop: 15,
                  marginBottom: 15,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomColor: '#9e9e9e',
              borderBottomWidth: 0.5,
              marginTop: 10,
            }}
          />

          {/* <Text style={{padding: 15, fontWeight: 'bold'}}>
            Corner Sofa 2-Seat
          </Text> */}

          <Text
            style={{
              marginStart: 15,
              marginTop: 10,
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            {this.state.categoryProductName}
          </Text>
          <Text style={{ marginStart: 15, marginTop: 5, fontWeight: 'bold' }}>
            Rs. {this.state.sellingPrice}
          </Text>
          {/* 
          <Text style={{marginStart: 15, marginTop: 15, color: 'grey'}}>
            With open end , Farsta Dark Brown
          </Text> */}

          <View
            style={{
              marginTop: 15,
              marginHorizontal: 15,
              marginBottom: 30,
            }}>
            {this.state.categoryProductDescription !== '0' ? (
              <HTML html={this.state.categoryProductDescription} />
            ) : null}
            {/* <HTML html={this.state.categoryProductDescription} /> */}
            {/* {this.state.categoryProductDescription} */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 30,
            }}>
            <Text
              style={{
                marginStart: 15,
                marginTop: 10,
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              Select Quantity
            </Text>

            <NumericInput
              value={this.state.value}
              onChange={(value) => this.setState({ value })}
              onLimitReached={(isMax, msg) => console.log(isMax, msg)}
              totalWidth={120}
              totalHeight={40}
              marginTop={15}
              iconSize={20}
              step={1}
              textColor="grey"
              iconStyle={{ color: '#bdbdbd' }}
            />
          </View>

          <Text
            style={{
              marginStart: 15,
              marginTop: 20,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            About this Product
          </Text>

          <View
            style={{
              borderBottomColor: '#9e9e9e',
              borderBottomWidth: 0.5,
              marginHorizontal: 10,
              marginTop: 10,
            }}
          />

          <View>
            <Collapse style={{ padding: 15, marginTop: 10 }}>
              <CollapseHeader>
                <View flexDirection="row" justifyContent="space-between">
                  <Text style={{ fontSize: 16 }}>Key Features</Text>
                  <Icon
                    style={{ color: 'black', fontSize: 22 }}
                    name="chevron-down"
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <CollapseBody>
                  <Text style={{ marginTop: 15, color: 'grey' }}>
                    The Durability Certified badge is applied on products which
                    have been tested by independent laboratories certified by
                    the National Accreditation Board for Testing and Calibration
                    Laboratories (NABL).
                  </Text>
                </CollapseBody>
              </CollapseBody>
            </Collapse>

            <View
              style={{
                borderBottomColor: '#9e9e9e',
                borderBottomWidth: 0.5,
                marginHorizontal: 10,
                marginTop: 10,
              }}
            />
            <Collapse style={{ padding: 15, marginTop: 10 }}>
              <CollapseHeader>
                <View flexDirection="row" justifyContent="space-between">
                  <Text style={{ fontSize: 16 }}>Environment & Material</Text>
                  <Icon
                    style={{ color: 'black', fontSize: 22 }}
                    name="chevron-down"
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <Text style={{ marginTop: 15, color: 'grey' }}>
                  The Durability Certified badge is applied on products which
                  have been tested by independent laboratories certified by the
                  National Accreditation Board for Testing and Calibration
                  Laboratories (NABL).
                </Text>
              </CollapseBody>
            </Collapse>
            <View
              style={{
                borderBottomColor: '#9e9e9e',
                borderBottomWidth: 0.5,
                marginHorizontal: 10,
                marginTop: 10,
              }}
            />
            <Collapse style={{ padding: 15, marginTop: 10 }}>
              <CollapseHeader>
                <View flexDirection="row" justifyContent="space-between">
                  <Text style={{ fontSize: 16 }}>Good to know</Text>
                  <Icon
                    style={{ color: 'black', fontSize: 22 }}
                    name="chevron-down"
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <CollapseBody>
                  <Text style={{ marginTop: 15, color: 'grey' }}>
                    The Durability Certified badge is applied on products which
                    have been tested by independent laboratories certified by
                    the National Accreditation Board for Testing and Calibration
                    Laboratories (NABL).
                  </Text>
                </CollapseBody>
              </CollapseBody>
            </Collapse>
            <View
              style={{
                borderBottomColor: '#9e9e9e',
                borderBottomWidth: 0.5,
                marginHorizontal: 10,
                marginTop: 10,
              }}
            />
            <Collapse style={{ padding: 15, marginTop: 10 }}>
              <CollapseHeader>
                <View flexDirection="row" justifyContent="space-between">
                  <Text style={{ fontSize: 16 }}>
                    Assembly instruction/documents{' '}
                  </Text>
                  <Icon
                    style={{ color: 'black', fontSize: 22 }}
                    name="chevron-down"
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <CollapseBody>
                  <Text style={{ marginTop: 15, color: 'grey' }}>
                    The Durability Certified badge is applied on products which
                    have been tested by independent laboratories certified by
                    the National Accreditation Board for Testing and Calibration
                    Laboratories (NABL).
                  </Text>
                </CollapseBody>
              </CollapseBody>
            </Collapse>
            <View
              style={{
                borderBottomColor: '#9e9e9e',
                borderBottomWidth: 0.5,
                marginHorizontal: 10,
                marginTop: 10,
              }}
            />
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Review')}>
            <View
              style={{
                height: 50,
                width: 75,
                alignSelf: 'center',
                alignItems: 'center',
                borderColor: '#c62828',
                borderRadius: 5,
                marginStart: 17,
                marginBottom: 20,
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Icon
                style={{ color: '#c62828', fontSize: 26 }}
                name="heart-outline"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CartItem')}>
            <View
              style={{
                height: 50,
                width: 270,
                marginStart: 15,
                alignSelf: 'center',
                alignItems: 'center',
                backgroundColor: '#B72304',
                borderRadius: 5,
                marginBottom: 20,

                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 17,
                  color: 'white',
                }}>
                Add to Cart
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
