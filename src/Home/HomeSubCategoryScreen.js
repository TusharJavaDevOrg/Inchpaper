import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet, ScrollView, FlatList, Dimensions, Linking } from 'react-native';
import { Header, SocialIcon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { List, Checkbox } from 'react-native-paper';
import { fetchCategoryFeaturedProductsUrl, fetchCategoryNewArrivalProductsUrl, fetchDiscountedCategoryProducts, fetchSubCategoriesUrl, fetchSubSubCategoriesUrl, getCategoryBrandsUrl, supplierId } from '../../Config/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Axios from 'axios';
import { createStringWithFirstLetterCapital, errorToast } from '../Functions/functions';
import { getPaymentMode, getReferalCode, getTimeSlots, logOut, profileVisitedOnes, reLogin } from '../Redux/Auth/ActionCreatore';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteOneItemFromCart, editDefaultVariant, getBrands, getCategorys, getNeedsBrands, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { connect } from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors } from '../config/GlobalContants';
import FastImage from 'react-native-fast-image';
import SocialScreen from '../Components/SocialIconScreen';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        brands: state.brands,
        defaultVariants: state.defaultVariants,
        login: state.login,
        visitedProfileOnes: state.visitedProfileOnes,
        addresses: state.addresses,
        nearestSupplier: state.nearestSupplier,
        supplier: state.supplier,
        categories: state.categories,
        selectData: state.selectData,
        deliverytime: state.deliverytime,
        favourites: state.favourites,
        paymentGateway: state.paymentGateway,
        abandonedCheckout: state.abandonedCheckout,
        timeslots: state.timeslots,
        user: state.user, subscriptionData: state.subscriptionData
    };
};

const mapDispatchToProps = (dispatch) => ({
    getPaymentMode: () => dispatch(getPaymentMode()),
    reLogin: (screenName) => dispatch(reLogin(screenName)),
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
    profileVisitedOnes: () => dispatch(profileVisitedOnes()),
    logOut: () => dispatch(logOut()),
    getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
    getCategorys: (supplId) => dispatch(getCategorys(supplId)),
    getBrands: (supplierId) => dispatch(getBrands(supplierId)),
    getNeedsBrands: (supplId) => dispatch(getNeedsBrands(supplId)),
    addOneFavourite: (item) => dispatch(addOneFavourite(item)),
    removeOneFavourite: (productId) => dispatch(removeOneFavourite(productId)),
    addAbondonedId: (id) => dispatch(addAbondonedId(id)),
    deleteAbandoneId: () => dispatch(deleteAbandoneId()),
    getTimeSlots: () => dispatch(getTimeSlots())
});
class HomeSubCategoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subCategoryData: [],
            subSubCategories: [],
            subSubCategoriesLoading: false,
            categoryData: [],
            selectdata: [],
            show_DropdownElements: false,
            current_dropdown_index: -1,
            selectedCategoryId: 0,
            isSubCategoryLoading: false,
            subCatIndex: -1,
            isFeaturedLoading: false,
            isNewLoading: false,
            isStyleLoading: false,
            isBrandLoading: false,
            featured: [],
            newArrivalsData: [],
            shopByStyleData: [],
            categoryBrands: [],

        };
    }
    componentDidMount() {
        console.log('isSubsssss at home', this.props.subscriptionData)
        var categoryId = this.props.route.params?.id;
        this.getSubCategoriesByCategoryIdFromServer(categoryId);
        this.getCategoryFeaturedProducts(categoryId, 1);
        this.getCategoryBrand(categoryId);
        this.getCategoryNewArrivalProducts(categoryId, 1);
        this.getDiscountedProducts(categoryId, 1);
    }
    getDiscountedProducts = async (categoryId, pageNum) => {
        pageNum === 1 ? this.setState({ featured: [], isStyleLoading: true }) : null;
        var url = fetchDiscountedCategoryProducts(pageNum, categoryId);

        console.log('Start Getting discounted CATEGORY from server', url, categoryId);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log('featured', JSON.stringify(response.data.object));
                this.setState({
                    shopByStyleData: [...this.state.shopByStyleData, ...response.data.object],
                    isStyleLoading: false,
                    networkError: false,

                });
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isStyleLoading: false, });
                // errorToast('Error while loading data');
                // }
                // //console.log('Error', error.message);
            });
    };
    getCategoryBrand = async (categoryId, pageNum) => {
        pageNum === 1 ? this.setState({ categoryBrands: [], isBrandLoading: true }) : null;
        var url = getCategoryBrandsUrl(supplierId, categoryId, pageNum);

        console.log('Start Getting brand CATEGORY from server', url, categoryId);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log('featured', JSON.stringify(response.data.object));
                this.setState({
                    categoryBrands: [...this.state.categoryBrands, ...response.data.object],
                    isBrandLoading: false,
                    networkError: false,

                });
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isBrandLoading: false, });
                // errorToast('Error while loading data');
                // }
                // //console.log('Error', error.message);
            });
    };
    getCategoryFeaturedProducts = async (categoryId, pageNum) => {
        pageNum === 1 ? this.setState({ featured: [], isFeaturedLoading: true }) : null;
        var url = fetchCategoryFeaturedProductsUrl(pageNum, categoryId, supplierId);

        console.log('Start Getting featured CATEGORY from server', url, categoryId);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log('featured', JSON.stringify(response.data.object));
                this.setState({
                    featured: [...this.state.featured, ...response.data.object],
                    isFeaturedLoading: false,
                    networkError: false,

                });
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isFeaturedLoading: false, });
                // errorToast('Error while loading data');
                // }
                // //console.log('Error', error.message);
            });
    };
    getCategoryNewArrivalProducts = async (categoryId, pageNum) => {
        pageNum === 1 ? this.setState({ newArrivalsData: [], isNewLoading: true }) : null;
        var url = fetchCategoryNewArrivalProductsUrl(pageNum, categoryId, supplierId);

        console.log('Start Getting new Arrival CATEGORY from server', url, categoryId);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log('new arrival', JSON.stringify(response.data.object.length));
                this.setState({
                    newArrivalsData: [...this.state.newArrivalsData, ...response.data.object],

                    isNewLoading: false,
                    networkError: false,

                });
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isNewLoading: false, });
                errorToast('Error while loading data');
                // }
                // //console.log('Error', error.message);
            });
    };
    getSubCategoriesByCategoryIdFromServer = async (categoryId, index) => {
        this.setState({ subCategoryData: [], isSubCategoryLoading: true });
        var url = fetchSubCategoriesUrl(categoryId, supplierId);

        console.log('Start Getting SUB CATEGORY from server', url, categoryId);
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                // console.log('getSubCategoriesByCategoryIdFromServer', JSON.stringify(response.data.object));
                this.setState({
                    subCategoryData: response.data.object,
                    show_DropdownElements: true,
                    isSubCategoryLoading: false,
                    networkError: false,
                    subCatIndex: index,
                });
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isSubCategoryLoading: false, });
                errorToast('Error while loading data');
                // }
                // //console.log('Error', error.message);
            });
    };
    navigate = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log("Don't know how to open URI: " + link);
            }
        });
    }
    fetchSubSubCategories = async (subCatId, index) => {
        // console.log('Here is the supplierSubCatId', subCatId, supplierId);
        var url = fetchSubSubCategoriesUrl(subCatId, supplierId);

        console.log('Fetching SUB SUB CATEGORIES', url);

        this.setState({ subSubCategoriesLoading: true, fetchingAll: true }),
            await Axios.get(url, {
                headers: {
                    Authorization: 'bearer ' + ' ',
                    'Content-type': 'application/json',
                },
            })
                .then((response) => {
                    console.log(
                        ' Sub sub cat from server on prodictlisting',
                        JSON.stringify(response.data.object),
                    );
                    this.setState({
                        subSubCategoriesLoading: false,
                        subSubCategories: response.data.object,
                        allSubCategoryProducts: [],
                        subCatIndex: index,
                    });
                })
                .catch((err) => {
                    this.setState({ subSubCategoriesLoading: false });
                    // console.log(err);
                });
    }
    render() {
        const { catName, data } = this.props.route.params;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: catName, style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ bottom: 1, backgroundColor: '#fff' }}>
                            <TouchableOpacity style={{ height: 50, width: '95%', padding: 5, alignSelf: 'center', }} onPress={() => this.props.navigation.navigate('Search')}>
                                <View style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: Colors.placeholder, padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: Colors.placeholder }}>
                                    <Text style={{ color: 'grey', alignSelf: 'center', paddingStart: 10 }}>
                                        Search Products...
                                    </Text>
                                    <Icon name="magnify" size={20} color="grey" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* ===== add banner ===== */}
                        {data?.bannerImageUrl && <View style={{ paddingVertical: 8 }}>

                            <FastImage
                                style={{ width: '100%', height: 200, alignSelf: 'center', }}
                                source={{
                                    uri: data?.bannerImageUrl,

                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                            />

                        </View>}

                        {/* ====== Sub-Category sub-list ===== */}
                        <View style={{ flex: 1 }}>
                            {this.state.isSubCategoryLoading ?
                                <FlatList data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} renderItem={this._renderItemLoader} />
                                :
                                <FlatList data={this.state.subCategoryData} keyExtractor={(item, index) => String(index)} renderItem={this._renderItem} />}
                        </View>

                        {/* ===== Maake a Statement ===== */}
                        {this.state.isFeaturedLoading ?
                            <View><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 10 }}>Featured Products</Text>
                                <View style={{ padding: 7 }}>
                                    <FlatList data={[1, 2, 3, 4]} horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {

                                        return (

                                            <TouchableOpacity style={{ width: Dimensions.get('window').width / 3, padding: 3, backgroundColor: '#fff', }}>
                                                <View style={{}}>
                                                    <Image style={{ height: 120, width: '100%', backgroundColor: '#c0c0c0' }} />
                                                    <Text style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', textTransform: 'uppercase', textAlign: 'center', paddingVertical: 5, backgroundColor: '#c0c0c0' }} ></Text>

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{ paddingHorizontal: 3 }} />
                                    )} />
                                </View></View>
                            : this.state?.featured.length > 0 ? (<>
                                <View><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 10 }}>Featured Products</Text>

                                    <FlatList data={this.state.featured} horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {

                                        return (

                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2.5, padding: 7 }}>
                                                <View style={{ backgroundColor: '#fff', }}>
                                                    {/* <Image source={{ uri: item.productListings[0].medias[0].mediaUrl }} style={{ height: 150, width: '100%' }} /> */}
                                                    <FastImage
                                                        style={{ width: '100%', height: 150, alignSelf: 'center', }}
                                                        source={{
                                                            uri: item?.productListings[0].medias[0]?.mediaUrl,

                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <View style={{ alignSelf: 'center', paddingVertical: 8, }}>
                                                        <Text style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', color: '#484848', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }} >{item.name}</Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', color: Colors.primary, textTransform: 'uppercase', textAlign: 'center' }}>₹{item.productListings[0].sellingPrice}</Text>
                                                            <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} >₹{item.productListings[0]?.mrp}</Text>
                                                            {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>Save ₹ {Math.round((
                                                                item.productListings[0].mrp) - (item.productListings[0].sellingPrice))}</Text>}
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }} />
                                </View>
                            </>
                            ) : null}

                        {/* ===== New Arrivals ===== */}
                        {this.state.isNewLoading ?
                            <><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 10 }}>New arrivals</Text>
                                <View style={{ padding: 7 }}>
                                    <FlatList data={[1, 2, 3, 4]} horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {

                                        return (

                                            <TouchableOpacity style={{ width: Dimensions.get('window').width / 3, padding: 3, backgroundColor: '#fff', }}>
                                                <View style={{}}>
                                                    <Image style={{ height: 120, width: '100%', backgroundColor: '#c0c0c0' }} />
                                                    <Text style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', textTransform: 'uppercase', textAlign: 'center', paddingVertical: 5, backgroundColor: '#c0c0c0' }} ></Text>

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{ paddingHorizontal: 3 }} />
                                    )} />
                                </View></>
                            : this.state.newArrivalsData.length > 0 ? <><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 10 }}>New arrivals</Text>
                                <View style={{ padding: 7 }}>
                                    <FlatList data={this.state.newArrivalsData} horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {

                                        return (

                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 3, padding: 3, backgroundColor: '#fff', }}>
                                                <View style={{}}>
                                                    {/* <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ height: 120, width: '100%' }} /> */}
                                                    <FastImage
                                                        style={{ width: '100%', height: 120, alignSelf: 'center', }}
                                                        source={{
                                                            uri: item?.productListings[0].medias[0]?.mediaUrl,

                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', textTransform: 'uppercase', textAlign: 'center', paddingVertical: 5 }} >{item.name}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
                                                        <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} >₹{item.productListings[0]?.mrp}</Text>
                                                        {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>Save ₹ {Math.round((
                                                            item.productListings[0].mrp) - (item.productListings[0].sellingPrice))}</Text>}
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }} ItemSeparatorComponent={() => (
                                        <View style={{ paddingHorizontal: 3 }} />
                                    )} />
                                </View></> : null}
                        {this.state.isStyleLoading ?
                            <FlatList data={this.state.shopByStyleData} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => {

                                return (
                                    <TouchableOpacity style={{ width: Dimensions.get('window').width / 2.2, padding: 5, borderRightWidth: 5, borderRightColor: '#efefef' }}>
                                        <View>
                                            <Image style={{ height: 150, width: '100%' }} />
                                            <View style={{ alignItems: 'center', paddingVertical: 5 }} >
                                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ width: '90%', textTransform: 'uppercase', fontWeight: 'bold', color: '#484848', fontFamily: 'sans-serif-condensed', paddingVertical: 5, fontSize: 12, textAlign: 'center' }}></Text>
                                                <View style={{ width: 40, backgroundColor: '#B5B5B5', height: 1, alignSelf: 'center', }} />
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: Colors.primary }}></Text>
                                                    <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} ></Text>
                                                    <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }} />
                            : this.state.shopByStyleData.length > 0 ? (<><View><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 15 }}>Shop by style</Text>
                                <View style={{ padding: 5, }}>
                                    <View style={{ backgroundColor: '#fff' }}>
                                        <FlatList data={this.state.shopByStyleData} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => {
                                            // console.log('disccc', item?.productListings[0]?.medias[0]?.mediaUrl)
                                            return (
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2.2, padding: 5, borderRightWidth: 5, borderRightColor: '#efefef' }}>
                                                    <View>
                                                        <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ height: 150, width: '100%' }} />
                                                        <View style={{ alignItems: 'center', paddingVertical: 5 }} >
                                                            <Text numberOfLines={2} ellipsizeMode="tail" style={{ width: '90%', textTransform: 'uppercase', fontWeight: 'bold', color: '#484848', fontFamily: 'sans-serif-condensed', paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>{item.name}</Text>
                                                            <View style={{ width: 40, backgroundColor: '#B5B5B5', height: 1, alignSelf: 'center', }} />
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
                                                                <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} >₹{item.productListings[0]?.mrp}</Text>
                                                                {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>Save ₹ {Math.round((
                                                                    item.productListings[0].mrp) - (item.productListings[0].sellingPrice))}</Text>}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }} />
                                    </View>
                                </View></View></>) : null}

                        {/* ===== brands ====== */}
                        {this.state.isBrandLoading ?
                            <FlatList data={[1, 2, 3, 4]} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: Dimensions.get('window').width / 3, padding: 5 }} >
                                    <View>
                                        <Image style={{ height: 100, width: '100%', backgroundColor: '#efefef' }} resizeMethod="auto" resizeMode="stretch" />
                                    </View>
                                </TouchableOpacity>
                            )} /> : this.state.categoryBrands.length > 0 ? <><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingTop: 15 }}>Most popular brands</Text>
                                <View style={{ padding: 5 }}>
                                    <FlatList data={this.state.categoryBrands} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BrandProductListing', { id: item.id, brandName: item.name })} style={{ width: Dimensions.get('window').width / 3, padding: 5 }} >
                                            <View>
                                                <Image source={{ uri: item?.media?.mediaUrl }} style={{ height: 100, width: '100%' }} resizeMethod="auto" resizeMode="stretch" />
                                            </View>
                                        </TouchableOpacity>
                                    )} />
                                </View></> : null}

                        {/* ====== shop by style ===== */}

                        {/* ===== Foooter ====== */}
                        <SocialScreen />

                    </ScrollView>
                </View>
            </View>
        )
    }
    render_Dropdown_Loading = ({ item, index }) => {

        return (
            <View>
                <TouchableWithoutFeedback >
                    <View
                        style={[

                            {
                                backgroundColor: '#efefef',
                                marginTop: 10,
                                alignSelf: 'center',
                                marginHorizontal: 10,
                                borderRadius: 10,
                                height: 50,
                                justifyContent: 'space-evenly',
                            },
                        ]}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                height: '100%',
                                justifyContent: 'space-evenly',
                            }}>

                            <View
                                style={{
                                    paddingHorizontal: 10,
                                    width: '90%',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontWeight: '600',
                                        fontSize: 14,
                                    }}>

                                </Text>

                            </View>

                            {this.state.current_dropdown_index ==
                                index ? (
                                    <Icon name="chevron-up" size={25} style={{ paddingVertical: 10 }} color="#000" />
                                ) : (
                                    <Icon name="chevron-down" size={25} style={{ paddingVertical: 10 }} color="#000" />
                                )}

                        </View>
                    </View>
                </TouchableWithoutFeedback>


            </View>
        );
    };
    _renderItemLoader = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
                <TouchableOpacity

                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#181818',
                        fontFamily: 'sans'
                    }}></Text>
                    <Icon name="chevron-right" size={20} color={'black'} />
                </TouchableOpacity>
            </View>
        )
    }
    _renderItem = ({ item, index }) => {
        return (
            <View style={{ backgroundColor: '#fff', marginBottom: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('ProductListing', {

                            from: 'Products',
                            catName: item.name,
                            subCatId: item.id,
                            catId: item.category.id

                        })}
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#181818',
                        fontFamily: 'sans'
                    }}>{item.name}</Text>
                    <Icon name="chevron-right" size={20} color={'black'} />
                </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    description: {
        fontSize: 13,
        paddingHorizontal: 15
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeSubCategoryScreen);