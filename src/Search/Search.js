/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  ToastAndroid,
  FlatList
} from 'react-native';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import Animated from 'react-native-reanimated';
import Ico from 'react-native-vector-icons/MaterialIcons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { addSearchQueries, addSubsCat, deleteSearchQueries, deleteSubsCat } from '../Redux/Cart/ActionCreators';
import { searchUrl, supplierId } from '../../Config/Constants';
import { toast } from '../Functions/functions';
import { Colors } from '../config/GlobalContants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const { Value, timing } = Animated
const mapStateToProps = (state) => {
  return {
    supplier: state.supplier,
    searchQueries: state.searchQueries,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addSearchQueries: (item) => dispatch(addSearchQueries(item)),
  deleteSearchQueries: () => dispatch(deleteSearchQueries()),
  addSubsCat: (catId) => dispatch(addSubsCat(catId)),
  deleteSubsCat: () => dispatch(deleteSubsCat()),
});


class Search extends Component {
  constructor(props) {
    super(props);
    this._scroll_y = new Value(0);
    this.state = {
      searchResults: [],
      searchKey: '',
      isSearching: false,
      errInSearch: false,
      errMessage: '',
      noProductFound: false,
      productIdsWithBrandName: [],
      allProductIds: [],
      brandNames: [],
      impureBrandNames: [],
      brandNamesAndIds: [],
      keyword: [
        { tag: "Accent Chairs" },
        { tag: "Sofas" },
        { tag: "Tables" },
        { tag: "Modular Kitchen" },
        { tag: "Bar Stoles" },
        { tag: "Gardern Chairs" },
        { tag: "Standing Chairs" },
        { tag: "Living Furniture" },
        { tag: "Office Furniture" },
      ]
    }
  }

  search = async (searchKey) => {
    if (searchKey.length < 4) {
      this.setState({
        searchKey: searchKey,
      });

      searchKey.length == 2
        ? toast(
          'Enter atleast three characters.',

        )
        : null;

      // console.log('length less then 4');

      return;
    } else {
      // console.log('Inside Search\nSearch key ->', searchKey);
      this.setState({
        isSearching: true,
        searchKey: searchKey,
        errInSearch: false,
        errMessage: '',
      });

      var url = searchUrl(searchKey, supplierId);

      await Axios.get(url, {
        headers: {
          Authorization: 'bearer ' + '',
          'Content-type': 'application/json',
        },
      })
        .then((response) => {
          // console.log('Search data->', response.data);
          response.data.length === 0
            ? this.setState({ noProductFound: true })
            : null;
          this.setState({
            searchResults: response.data,
            isSearching: false,
            errInSearch: false,
          });

          this.createAdvancedSearch(response.data, searchKey);

        })
        .catch((error) => {
          this.setState({
            isSearching: false,
            errInSearch: true,
            errMessage: error.message,
          });
          console.log('Error in searching', error);
        });
    }
  };

  createAdvancedSearch = (searchResult, searchKey) => {
    var productIdsWithBrandName = [];
    var allProductIds = [];
    var brandNames = [];
    var brandNamesAndIds = [];
    searchResult.map((it, ind) => {
      allProductIds.push(it.productId);
      if (
        it.brandName &&
        it.brandName.toUpperCase().includes(searchKey.toUpperCase())
      ) {
        productIdsWithBrandName.push(it.productId);
        brandNames.push(it.brandName);
      }

      var indexOfBrandinTheArray = brandNamesAndIds.findIndex(
        (x, y) => x.name === it.brandName,
      );
      if (indexOfBrandinTheArray === -1) {
        brandNamesAndIds.push({ name: it.brandName, ids: [it.productId] });
      } else {
        brandNamesAndIds[indexOfBrandinTheArray].ids.push(it.productId);
      }
      // console.log('Here is advanced data', brandNamesAndIds);
    });
    this.setState({
      allProductIds: allProductIds,
      // productIdsWithBrandName: productIdsWithBrandName,
      // brandNames: Array.from(new Set(brandNames)),
      // impureBrandNames: brandNames,
      brandNamesAndIds: brandNamesAndIds,
    });

  };

  highlightSearchKey = (searchKey, itemName, brandName) => {
    // var newItem = itemName.split(searchKey);
    // console.log('Brandname', brandName, 'arckKey', searchKey);
    if (
      brandName &&
      brandName.toUpperCase().includes(searchKey.toUpperCase())
    ) {
      return (
        <Text numberOfLines={2}>
          <Text style={{ fontWeight: '700' }}>{brandName + ' : '}</Text>
          {itemName}
          {/* <Text style={{fontWeight: '700'}}>{searchKey}</Text>
            {newItem[1]} */}
        </Text>
      );
    }
    // if (itemName.toUpperCase().includes(searchKey.toUpperCase())) {
    //   return (
    //     <Text numberOfLines={2}>
    //       <Text style={{fontWeight: '700'}}>{brandName + ' : '}</Text>
    //       {itemName}
    //       {/* <Text style={{fontWeight: '700'}}>{searchKey}</Text>
    //       {newItem[1]} */}
    //     </Text>
    //   );
    // } else {
    //   return (
    //     <Text numberOfLines={2}>
    //       <Text style={{fontWeight: '700'}}>{brandName + ' : '}</Text>
    //       {itemName}
    //     </Text>
    //   );
    // }
    // } else {
    //   if (itemName.toUpperCase().includes(searchKey.toUpperCase())) {
    //     return (
    //       <Text numberOfLines={2}>
    //         {itemName}
    //         {/* <Text style={{fontWeight: '700'}}>{searchKey}</Text>
    //         {newItem[1]} */}
    //       </Text>
    //     );
    //   }
    else {
      return <Text numberOfLines={2}>{itemName}</Text>;
    }
  };

  renderSearchLoader = ({ item, index }) => {
    return (
      <View key={index} style={styles.loadingSearchResultStyle}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 10 }} />
        <View style={{ flex: 1 }} />
      </View>
    );
  };
  addToHistory = (name) => {
    console.log('add ame', name, this.props.searchQueries.data)
    var fName = "";

    this.props.searchQueries?.data.map((it, ind) => {
      console.log('it', it, name, it.toUpperCase().includes(name.toUpperCase()))
      if (it.toUpperCase().includes(name.toUpperCase())) {
        fName = "";
      } else {
        fName = name;
      }
    })
    if (fName !== "") {
      this.props.addSearchQueries(fName)
    }
    if (this.props.searchQueries.data.length === 0) {
      this.props.addSearchQueries(name)
    }
    console.log('tespp data', fName)
  }

  renderSearchResults = ({ item, index }) => {
    return (
      <View key={index} style={styles.searchResultStyle}>
        <View style={{ flex: 1 }}>
          <Ico
            name={'search'}
            // style={{alignSelf: 'center', color: 'gray'}}
            size={18}
          />
        </View>
        <View style={{ flex: 13 }}>
          <TouchableOpacity
            onPress={() => {

              if (item.category?.id == '832') {
                this.props.deleteSubsCat();
                this.props.addSubsCat(item.category?.id);
                this.props.navigation.navigate('SubsDetailList', {
                  product: {
                    id: item.productId,
                    name: item.productName,
                  }, from: 'Search'
                })
              } else {
                this.props.deleteSubsCat();
                this.addToHistory(item.productName)
                this.props.navigation.navigate('ProductDisplay', {
                  from: 'Search',
                  product: {
                    id: item.productId,
                    name: item.productName,
                  },
                });
              }

            }}>
            {this.highlightSearchKey(
              this.state.searchKey,
              item.productName,
              item.brandName,
            )}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ searchKey: item.productName });
              this.search(item.productName);
            }}>
            <Text style={{ fontSize: 20 }}>↖</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSearchError = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
        }}>
        <View style={{ marginVertical: 20 }}>
          <Image
            style={{
              height: 200,
              width: 200,
              alignSelf: 'center',
              color: '#efefef',
            }}
            source={require('../assets/networkError.png')}
          />
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: '#a7a7a7',
              fontSize: 21,
            }}>
            Error In Search
          </Text>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#a7a7a7',
              fontSize: 15,
              textAlign: 'center',
            }}>
            Either a network error occured or server maintainence is going on.
          </Text>
        </View>
        <View style={{ marginVertical: 20, width: SCREEN_WIDTH }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                searchResults: [],
                searchKey: '',
                isSearching: false,
                errInSearch: false,
                errMessage: '',
              })
            }
            style={{
              borderColor: Colors.primary,
              borderWidth: 1,
              padding: 10,
              marginHorizontal: 70,
            }}>
            <Text
              style={{
                color: Colors.primary,
                fontWeight: '700',
                alignSelf: 'center',
              }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderNoProductFound = () => {
    return (
      <View>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: '#a7a7a7',
              fontSize: 21,
            }}>
            No Product found
          </Text>
        </View>
      </View>
    );
  };

  renderBrandNames = ({ item, index }) => {
    console.log('brand', item.name)
    if (item.name === null) {
      return null;
    } else
      return (

        <View key={index} style={styles.searchResultStyle}>
          <View style={{ flex: 1 }}>
            <Ico name={'search'} size={18} />
          </View>
          <View style={{ flex: 9 }}>
            <TouchableOpacity
              onPress={() => {
                this.addToHistory(item.name)
                this.props.navigation.navigate('SearchProductListing', {
                  header: item.name,
                  productIds: item.ids,
                  brandsToBeshown: item.name,
                });

              }}>
              <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={{ fontSize: 12 }}>Brand</Text>
          </View>
        </View>
      );
  };
  renderSearchHistory = ({ item, index }) => {

    // if (item.name === null) {
    //     return null;
    // }
    if (index > 6) {
      return null;
    }
    else {
      return (
        <View key={index} style={{
          flex: 1,
          flexDirection: 'row',
          // height: 50,
          marginHorizontal: 20,
          borderBottomColor: '#efefef',
          borderBottomWidth: 1,
          paddingVertical: 15,
        }}>
          <View style={{ flex: 1 }}>
            {/* <Icon name="search" size={20} color="grey" type="ionicon"  /> */}
            <MIcon name="magnify" color={'#000'}
              size={20} />
          </View>
          <View style={{ flex: 9 }}>
            <TouchableOpacity
              onPress={() => {
                console.log('search key', item)
                // this.setState({ searchKey: item })
                this.search(item)
              }}>
              <Text style={{ fontWeight: '700' }}>{item}</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{ flex: 2 }}>
                <Text style={{ fontSize: 12 }}>Brand</Text>
            </View> */}
        </View>
      );
    }
  };

  renderClearHistory = () => {
    return (
      <View style={{ padding: 10, backgroundColor: '#f3f3f3', marginTop: 20 }}><Text onPress={() => this.props.deleteSearchQueries()} style={{ textAlign: 'center' }}>Clear History</Text></View>

    )
  }

  render() {
    const _diff_clamp_scroll_y = Animated.diffClamp(this._scroll_y, 0, 50);

    const _header_height = Animated.interpolate(_diff_clamp_scroll_y, {
      inputRange: [0, 50],
      outputRange: [50, 0],
      extrapolate: 'clamp'
    });

    const _header_translate_y = Animated.interpolate(_diff_clamp_scroll_y, {
      inputRange: [0, 50],
      outputRange: [0, -50],
      extrapolate: 'clamp'
    });

    const _header_opacity = Animated.interpolate(_diff_clamp_scroll_y, {
      inputRange: [0, 50],
      outputRange: [0.9, 0],
      extrapolate: 'clamp'
    });


    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'Search' }}
        />
        <View style={{ flex: 1 }}>
          <Animated.View style={[styles.header,
          {
            height: _header_height,
            transform: [{ translateY: _header_translate_y }],
            opacity: _header_opacity
          }
          ]}>
            <View style={{ backgroundColor: '#fff', flex: 1, padding: 5 }}>
              <View style={{ paddingHorizontal: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F3F3', paddingHorizontal: 10 }}>
                  <Icon name="search" color="#777777" size={20} type="ionicon" />
                  <TextInput onChangeText={(text) => {
                    this.search(text);
                  }}
                    value={this.state.searchKey} placeholder="Search Here..." style={{ height: 40, width: '99%', paddingLeft: 10, color: '#252525', }} />
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.ScrollView style={[styles.scrollview,]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={2}
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { y: this._scroll_y } }
              }
            ])}
          >

            <View style={{}}>
              {/* <View style={{}}>
                <Text style={{ fontFamily: 'sans-serif-ligh', fontWeight: 'bold', fontSize: 14, color: '#494949' }}>Hot Keywords</Text>
              </View> */}

              {/* <View style={{ paddingVertical: 10 }}> */}
              {/* <FlatList data={this.state.keyword} keyExtractor={(item, index) => String(index)} numColumns={3} renderItem={({ item }) => (
                  <View style={{ padding: 5 }}>
                    <TouchableOpacity style={{ padding: 5, borderColor: '#2E2E2E', borderWidth: 1, borderRadius: 3, width: Dimensions.get('window').width / 3.6, alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, textAlign: 'center', fontFamily: 'sans-serif-light', fontWeight: 'bold', color: '#464646', textAlignVertical: 'center' }}>{item.tag}</Text>
                    </TouchableOpacity>
                  </View>
                )} /> */}
              {/* </View> */}

              {this.state.searchKey.length >= 4 &&
                this.state.searchResults.length > 0 ? (
                  <>
                    <View style={styles.productListingButtonStyle}>
                      <View style={{ flex: 1, marginLeft: 20 }}>
                        <Ico name={'search'} size={18} />
                      </View>
                      <View style={{ flex: 9 }}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log(
                              'Impure brands name',
                              this.state.allProductIds,
                            );
                            this.addToHistory(this.state.searchKey)
                            this.props.navigation.navigate('SearchProductListing', {
                              header: this.state.searchKey,
                              productIds: this.state.allProductIds,
                              brandsToBeshown: '',
                            });
                          }}>
                          <Text style={{ fontWeight: '700' }}>
                            {this.state.searchKey}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flex: 3 }}>
                        <Text style={{ fontSize: 12 }}>Products</Text>
                      </View>
                    </View>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      style={{ backgroundColor: '#fff' }}
                      data={this.state.brandNamesAndIds}
                      renderItem={this.renderBrandNames}
                      keyExtractor={(item, index) => index.toString()}
                    />

                    <FlatList
                      showsVerticalScrollIndicator={false}
                      style={{ backgroundColor: '#fff' }}
                      data={
                        this.state.isSearching
                          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7]
                          : this.state.searchResults
                      }
                      renderItem={
                        this.state.isSearching
                          ? this.renderSearchLoader
                          : this.renderSearchResults
                      }
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </>
                ) :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{ backgroundColor: '#fff' }}
                  data={this.props.searchQueries.data.slice(0).reverse()}
                  renderItem={this.renderSearchHistory}
                  ListFooterComponent={this.props.searchQueries.data.length > 0 ? this.renderClearHistory : null}
                  keyExtractor={(item, index) => index.toString()}
                />}

              <View>
                {this.state.noProductFound && this.renderNoProductFound()}
                {this.state.errInSearch ? this.renderSearchError() : null}
              </View>
            </View>

          </Animated.ScrollView>


        </View>
      </View>
    );
  }


}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    minHeight: SCREEN_HEIGHT,
  },
  container: {
    // flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    marginLeft: -13.5,
    marginTop: 2,
    height: 42,
    width: 42,

    justifyContent: 'center',
    alignSelf: 'center',
  },
  backButton: {
    width: 18,
    height: 18,
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    // elevation: 2,
  },
  backButtonView: {
    height: 35,
    width: 35,

    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 18,
    marginHorizontal: 5,
    marginLeft: 10,
  },
  textInput: {
    width: (SCREEN_WIDTH / 10) * 5.7,
    // backgroundColor: '#efefef',
  },
  textInputView: {
    flex: 10,
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    right: 5,

    backgroundColor: '#f5f5f5',
    height: 42,
    borderRadius: 15,
    marginVertical: 15,
  },
  activityIndicator: {
    alignSelf: 'center',
  },
  searchResultStyle: {
    flex: 1,
    flexDirection: 'row',
    // height: 50,
    marginHorizontal: 20,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  loadingSearchResultStyle: {
    flex: 1,
    flexDirection: 'row',
    height: 20,
    marginVertical: 7,
    marginHorizontal: 20,
    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    paddingVertical: 15,
    backgroundColor: '#efefef',
  },
  productListingButtonStyle: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    borderBottomColor: '#efefef',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Search);