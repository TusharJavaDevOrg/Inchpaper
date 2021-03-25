import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  ToastAndroid,
  StatusBar,
  SafeAreaView,
  ImageBackground, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import { Badge } from 'react-native-elements';
import Axios from 'axios';

import I from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import {
  createDefaultVariants,
  deleteAllDefaultVarinats,
  editDefaultVariant,
  addOneItemToCart,
  deleteAllItemsFromCart,
  deleteOneItemFromCart,
  increaseProductCount,
  decreaseProductCount,
  addOneFavourite,
  removeOneFavourite,
  deleteAbandoneId,
  addAbondonedId,
  addSubsCat,
  deleteSubsCat,
} from '../Redux/Cart/ActionCreators';
import { getProductWithProductIdsUrl, supplierId, abondendCheckoutUrl, updateAbondendCheckoutUrl } from '../../Config/Constants';
import { createStringWithFirstLetterCapital, toast } from '../Functions/functions';
import { Header, MIcon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    defaultVariants: state.defaultVariants,
    supplier: state.supplier,
    abandonedCheckout: state.abandonedCheckout,
    login: state.login,
    user: state.user,
    favourites: state.favourites
  };
};

const mapDispatchToProps = (dispatch) => ({
  createDefaultVariants: (allProducts) =>
    dispatch(createDefaultVariants(allProducts)),
  deleteAllDefaultVarinats: () => dispatch(deleteAllDefaultVarinats()),
  editDefaultVariant: (newVariant, indexOfProduct) =>
    dispatch(editDefaultVariant(newVariant, indexOfProduct)),

  addOneItemToCart: (newProduct) => dispatch(addOneItemToCart(newProduct)),
  deleteAllItemsFromCart: () => dispatch(deleteAllItemsFromCart()),
  deleteOneItemFromCart: (index) => dispatch(deleteOneItemFromCart(index)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
  addOneFavourite: (item) => dispatch(addOneFavourite(item)),
  removeOneFavourite: (productId) => dispatch(removeOneFavourite(productId)),
  addAbondonedId: (id) => dispatch(addAbondonedId(id)),
  deleteAbandoneId: () => dispatch(deleteAbandoneId()),
  addSubsCat: (catId) => dispatch(addSubsCat(catId)),
  deleteSubsCat: () => dispatch(deleteSubsCat()),
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;

class SearchProductListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstRun: true,
      allBrandProducsLoading: false,
      allProducs: [],
      currentSubSubCategoryId: 0, //this holda the subSubCategoryId for the subSubCategory which is selected in sliding tabs panel
      varientsModalVisible: false,
      variantData: [],
      indexOfProduct: -1,
      currentPageForPagination: 1,
      bottomOneLoader: false,
    };
  }

  componentDidMount() {
    // console.log(
    //   'Here are the ids on liitg screen',
    //   this.props.route.params.productIds,
    // );
    this.fetchAllProductsUsingids(1);
  }

  componentWillUnmount() {
    this.props.deleteAllDefaultVarinats();
  }
  addAbondonedData = async (object) => {
    // dispatch(categoriesLoading());
    var url = abondendCheckoutUrl();
    var cartArray = [];
    await this.props.cart.cart.map((item, index) => {
      var indexOfVariantInProductListing = 0;
      item.productListings.map((x, y) => {
        if (x.variantValues[0] === item.variantSelectedByCustome) {
          indexOfVariantInProductListing = y;
        }
      });
      var selectedVariant = ""
      if (item.variantSelectedByCustome == undefined) {
        selectedVariant = "";
      } else {
        selectedVariant = item.variantSelectedByCustome;
      }
      var mediaUrl =
        item.medias &&
        item.medias[0] &&
        item.medias[0].mediaUrl &&
        item.medias[0].mediaUrl;
      console.log('media url at checkout', mediaUrl);
      var oneCartitemToBePosted = {
        productListingId:
          item.productListings[indexOfVariantInProductListing].id,
        productId: item.id,
        productName: item.name,
        sellingPrice: item.priceOfVariantSelectedByCustomer,
        mrp: item.productListings[indexOfVariantInProductListing].mrp,
        productDes: item.description,
        productImage: mediaUrl,
        quantity: item.productCountInCart,
        variantValues: selectedVariant,
        // tax: null,
        maxQuantityPerUser: item.maxOrderQty,
      };
      cartArray.push(oneCartitemToBePosted);
    });
    var body = {
      id: this.props.abandonedCheckout.id,
      abondenedCheckoutProductRequests: cartArray, supplier: supplierId,
      customerName: this.props.user.firstName
        ? this.props.user.firstName
        : this.props.login.userId,
      contactNo: this.props.user.phoneNumber,
      customer: this.props.login.userId,
    }
    console.log('AddAbandoned data', url, JSON.stringify(body));

    Axios.post(url, body, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then(response => {
        // console.log('No of abandoned request->', JSON.stringify(response.data));
        this.props.addAbondonedId(response.data.object[0]?.id)
      })
      .catch(error => {
        toast('Error while loading abandoned data');
        console.log('Error in fetching abandoned data', error.message);
      });
  };
  updateAbondendCheckout = () => {
    var url = updateAbondendCheckoutUrl(this.props.abandonedCheckout.id, 21);
    console.log('clear checkout data', url)
    Axios.put(url, {
      header: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      }
    }).then(response => {
      this.props.deleteAbandoneId();
      console.log('clear abandonedrequest', response.data);
    })
      .catch(error => {
        // errorToast('Error while loading abandoned data');
        console.log('Error in clearing abandoned state data', error.message);
      });
  }


  fetchAllProductsUsingids = async (pageNo) => {
    // this.setState({ allBrandProducsLoading: true });

    const { productIds } = this.props.route.params;
    var idsString = '';
    productIds.map((it, ind) => {
      idsString += 'ids=' + it + '&';
    });
    // console.log('Here is the awesomr string of ids', idsString);
    var url = getProductWithProductIdsUrl(
      idsString,
      supplierId,
      pageNo,
    );
    console.log(
      'Here is the url for fetching product using ids11',
      url,
      productIds.length,
    );

    if (this.state.firstRun) {
      this.setState({ firstRun: false });
      this.props.deleteAllDefaultVarinats();
    }
    this.setState({ bottomOneLoader: true });
    pageNo === 1
      ? this.setState({ allBrandProducsLoading: true })
      : this.setState({ isPaginating: true });
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        console.log(
          ' search products from server on search Product Listing',
          response.data.object,
        );
        this.setState({
          allBrandProducsLoading: false,
          isPaginating: false,
          allProducs: [...this.state.allProducs, ...response.data.object],
          // productsList: response.data.object,
        });
        response.data.object.length < 10
          ? this.setState({ bottomOneLoader: false })
          : null;
        this.props.createDefaultVariants(response.data.object);
      })
      .catch((err) => {
        this.setState({ allBrandProducsLoading: false });
        console.log(err);
      });
  };

  renderContent = () => {
    const { header } = this.props.route.params;
    const { brandsToBeshown } = this.props.route.params;

    return (
      <View style={{ backgroundColor: '#fff' }}>
        {this.state.allBrandProducsLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', marginTop: '50%' }}>
            <ActivityIndicator size="large" style={{ alignSelf: 'center', justifyContent: 'center' }} color={Colors.primary} />
          </View>
        ) : this.state.allProducs.length > 0 ? (
          <>
            <FlatList
              style={{ paddingTop: 10 }}
              data={this.state.allProducs}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (this.state.bottomOneLoader) {
                  this.fetchAllProductsUsingids(
                    this.state.currentPageForPagination + 1,
                  );
                  this.setState({
                    currentPageForPagination:
                      this.state.currentPageForPagination + 1,
                  });
                }
              }}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() =>
                this.state.bottomOneLoader ? (
                  <View>
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : null
              }
              progressViewOffset={80}
              numColumns={2}
              progressBackgroundColor="#40a71b"
              colors={['#fff']}
              renderItem={this.renderProducts}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: 25,
                  fontWeight: 'bold',
                  color: '#a7a7a7',
                  fontSize: 21,
                }}>
                No Product Available
              </Text>
            )}
      </View>
    );
  };

  renderProducts = ({ item, index }) => {
    // console.log('item images at search', item)
    const { header } = this.props.route.params;
    const { brandsToBeshown } = this.props.route.params;

    var productListingndex = item.productListings.findIndex(
      (x) =>
        x.variantValues[0] ===
        this.props.defaultVariants.defaultVariants[index],
    );

    var indexOfProductInCart = this.props.cart.cart.findIndex(
      (x) =>
        x.id === item.id &&
        x.variantSelectedByCustome ===
        this.props.defaultVariants.defaultVariants[index],
    );

    // if (item?.brand?.name.toUpperCase().includes(brandsToBeshown.toUpperCase())) {
    console.log('selll', item.productListings[0]?.sellingPrice - item.productListings[0]?.mrp)
    return (
      <View>
        <TouchableOpacity onPress={() => {
          console.log('item id', item.category)
          if (item.category?.id == '832') {
            this.props.deleteSubsCat();
            this.props.addSubsCat(item.category?.id);
            this.props.navigation.navigate('SubsDetailList', { product: item, from: 'productListing' })
          } else {
            this.props.deleteSubsCat();
            this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })
          }
        }
        } style={{ width: Dimensions.get('window').width / 2.01, paddingTop: 10, padding: 5, borderWidth: 0.5, borderColor: '#efefef' }} >
          <ImageBackground borderRadius={10} source={{ uri: item?.medias[0]?.mediaUrl }} resizeMethod="scale" resizeMode={'contain'} style={{ height: 130, width: '100%' }}>
            <View style={{ alignSelf: 'flex-end', padding: 8 }}>
              {this.props.favourites.products.findIndex(
                (it, ind) => it.id === item.id,
              ) === -1 ? (
                  <Icon onPress={() => {
                    this.props.addOneFavourite(item);
                  }} name="heart-outline" type="ionicon" size={20} color="#464442" />
                ) : (
                  <Icon onPress={() => {
                    this.props.removeOneFavourite(item.id);
                  }} name="heart" type="ionicon" size={20} color={Colors.primary} />
                )}
              {/* <Icon name="heart-outline" type="ionicon" size={20} color="#464442" /> */}
            </View>
            {/* <View style={{ padding: 10, width: '55%', borderRadius: 5, paddingTop: '35%' }}>
                                                            <Text style={{ borderRadius: 5, textAlign: 'center', backgroundColor: 'red', color: '#fff', fontSize: 10, padding: 3 }}>{item.tag}</Text>
                                                        </View> */}
          </ImageBackground>
          <View style={{ padding: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 13, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
              {item.productListings[0]?.mrp - item.productListings[0]?.sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', textDecorationLine: 'line-through' }}>₹{item.productListings[0]?.mrp}</Text>}
              {item.productListings[0]?.mrp - item.productListings[0]?.sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', }}>{Math.round(((item.productListings[0].mrp - item.productListings[0]?.sellingPrice) / item.productListings[0].mrp) * 100)}% OFF</Text>}
            </View>
            <Text ellipsizeMode="tail" numberOfLines={2} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '80%' }}>{item?.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

    // }
  };

  render() {
    const { header } = this.props.route.params;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        <View style={styles.container}>
          <Header backgroundColor="#fff"
            leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
            centerComponent={{ text: header }}
            rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressSearch={() => this.props.navigation.navigate('Search')} onPressCart={() => this.props.navigation.navigate('Cart')} />}
          />
          <View style={{ flex: 1 }}>{this.renderContent()}</View>
        </View>

      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchProductListing);

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: (SCREEN_WIDTH / 40) * 2,
  },
  goBackTouchable: {
    marginLeft: -13.5,
    marginTop: 2,
    height: 42,
    width: 42,
    borderRadius: 360,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goBackView: {
    height: 35,
    width: 35,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: '#ededed',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goBackImage: {
    width: 18,
    height: 18,
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 360,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    alignSelf: 'center',
    paddingLeft: 10,
    width: SCREEN_WIDTH - 130,
    color: '#000',
  },
  textInputView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height: 42,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ededed',
    width: (SCREEN_WIDTH / 40) * 36,
  },
  headerTextInput: {
    paddingLeft: 5,
    marginLeft: 5,
    alignSelf: 'center',
    height: 40,
    minWidth: 300,
  },
  container: {
    flex: 1,
    minHeight: SCREEN_HEIGHT,
  },
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: HEADER_HEIGHT,
    // marginHorizontal: 10,
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  titleStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
