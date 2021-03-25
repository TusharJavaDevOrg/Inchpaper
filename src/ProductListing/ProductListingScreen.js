import Axios from 'axios';
// import { supplierId } from '../config/constants';
import LottieView from 'lottie-react-native';
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { fetchSubCategoryProductsUrl, fetchSubSubCategoriesUrl, fetchSubSubCategoryProductsUrl, getProductsFormCollectionIdUrl, supplierId } from '../../Config/Constants';
import BottomCart from '../Components/BottomCart';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { Colors } from '../config/GlobalContants';
import { createDefaultVariantObject, toast } from '../Functions/functions';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteOneItemFromCart, editDefaultVariant, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
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


class ProductListingScreen extends Component {
    constructor(props) {
        super(props);
        this._scroll_y = new Value(0);
        this._isMounted = false;
        this.state = {
            isProductLoading: false,
            currentPageForPagination: 1,
            bottomOneLoader: false,
            allProducts: [],
            firstRun: true,
            isSubCatLoading: false,
            subSubCategories: [],
            currentSubCategoryIndex: -1
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        var id = this.props.route.params?.id;
        var from = this.props.route.params?.from;
        this.props.deleteAllDefaultVarinats();
        console.log('frommmm', from)
        if (from == 'Collection') {
            await this.fetchCollectionProducts(id, 1);
        } else if (from == 'Products') {
            const { subCatId, catId } = this.props.route.params;
            await this.fetchProductsFromThisSubcategory(1, subCatId, catId)
            await this.fetchSubsubCategories(catId, subCatId);
        }
    }
    componentWillUnmount() {
        this.props.deleteAllDefaultVarinats();
        this._isMounted = false;
    }
    fetchCollectionProducts = async (id, pageNum) => {
        this.setState({ isProductLoading: true, bottomOneLoader: true })
        if (this.state.firstRun) {
            this.setState({ firstRun: false });
            this.props.deleteAllDefaultVarinats();
        }
        var url = getProductsFormCollectionIdUrl(id, pageNum);
        console.log('product url', url)
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
        })
            .then(async (resp) => {
                // console.log('Collection Products', resp.data.object.length)
                this.setState({
                    allProducts: [...resp.data.object, ...this.state.allProducts],
                    isProductLoading: false,
                })
                resp.data.object.length < 10
                    ? this.setState({ bottomOneLoader: false })
                    : null;
                const finalArray = createDefaultVariantObject(resp.data.object)
                this.props.createDefaultVariants(finalArray);

            })
            .catch((err) => {
                console.log('Err in getting banners', err.message);
            });

    }
    fetchSubsubCategories = async (catId, subCatId) => {
        var url = fetchSubSubCategoriesUrl(
            subCatId,
            supplierId,
        );
        console.log('Fetching all products url in a SUB SUB CATEGORY', url);

        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
            // cancelToken: this.signal.token,
        })
            .then((response) => {
                // console.log(
                //     ' SubSubCategory products from server on prodictlisting length',
                //     JSON.stringify(response.data.object)
                // );
                if (this._isMounted) {
                    this.setState({
                        isSubCatLoading: false,
                        isPaginating: false,
                        subSubCategories: response.data.object,

                        // productsList: response.data.object,
                    });
                    // console.log('all sub sub category Products', JSON.stringify(response.data.object))

                }
            })
            .catch((err) => {
                this.setState({
                    isSubCatLoading: false,
                    subSubCategories: [],
                });
                console.log(
                    'error in loading sub sub category products',
                    err.message,
                );
            });
    }
    fetchProductsFromThisSubSubcategory = async (
        pageNum,
        subSubCatId,
        subCatId,
        catId,

    ) => {


        var url = fetchSubSubCategoryProductsUrl(
            pageNum,
            subSubCatId,
            subCatId,
            catId,
            supplierId,
        );
        console.log('Fetching all products url in a SUB SUB CATEGORY', url);
        if (this.state.firstRun) {
            this.setState({ firstRun: false });
            this.props.deleteAllDefaultVarinats();
        }
        this.setState({
            currentSubCategoryId: subSubCatId,
            bottomOneLoader: true,
        });

        pageNum === 1
            ? this.setState({ isProductLoading: true })
            : this.setState({ isPaginating: true }),
            await Axios.get(url, {
                headers: {
                    Authorization: 'bearer ' + ' ',
                    'Content-type': 'application/json',
                },
                // cancelToken: this.signal.token,
            })
                .then((response) => {
                    // console.log(
                    //     ' SubSubCategory products from server on prodictlisting length',
                    //     JSON.stringify(response.data.object)
                    // );
                    if (this._isMounted) {
                        this.state.currentPageForPagination === 1
                            ? this.setState({ allProducts: [] })
                            : null;
                        this.setState({
                            isProductLoading: false,
                            isPaginating: false,
                            allProducts: [
                                ...this.state.allProducts,
                                ...response.data.object,
                            ],
                            // productsList: response.data.object,
                        });
                        // console.log('all sub sub category Products', JSON.stringify(response.data.object))
                        response.data.object.length < 12
                            ? this.setState({ bottomOneLoader: false })
                            : null;

                        this.props.createDefaultVariants(response.data.object);
                    }
                })
                .catch((err) => {
                    this.setState({
                        allSubCategoryProductsLoading: false,
                        bottomOneLoader: false,
                    });
                    console.log(
                        'error in loading sub sub category products',
                        err.message,
                    );
                });
    };
    fetchProductsFromThisSubcategory = async (
        pageNum,
        subCatId,
        catId,

    ) => {


        var url = fetchSubCategoryProductsUrl(
            pageNum,
            subCatId,
            catId,
            supplierId,
        );
        console.log('Fetching all products url in a SUB SUB CATEGORY', url);
        if (this.state.firstRun) {
            this.setState({ firstRun: false });
            this.props.deleteAllDefaultVarinats();
        }
        this.setState({
            currentSubSubCategoryId: subCatId,
            bottomOneLoader: true,
        });

        pageNum === 1
            ? this.setState({ isProductLoading: true })
            : this.setState({ isPaginating: true }),
            await Axios.get(url, {
                headers: {
                    Authorization: 'bearer ' + ' ',
                    'Content-type': 'application/json',
                },
                // cancelToken: this.signal.token,
            })
                .then((response) => {
                    // console.log(
                    //     ' SubSubCategory products from server on prodictlisting length',
                    //     JSON.stringify(response.data.object)
                    // );
                    if (this._isMounted) {
                        this.state.currentPageForPagination === 1
                            ? this.setState({ allProducts: [] })
                            : null;
                        this.setState({
                            isProductLoading: false,
                            isPaginating: false,
                            allProducts: [
                                ...this.state.allProducts,
                                ...response.data.object,
                            ],
                            // productsList: response.data.object,
                        });
                        // console.log('all sub sub category Products', JSON.stringify(response.data.object))
                        response.data.object.length < 12
                            ? this.setState({ bottomOneLoader: false })
                            : null;

                        this.props.createDefaultVariants(response.data.object);
                    }
                })
                .catch((err) => {
                    this.setState({
                        allSubCategoryProductsLoading: false,
                        bottomOneLoader: false,
                    });
                    console.log(
                        'error in loading sub sub category products',
                        err.message,
                    );
                });
    };
    renderStickyHeader = () => {
        return (
            <View
                style={{

                    height: 50,
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        onPress={() => {
                            // this.signal.cancel('Api is being canceled');
                            // this.setSubSubCategoryIndex(-1);
                            this.setState({
                                fetchingAll: true,
                                currentPageForPagination: 1,
                                allProducts: [],
                                currentSubCategoryIndex: -1
                            });
                            const { catId, from, subCatId } = this.props.route.params;
                            this.props.deleteAllDefaultVarinats();
                            this.fetchProductsFromThisSubcategory(1, subCatId, catId,)

                        }}
                        style={
                            {
                                // borderBottomColor:
                                //   this.state.subSubCategoryIndex === -1 ? PrimaryColor : '#000',
                                // borderBottomWidth: 3,
                                // maxHeight: 50,
                            }
                        }>
                        <View style={styles.tabStyle}>
                            <Text
                                style={{
                                    color:
                                        this.state.currentSubCategoryIndex === -1 ? Colors.primary : '#000',
                                    borderBottomColor:
                                        this.state.currentSubCategoryIndex === -1 ? Colors.primary : '#fff',
                                    borderBottomWidth: 2,
                                    fontWeight: '700',
                                    fontSize: 12,
                                    padding: 14,
                                }}>
                                ALL
                  </Text>
                        </View>
                    </TouchableOpacity>
                    {this.state.isSubCatLoading
                        ? [1, 2, 3, 4, 5].map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.tabStyle,
                                        {
                                            maxHeight: 25,
                                            minWidth: 70,
                                            margin: 15,
                                            backgroundColor: '#efefef',
                                        },
                                    ]}
                                />
                            );
                        })
                        : this.state.subSubCategories.map((item, index) => {

                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {

                                        const { subCatId, catId } = this.props.route.params;
                                        // this.setSubSubCategoryIndex(index);
                                        this.setState({
                                            fetchingAll: false,
                                            currentPageForPagination: 1,
                                            allProducts: [],
                                            currentSubCategoryId: item.id,
                                            currentSubCategoryIndex: index,
                                        });
                                        this.props.deleteAllDefaultVarinats();

                                        this.fetchProductsFromThisSubSubcategory(
                                            1,
                                            item.id,
                                            subCatId,
                                            catId,
                                        );


                                    }}
                                    style={
                                        {
                                            // borderBottomColor:
                                            //   this.state.subSubCategoryIndex === index
                                            //     ? PrimaryColor
                                            //     : PrimaryColor,
                                            // borderBottomWidth: 3,
                                            // maxHeight: 50,
                                        }
                                    }>
                                    <View key={index} style={styles.tabStyle}>
                                        <Text
                                            style={{
                                                color:
                                                    this.state.currentSubCategoryIndex === index
                                                        ? Colors.primary
                                                        : '#000',
                                                borderBottomColor:
                                                    this.state.currentSubCategoryIndex === index ? Colors.primary : '#fff',
                                                borderBottomWidth: 2,
                                                fontWeight: '700',
                                                fontSize: 12,
                                                padding: 14,
                                            }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </ScrollView>

            </View>
        );
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
        const { from, catName } = this.props.route.params;
        if (from === "Collection") {
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                    <Header backgroundColor="#fff"
                        leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                        centerComponent={{ text: catName }}
                        rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressSearch={() => this.props.navigation.navigate('Search')} onPressCart={() => this.props.navigation.navigate('Cart')} />}
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
                            {this.state.allProducts.length > 0 && < View >
                                <Text style={{ fontFamily: 'sans-serif-light', fontSize: 12, fontWeight: 'bold', paddingTop: 5, paddingLeft: 5 }}>{this.state.allProducts.length} {this.state.allProducts.length === 1 ? 'Product' : 'Products'}</Text>
                            </View>}
                            <View>
                                {this.state.isProductLoading ?
                                    <FlatList data={[1, 2, 3, 4]}
                                        numColumns={2} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                            // console.log('collection products', JSON.stringify(item))
                                            return (
                                                <View>
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item.productResponse, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2.1, paddingTop: 10, padding: 5 }} >
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
                                                            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '95%', backgroundColor: '#efefef' }}></Text>
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
                                                const {
                                                    id,

                                                } = this.props.route.params;

                                                this.fetchCollectionProducts(
                                                    this.state.currentPageForPagination + 1,
                                                    id,

                                                )

                                                this.setState({
                                                    currentPageForPagination:
                                                        this.state.currentPageForPagination + 1,
                                                });
                                            }
                                        }}
                                        onEndReachedThreshold={0.5}
                                        ListFooterComponent={() => this.state.bottomOneLoader ? (<ActivityIndicator size="small" style={{ alignSelf: 'center' }} color={Colors.primary} />) : null}
                                        ListEmptyComponent={() => {
                                            return (
                                                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: '55%' }}>
                                                    <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 350, alignSelf: 'center' }} />
                                                    <Text style={{ textAlign: "center", fontSize: 24 }}>No Products Available</Text>
                                                </View>
                                            )
                                        }}
                                        numColumns={2} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                            var productListingndex = item.productResponse.productListings.findIndex(
                                                (x) =>
                                                    x.variantValues[0] ===
                                                    this.props.defaultVariants.defaultVariants[index],
                                            );

                                            var indexOfProductInCart = this.props.cart.cart.findIndex(
                                                (x) =>
                                                    x.id === item.productResponse.id &&
                                                    x.indexOfselectedVariant ===
                                                    productListingndex,

                                            );
                                            // console.log('collection products', JSON.stringify(item))
                                            return (
                                                <View style={{ width: Dimensions.get('window').width / 2.1, paddingTop: 10, padding: 5 }} >
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item.productResponse, from: 'productListing' })} >
                                                        <ImageBackground borderRadius={10} source={{ uri: item?.productResponse?.medias[0]?.mediaUrl }} style={{ height: 130, width: '100%' }}>
                                                            <View style={{ alignSelf: 'flex-end', padding: 8 }}>
                                                                {this.props.favourites.products.findIndex(
                                                                    (it, ind) => it.id === item.productResponse.id,
                                                                ) === -1 ? (
                                                                        <Icon onPress={() => {
                                                                            this.props.addOneFavourite(item.productResponse);
                                                                        }} name="heart-outline" type="ionicon" size={20} color="#464442" />
                                                                    ) : (
                                                                        <Icon onPress={() => {
                                                                            this.props.removeOneFavourite(item.productResponse.id);
                                                                        }} name="heart" type="ionicon" size={20} color={Colors.primary} />
                                                                    )}
                                                                {/* <Icon name="heart-outline" type="ionicon" size={20} color="#464442" /> */}
                                                            </View>
                                                            {/* <View style={{ padding: 10, width: '55%', borderRadius: 5, paddingTop: '35%' }}>
                                                        <Text style={{ borderRadius: 5, textAlign: 'center', backgroundColor: 'red', color: '#fff', fontSize: 10, padding: 3 }}>{item.tag}</Text>
                                                    </View> */}
                                                        </ImageBackground>
                                                        <View style={{ padding: 5 }}>
                                                            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '95%' }}>{item?.productResponse?.name}</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 13, color: Colors.primary }}>₹ {item.productResponse?.productListings[0]?.sellingPrice}</Text>
                                                                {item.productResponse?.productListings[0].mrp - item.productResponse?.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 10, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', textDecorationLine: 'line-through' }}>₹{item.productResponse?.productListings[0]?.mrp}</Text>}
                                                            </View>
                                                            {item.productResponse?.productListings[0].mrp - item.productResponse?.productListings[0].sellingPrice > 0 && <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#000', }}>Save ₹ {Math.round(item.productResponse?.productListings[0].mrp
                                                            ) -
                                                                (item.productResponse?.productListings[0].sellingPrice
                                                                )
                                                            }</Text>}
                                                        </View>
                                                    </TouchableOpacity>
                                                    {indexOfProductInCart === -1 ? (
                                                        <TouchableOpacity
                                                            style={{ width: '90%', marginHorizontal: 10 }}

                                                            onPress={async () => {
                                                                var currentItem = JSON.parse(
                                                                    JSON.stringify(item.productResponse),
                                                                );
                                                                currentItem.productCountInCart = 1;

                                                                currentItem.indexOfselectedVariant = productListingndex;


                                                                currentItem.variantSelectedByCustome = this.props.defaultVariants.defaultVariants[
                                                                    index
                                                                ];
                                                                currentItem.priceOfVariantSelectedByCustomer =
                                                                    productListingndex === -1
                                                                        ? item.productResponse.productListings[0].sellingPrice
                                                                        : item.productResponse.productListings[productListingndex]
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
                                                                                item.productResponse.id,
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
                                                                                item.productResponse.productListings[productListingndex]
                                                                                    .inStockQuantity
                                                                            ) {
                                                                                this.props.increaseProductCount(
                                                                                    item.productResponse.id,
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
                </View >
            )
        } else {
            console.log('sub sub categories', this.state.subSubCategories)
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                    <Header backgroundColor="#fff"
                        leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                        centerComponent={{ text: catName }}
                        rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressSearch={() => this.props.navigation.navigate('Search')} onPressCart={() => this.props.navigation.navigate('Cart')} />}
                    />
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
                    {this.renderStickyHeader()}
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


                        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
                            {this.state.allProducts.length > 0 && <View>
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
                                                            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontFamily: 'sans-serif-light', fontSize: 13, width: '95%', backgroundColor: '#efefef' }}></Text>
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
                                                const {
                                                    subCatId, catId

                                                } = this.props.route.params;

                                                this.fetchProductsFromThisSubcategory(
                                                    this.state.currentPageForPagination + 1,
                                                    subCatId, catId

                                                )

                                                this.setState({
                                                    currentPageForPagination:
                                                        this.state.currentPageForPagination + 1,
                                                });
                                            }
                                        }}
                                        onEndReachedThreshold={0.5}
                                        onEndReachedThreshold={0.5}
                                        ListFooterComponent={() => this.state.bottomOneLoader ? (<ActivityIndicator size="small" style={{ alignSelf: 'center' }} color={Colors.primary} />) : null}
                                        ListEmptyComponent={() => {
                                            if (this.state.bottomOneLoader) {
                                                return (
                                                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: '90%' }}>
                                                        <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 80, alignSelf: 'center' }} />
                                                        <Text style={{ textAlign: "center" }}>No Products Available</Text>
                                                    </View>
                                                )
                                            } else { return null }
                                        }}
                                        numColumns={2} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                            // console.log('collection products', JSON.stringify(item))
                                            var productListingndex = item.productListings.findIndex(
                                                (x) =>
                                                    x.variantValues[0] ===
                                                    this.props.defaultVariants.defaultVariants[index],
                                            );

                                            var indexOfProductInCart = this.props.cart.cart.findIndex(
                                                (x) =>
                                                    x.id === item.id &&
                                                    x.indexOfselectedVariant ===
                                                    productListingndex,

                                            );
                                            console.log('index of product', productListingndex, indexOfProductInCart)
                                            return (
                                                <View style={{ width: Dimensions.get('window').width / 2.1, paddingTop: 10, padding: 5, borderWidth: 0.8, borderColor: '#efefef' }}>
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })}>
                                                        <ImageBackground borderRadius={10} resizeMode="contain" source={{ uri: item?.productListings[0].medias[0]?.mediaUrl }} style={{ height: 180, width: '100%' }}>
                                                            <View style={{ alignSelf: 'flex-end', padding: 8, }}>
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
                                                            {/* <FastImage
                                                            style={{ width: '100%', height: 130, alignSelf: 'center', overflow: 'hidden' }}
                                                            source={{
                                                                uri: item?.productListings[0].medias[0]?.mediaUrl,

                                                                priority: FastImage.priority.normal,
                                                            }}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        /> */}
                                                            {/* <View style={{ padding: 10, width: '55%', borderRadius: 5, paddingTop: '35%' }}>
                                                            <Text style={{ borderRadius: 5, textAlign: 'center', backgroundColor: 'red', color: '#fff', fontSize: 10, padding: 3 }}>{item.tag}</Text>
                                                        </View> */}
                                                        </ImageBackground>
                                                        <View style={{ padding: 5 }}>
                                                            <Text ellipsizeMode="tail" numberOfLines={1} style={{ fontWeight: '600', fontSize: 13, width: '95%' }}>{item?.name}</Text>

                                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginVertical: 2 }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#A6A19E', textDecorationLine: 'line-through' }}>₹ {item.productListings[0]?.mrp}</Text>}
                                                                    <Text style={{ fontFamily: 'sans-serif-light', paddingLeft: 10, fontWeight: 'bold', fontSize: 13, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
                                                                </View>
                                                                {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: '#000', alignSelf: 'flex-end', }}> Save ₹ {Math.round(((item.productListings[0].mrp
                                                                ) -
                                                                    (item.productListings[0].sellingPrice
                                                                    ))
                                                                )}</Text>}
                                                            </View>
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
}


const styles = StyleSheet.create({
    header: {
        top: 1
    },
    scrollview: {
        flex: 1
    },


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
        backgroundColor: Colors.primary,
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
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },


})
export default connect(mapStateToProps, mapDispatchToProps)(ProductListingScreen)