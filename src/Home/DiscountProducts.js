import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import Animated from 'react-native-reanimated';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { BottomModalProvider, useBottomModal } from 'react-native-bottom-modal'
import { fetchDiscountedProducts, fetchSubSubCategoryProductsUrl, getProductsFormBrandIdUrl, getProductsFormCollectionIdUrl, supplierId } from '../../Config/Constants';
import Axios from 'axios';
// import { supplierId } from '../config/constants';
import { connect } from 'react-redux';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteOneItemFromCart, editDefaultVariant, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../config/GlobalContants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import BottomCart from '../Components/BottomCart';
const { Value, timing } = Animated
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        supplier: state.supplier,
        login: state.login,
        user: state.user,
        favourites: state.favourites,
        abandonedCheckout: state.abandonedCheckout,
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
    deleteAbandoneId: () => dispatch(deleteAbandoneId())
});


class DiscountProducts extends Component {
    constructor(props) {
        super(props);
        this._scroll_y = new Value(0);
        this._isMounted = false;
        this.state = {
            isProductLoading: false,
            currentPageForPagination: 1,
            bottomOneLoader: false,
            allProducts: [],
            firstRun: true

        }
    }

    async componentDidMount() {
        this._isMounted = true;
        this.props.deleteAllDefaultVarinats();
        this.fetchDiscountedProducts(1);

    }
    fetchDiscountedProducts = async (pageNum) => {
        var url = fetchDiscountedProducts(pageNum);
        console.log('fetching all brands', url, 'pagenum', pageNum);
        pageNum === 1
            ? this.setState({ isProductLoading: true })
            : this.setState({ isPaginating: true });
        if (this.state.firstRun) {
            this.setState({ firstRun: false })
            this.props.deleteAllDefaultVarinats();
        }
        this.setState({ bottomOneLoader: true });
        console.log('url of brands details', url);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log(
                    ' discount products from server on brand Product Listing',
                    JSON.stringify(response.data.object),
                );
                this.setState({
                    isProductLoading: false,
                    isPaginating: false,
                    allProducts: [
                        ...this.state.allProducts,
                        ...response.data.object,
                    ],
                });

                response.data.object.length < 12
                    ? this.setState({ bottomOneLoader: false })
                    : null;

                this.props.createDefaultVariants(response.data.object);
            })
            .catch((err) => {
                this.setState({ allBrandProducsLoading: false, bottomOneLoader: false });
                // console.log(err);
            });
    };

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
                    centerComponent={{ text: 'OFFERS' }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                {/* <Animated.View style={[styles.header,
                {
                    height: _header_height,
                    transform: [{ translateY: _header_translate_y }],
                    opacity: _header_opacity
                }
                ]}>

                    <View style={{ backgroundColor: '#fff', flex: 1, paddingVertical: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Sort')} style={{ padding: 5, width: '50%', alignItems: 'center', }}>
                                <Text style={{ textAlignVertical: 'center', fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, textAlign: 'center', textTransform: 'uppercase' }}>sort</Text>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#C2C2C2', width: 1 }} />
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter')} style={{ padding: 5, width: '50%', alignItems: 'center' }}>
                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, textAlign: 'center', textTransform: 'uppercase' }}>filter</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Animated.View> */}

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
                    <View style={{ bottom: 1, backgroundColor: '#fff' }}>
                        <TouchableOpacity style={{ height: 50, width: '95%', padding: 5, alignSelf: 'center', }} onPress={() => this.props.navigation.navigate('Search')}>
                            <View style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: Colors.placeholder, padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: Colors.placeholder }}>
                                <Text style={{ color: 'grey', alignSelf: 'center', paddingStart: 10 }}>
                                    Search Products...
                                    </Text>
                                <MCIcon name="magnify" size={20} color="grey" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
                        {this.state.isProductLoading ? null : <View>
                            <Text style={{ fontFamily: 'sans-serif-light', fontSize: 12, fontWeight: 'bold', paddingTop: 5, paddingLeft: 5 }}>{this.state.allProducts.length} {this.state.allProducts.length === 1 ? 'Product' : 'Products'}</Text>
                        </View>}
                        <View>
                            {this.state.isProductLoading ?
                                <FlatList data={[1, 2, 3, 4]}
                                    numColumns={2} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                        // console.log('collection products', JSON.stringify(item))
                                        return (
                                            <View>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2.1, paddingTop: 10, padding: 5 }} >
                                                    <ImageBackground borderRadius={10} style={{ height: 130, width: '100%', backgroundColor: '#efefef' }}>
                                                        <View style={{ alignSelf: 'flex-end', padding: 8 }}>


                                                            <Icon name="heart-outline" style={{ backgroundColor: '#efefef' }} type="ionicon" size={20} color="#464442" />
                                                        </View>
                                                        {/* <View style={{ padding: 10, width: '55%', borderRadius: 5, paddingTop: '35%' }}>
                                                        <Text style={{ borderRadius: 5, textAlign: 'center', backgroundColor: 'red', color: '#fff', fontSize: 10, padding: 3 }}>{item.tag}</Text>
                                                    </View> */}
                                                    </ImageBackground>
                                                    <View style={{ padding: 5 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 13, color: Colors.primary, backgroundColor: '#efefef' }}></Text>
                                                            <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', textDecorationLine: 'line-through', backgroundColor: '#efefef' }}></Text>
                                                        </View>
                                                        <Text ellipsizeMode="tail" numberOfLines={2} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '80%', backgroundColor: '#efefef' }}></Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{}} />
                                    )} />
                                : <FlatList data={this.state.allProducts}
                                    onEndReached={() => {
                                        if (this.state.bottomOneLoader) {
                                            this.fetchDiscountedProducts(
                                                this.state.currentPageForPagination + 1

                                            )

                                            this.setState({
                                                currentPageForPagination:
                                                    this.state.currentPageForPagination + 1,
                                            });
                                        }
                                    }}
                                    onEndReachedThreshold={0.5}
                                    ListFooterComponent={this.state.bottomOneLoader ? <View>
                                        <ActivityIndicator size={'small'} color={Colors.primary} style={{ alignSelf: 'center' }} />
                                    </View> : null}
                                    numColumns={2} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
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
                                        console.log('discounted products', JSON.stringify(item?.productListings[0].medias[0]?.mediaUrl))
                                        return (
                                            <View style={{ width: Dimensions.get('window').width / 2.1, boredrColors: '#efefef', paddingTop: 10, padding: 5 }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })}  >
                                                    <ImageBackground borderRadius={10} source={{ uri: item?.productListings[0].medias[0]?.mediaUrl }} style={{ height: 130, width: '100%' }}>
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
                                                        <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '95%' }}>{item?.name}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 13, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
                                                            <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', textDecorationLine: 'line-through' }}>₹{item.productListings[0]?.mrp}</Text>
                                                        </View>
                                                        {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#000', }}>Save ₹ {Math.round((productListingndex === -1
                                                            ? item.productListings[0].mrp
                                                            : item.productListings[productListingndex]
                                                                .mrp) -
                                                            (productListingndex === -1
                                                                ? item.productListings[0].sellingPrice
                                                                : item.productListings[productListingndex]
                                                                    .sellingPrice))}</Text>}
                                                    </View>
                                                </TouchableOpacity>
                                                {indexOfProductInCart === -1 ? (
                                                    <TouchableOpacity
                                                        style={{ width: '90%', marginHorizontal: 10 }}

                                                        onPress={async () => {
                                                            var currentItem = JSON.parse(
                                                                JSON.stringify(item),
                                                            );
                                                            currentItem.productCountInCart = 1;

                                                            currentItem.indexOfselectedVariant = productListingndex;


                                                            currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                                                                index
                                                            ];
                                                            currentItem.priceOfVariantSelectedByCustomer =
                                                                productListingndex === -1
                                                                    ? item.productListings[0].sellingPrice
                                                                    : item.productListings[productListingndex]
                                                                        .sellingPrice;
                                                            this.props.addOneItemToCart(currentItem);
                                                        }}>
                                                        <Text
                                                            style={{
                                                                borderWidth: 1,
                                                                paddingHorizontal: 18,
                                                                paddingVertical: 8,
                                                                borderColor: '#e1e1e1',
                                                                textAlign: 'center',
                                                                fontSize: 12,
                                                                width: '100%',
                                                                fontWeight: 'bold',
                                                                backgroundColor: Colors.primary,
                                                                color: '#fff'
                                                            }}>
                                                            ADD TO CART
                                </Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                        <View style={{
                                                            flexDirection: 'row', width: '95%', alignSelf: 'center'
                                                        }}>
                                                            <View
                                                                style={{
                                                                    width: '100%',
                                                                    height: 35,
                                                                    flexDirection: 'row',
                                                                    color: '#fff',
                                                                    borderWidth: 1,
                                                                    borderColor: '#e1e1e1',
                                                                }}>
                                                                <TouchableOpacity
                                                                    style={{ backgroundColor: Colors.primary, alignContent: 'center', width: '32%' }}
                                                                    onPress={async () => {

                                                                        this.props.decreaseProductCount(
                                                                            item.id,
                                                                            this.props.defaultVariants
                                                                                .defaultVariants[index],
                                                                        )
                                                                    }
                                                                    }>
                                                                    <MCIcon
                                                                        name={'minus'}
                                                                        style={{
                                                                            alignSelf: 'center',
                                                                            height: 25,
                                                                            // width: 30,
                                                                            paddingVertical: 8,
                                                                            marginHorizontal: 5,
                                                                        }}
                                                                        color={'#fff'}
                                                                        size={15}
                                                                    />
                                                                </TouchableOpacity>
                                                                <Text
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        width: '36%',
                                                                        alignSelf: 'center',

                                                                        fontWeight: 'bold',
                                                                    }}>
                                                                    {
                                                                        this.props.cart.cart[indexOfProductInCart]
                                                                            .productCountInCart
                                                                    }
                                                                </Text>
                                                                <TouchableOpacity
                                                                    style={{ backgroundColor: Colors.primary, alignContent: 'center', width: '32%' }}
                                                                    onPress={() => {
                                                                        if (
                                                                            this.props.cart.cart[
                                                                                indexOfProductInCart
                                                                            ].productCountInCart <
                                                                            item.productListings[productListingndex]
                                                                                .inStockQuantity
                                                                        ) {
                                                                            this.props.increaseProductCount(
                                                                                item.id,
                                                                                this.props.defaultVariants
                                                                                    .defaultVariants[index],
                                                                            );
                                                                        } else {
                                                                            toast(
                                                                                'You have reached the maximum order quantity for this product!',

                                                                            );

                                                                        }
                                                                    }}>
                                                                    <MCIcon
                                                                        name={'plus'}
                                                                        style={{
                                                                            alignSelf: 'center',
                                                                            justifyContent: 'center',

                                                                            height: 28,
                                                                            // width: 30,
                                                                            paddingHorizontal: 5,
                                                                            paddingVertical: 8,
                                                                        }}
                                                                        color={'#fff'}
                                                                        size={15}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )}
                                            </View>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{}} />
                                    )} />}
                        </View>
                    </View>
                </Animated.ScrollView>
                {this.props.cart.cart.length > 0 && <BottomCart moveTo={() => this.props.navigation.navigate('Cart')} />}
            </View>
        )

    }
}


const styles = StyleSheet.create({
    header: {
        top: 1
    },
    scrollview: {
        flex: 1
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(DiscountProducts)