/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { connect } from 'react-redux'
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, editDefaultVariant, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { toast } from '../Functions/functions';
import LottieView from 'lottie-react-native';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    favourites: state.favourites,
    defaultVariants: state.defaultVariants,
    login: state.login,
    visitedProfileOnes: state.visitedProfileOnes,
    addresses: state.addresses,
    nearestSupplier: state.nearestSupplier,
    abandonedCheckout: state.abandonedCheckout,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addOneItemToCart: (item) => dispatch(addOneItemToCart(item)),
  createDefaultVariants: (allProducts) =>
    dispatch(createDefaultVariants(allProducts)),
  deleteAllDefaultVarinats: () => dispatch(deleteAllDefaultVarinats()),
  editDefaultVariant: (newVariant, indexOfProduct) =>
    dispatch(editDefaultVariant(newVariant, indexOfProduct)),
  increaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(increaseProductCount(productId, variantSelectedByCustomer)),
  decreaseProductCount: (productId, variantSelectedByCustomer) =>
    dispatch(decreaseProductCount(productId, variantSelectedByCustomer)),
  addOneFavourite: (item) => dispatch(addOneFavourite(item)),
  removeOneFavourite: (productId) => dispatch(removeOneFavourite(productId)),
  addAbondonedId: (id) => dispatch(addAbondonedId(id)),
  deleteAbandoneId: () => dispatch(deleteAbandoneId())
});
class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  async componentDidMount() {
    this.props.deleteAllDefaultVarinats();
    await this.props.createDefaultVariants(this.props.favourites.products);
  }
  componentWillUnmount() {
    this.props.deleteAllDefaultVarinats();

  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        {/* <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'Whishlist' }}
          rightComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Cart')} iconName='cart-outline' iconType="ionicon" iconColor="#000" iconSize={25} showCart={true} />}
        /> */}
        <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'My Wishlist' }}
          rightComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Cart')} showCart iconName='cart-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
        />

        {this.props.favourites.products.length > 0 ? <View style={{ flex: 1, padding: 5 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: '5%' }}>
            <Text style={{ color: '#4A4949', fontSize: 12, fontWeight: 'bold', fontFamily: 'sans-serif-light', textTransform: 'uppercase' }}>{this.props.favourites.products.length} {this.props.favourites.products.length == 1 ? 'PRODUCT' : 'Products'}</Text>
          </View>
          <View style={{ flex: 1, paddingBottom: 5 }}>
            <FlatList data={this.props.favourites.products} keyExtractor={(item, index) => String(index)} showsVerticalScrollIndicator={false} renderItem={({ item, index }) => {
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
              console.log('produccc', productListingndex)
              return (
                <View style={{ backgroundColor: '#fff', padding: 8, flex: 1 }}>
                  <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: '#E8E8E8', paddingBottom: '4%' }}>
                    <View style={{ flexDirection: 'row', }}>
                      <View>
                        <Image source={{ uri: item.productListings[0]?.medias[0]?.mediaUrl }} style={{ height: 90, width: 90 }} />
                      </View>
                      <View style={{ paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'sans-serif-light', color: '#4A4949', fontWeight: 'bold', fontSize: 13, width: '70%' }}>{item.name}</Text>
                          <Icon onPress={() => {
                            this.props.removeOneFavourite(item.id);
                          }} name="heart" color={Colors.primary} style={{ right: 5 }} size={25} type="ionicon" />
                        </View>
                        <View style={{}}>
                          <Text style={{ fontFamily: 'sans-serif-light', fontSize: 10, textDecorationLine: 'line-through' }}>₹ {productListingndex === -1
                            ? item.productListings[0].mrp
                            : item.productListings[productListingndex]
                              .mrp}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                            <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14 }}>₹ {productListingndex === -1
                              ? item.productListings[0].sellingPrice
                              : item.productListings[productListingndex]
                                .sellingPrice}</Text>
                            <Text style={{ fontFamily: 'sans-serif-light', fontSize: 11, color: '#3B3838', paddingLeft: 10 }}>(Saved ₹ {(productListingndex === -1
                              ? item.productListings[0].mrp
                              : item.productListings[productListingndex]
                                .mrp) -
                              (productListingndex === -1
                                ? item.productListings[0].sellingPrice
                                : item.productListings[productListingndex]
                                  .sellingPrice)})</Text>
                          </View>
                          <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, textTransform: 'capitalize' }}>Limited Time Offer</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{ paddingVertical: 10 }} >

                    {indexOfProductInCart === -1 ? <Text onPress={async () => {
                      var currentItem = JSON.parse(
                        JSON.stringify(item),
                      );
                      currentItem.productCountInCart = 1;
                      currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                        index
                      ]; currentItem.indexOfselectedVariant = productListingndex;
                      currentItem.priceOfVariantSelectedByCustomer =
                        productListingndex === -1
                          ? item.productListings[0].sellingPrice
                          : item.productListings[
                            productListingndex
                          ].sellingPrice;
                      await this.props.addOneItemToCart(currentItem);
                      this.addAbondonedData()
                    }} style={{ textTransform: 'uppercase', fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>Add to cart</Text> :
                      <Text onPress={async () => { toast('Already Added to cart') }} style={{ textTransform: 'uppercase', fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>Added to cart</Text>}
                  </View>
                </View>
              )
            }} ItemSeparatorComponent={() => (
              <View style={{ paddingVertical: 7 }} />
            )} />
          </View>
        </View> :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <LottieView source={require('../assets/bookmark.json')} autoPlay loop style={{ width: '100%', height: 200 }} />
            </View>
            <Text style={styles.heading}>There are No Products in your Whishlist</Text>
            <Text style={styles.subHeading}>Want to add Products click here</Text>
            <TouchableOpacity style={{ borderColor: '#000', borderWidth: 2, padding: 10, top: 10, borderRadius: 5 }} onPress={() => this.props.navigation.navigate('Home')} >
              <Text style={{ fontWeight: 'bold', color: '#000', textTransform: 'uppercase', textAlign: 'center' }}>See Products</Text>
            </TouchableOpacity>

          </View>

        }

      </View>
    );
  }

}

const styles = StyleSheet.create({
  headline: { alignSelf: 'center', color: 'black', fontWeight: 'bold' },
  icon: { marginHorizontal: 15, marginTop: 15, fontSize: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
  flatistview: {
    flexDirection: 'column',
    marginVertical: 1,
    padding: 5,
    elevation: 0.5,
    borderWidth: 0.1,
    marginHorizontal: 1,
    height: 340,
  },
  img: {
    height: 200,
    width: 180,
  },
  title: {
    paddingStart: 5,
    marginTop: 5,
    fontSize: 16,
    color: 'black',
  },
  subtittle: { color: 'grey', paddingStart: 5, width: 180 },
  iconcart: {
    height: 22,
    marginTop: 15,
    marginEnd: 15,
    width: 22,
  },
  bag: {
    alignSelf: 'center',
    marginTop: 15,
    color: '#b71c1c',
    fontWeight: 'bold',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'lightgray',
    textAlign: 'center',

  },
  subHeading: {
    fontSize: 15,
    color: 'lightgray',
    textAlign: 'center'
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Wishlist)