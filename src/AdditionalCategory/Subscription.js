import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, StyleSheet, ScrollView, FlatList, Dimensions, Linking } from 'react-native';
import { Header, SocialIcon } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { List, Checkbox } from 'react-native-paper';
import { fetchCategoryFeaturedProductsUrl, fetchCategoryNewArrivalProductsUrl, fetchCategoryProductsUrl, fetchDiscountedCategoryProducts, fetchSubCategoriesUrl, fetchSubCategoryProductsUrl, fetchSubSubCategoriesUrl, getCategoryBrandsUrl, supplierId } from '../../Config/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Axios from 'axios';
import { createStringWithFirstLetterCapital, errorToast } from '../Functions/functions';
import { getPaymentMode, getReferalCode, getTimeSlots, logOut, profileVisitedOnes, reLogin } from '../Redux/Auth/ActionCreatore';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteOneItemFromCart, editDefaultVariant, getBrands, getCategorys, getNeedsBrands, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { connect } from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Colors } from '../config/GlobalContants';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import LottieView from 'lottie-react-native';
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
        user: state.user,
        subscriptionData: state.subscriptionData
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
    getPaymentMode: () => dispatch(getPaymentMode()),
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
class Subscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            staticData: [
                { image: 'https://firebasestorage.googleapis.com/v0/b/krenai-webapp.appspot.com/o/ChristmasTreeDecoration6PiecesGoldenBells.jpg?alt=media&token=e848bd5d-0b00-4d9f-aca8-0820d793cfc6', name: 'Sample 1', id: 0 },
                { image: 'https://firebasestorage.googleapis.com/v0/b/krenai-webapp.appspot.com/o/ChristmasDoorHangingWreath15Inch.jpg?alt=media&token=aee1d51a-a958-4ba7-af70-22da3da9ef09', name: 'Sample 2', id: 1 },
                { image: 'https://firebasestorage.googleapis.com/v0/b/krenai-webapp.appspot.com/o/DOMSX1PremiumKit.jpg?alt=media&token=089f3ef7-7fc9-483e-b413-2035f8265c0a', name: 'Sample 3', id: 2 },
                { image: 'https://firebasestorage.googleapis.com/v0/b/krenai-webapp.appspot.com/o/ChristmasDIYKit3-ChristmasTree%26StarsGarland.jpg?alt=media&token=032c2b27-d6bd-416d-a94c-e60cec77f038', name: 'Sample 4', id: 3 }],
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
            isFeaturedLoading: true,
            isNewLoading: false,
            isStyleLoading: false,
            isBrandLoading: false,
            featured: [],
            newArrivalsData: [],
            shopByStyleData: [],
            categoryBrands: [],
            isFirst: true,
            bottomOneLoader: false,
            categoryIndex: -1,
        };
    }
    componentDidMount() {

        var categoryId = this.props.route.params?.id;
        console.log('isSubsssss', categoryId)
        this.props.getPaymentMode();
        this.getSubCategoriesByCategoryIdFromServer(categoryId);
    }


    getCategoryProducts = async (categoryId, subCatId, pageNum) => {
        pageNum === 1 ? this.setState({ featured: [], isFeaturedLoading: true, categoryIndex: subCatId }) : null;
        var url = fetchSubCategoryProductsUrl(pageNum, subCatId, categoryId, supplierId);

        this.setState({ bottomOneLoader: true })
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
                this.props.createDefaultVariants(response.data.object)
                response.data.object.length < 10 ? this.setState({ bottomOneLoader: false }) : null;
            })
            .catch((error) => {
                // if (!error.status) {
                this.setState({ networkError: true, isFeaturedLoading: false, });
                // errorToast('Error while loading data');
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
                console.log('subcatid', response.data.object[0]?.id)
                if (this.state.isFirst) {
                    this.props.deleteAllDefaultVarinats();
                    this.getCategoryProducts(categoryId, response.data.object[0].id, 1);
                }

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
        var regex = /(<([^>]+)>)/gi;
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

                        {/* ====== Static-Category data-list ===== */}
                        <View style={{ flex: 1 }}>
                            <FlatList data={this.state.staticData} horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {

                                return (

                                    <TouchableOpacity style={{ width: Dimensions.get('window').width / 3, padding: 3, backgroundColor: '#fff', }}>
                                        <View style={{}}>
                                            {/* <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ height: 120, width: '100%' }} /> */}
                                            <FastImage
                                                style={{ width: '100%', height: 120, alignSelf: 'center', }}
                                                source={{
                                                    uri: item.image,

                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', textTransform: 'uppercase', textAlign: 'center', paddingVertical: 5 }} >{item.name}</Text>
                                            {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 12, color: Colors.primary }}>₹ {item.productListings[0]?.sellingPrice}</Text>
                <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} >₹{item.productListings[0]?.mrp}</Text>
                {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>Save ₹ {Math.round((
                    item.productListings[0].mrp) - (item.productListings[0].sellingPrice))}</Text>}
            </View> */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            }} ItemSeparatorComponent={() => (
                                <View style={{ paddingHorizontal: 3 }} />
                            )} />
                        </View>
                        <View style={{ marginVertical: 10 }}>
                            {this.state.isSubCategoryLoading ?
                                <FlatList data={[1]} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={{ width: Dimensions.get('window').width / 2.2, padding: 5, borderRightWidth: 5, borderRightColor: '#efefef' }}>
                                            <View>

                                                <View style={{ alignItems: 'center', paddingVertical: 5 }} >
                                                    <Text numberOfLines={2} ellipsizeMode="tail" style={{ width: '90%', textTransform: 'uppercase', fontWeight: 'bold', color: '#484848', fontFamily: 'sans-serif-condensed', paddingVertical: 5, fontSize: 12, textAlign: 'center' }}></Text>
                                                    <View style={{ width: 40, backgroundColor: '#B5B5B5', height: 1, alignSelf: 'center', }} />

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }} />
                                : this.state.subCategoryData.length > 0 ? (<><View>
                                    <View style={{ padding: 5, }}>
                                        <View style={{ backgroundColor: '#fff' }}>
                                            <FlatList data={this.state.subCategoryData} keyExtractor={(item, index) => String(index)} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({ item }) => {
                                                // co/snsole.log('disccc', item)
                                                return (
                                                    <TouchableOpacity onPress={() => {
                                                        var categoryId = this.props.route.params?.id;
                                                        this.props.deleteAllDefaultVarinats()
                                                        this.getCategoryProducts(categoryId, item.id, 1)
                                                    }} style={[this.state.categoryIndex === item.id ? { borderBottomColor: Colors.primary } : { borderBottomColor: Colors.white }, { width: Dimensions.get('window').width / 3.5, padding: 5, borderRightWidth: 5, borderRightColor: '#efefef', borderBottomWidth: 2, }]}>
                                                        <View>

                                                            <View style={{ alignItems: 'center', paddingVertical: 5 }} >
                                                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ width: '90%', textTransform: 'uppercase', fontWeight: 'bold', color: '#484848', fontFamily: 'sans-serif-condensed', paddingVertical: 5, fontSize: 12, textAlign: 'center' }}>{item.name}</Text>


                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                        </View>
                                    </View></View></>) :
                                    null
                            }
                        </View>
                        {/* ===== Maake a Statement ===== */}
                        {this.state.isFeaturedLoading ?
                            <View><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Products you may like</Text>
                                <View style={{ padding: 7 }}>
                                    <FlatList data={[1]} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity style={{ width: Dimensions.get('window').width / 1.02, padding: 3, backgroundColor: '#fff', }}>
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
                                <View><Text style={{ fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, textAlign: 'center', paddingVertical: 10 }}>Products you may like</Text>

                                    <FlatList data={this.state.featured} showsHorizontalScrollIndicator={false} keyExtractor={(index, item) => String(index)} renderItem={({ item }) => {
                                        // console.log('item.prodd', item?.productListings[0].medias[0]?.mediaUrl)
                                        return (

                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SubsDetailList', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 1.02, padding: 7 }}>
                                                <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
                                                    {/* <Image source={{ uri: item.productListings[0].medias[0].mediaUrl }} style={{ height: 150, width: '100%' }} /> */}
                                                    <FastImage
                                                        style={{ width: '40%', height: 150, alignSelf: 'center', }}
                                                        source={{
                                                            uri: item?.productListings[0].medias[0]?.mediaUrl,
                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                    <View style={{ alignSelf: 'center', paddingVertical: 8, width: '60%', paddingHorizontal: 5 }}>
                                                        <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', color: '#484848', fontWeight: 'bold', textTransform: 'uppercase', }} >{item.name}</Text>
                                                        <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ fontSize: 11, fontFamily: 'sans-serif', color: '#484848', marginVertical: 2, textTransform: 'uppercase', }} >{item.description.replace(regex, '')}</Text>

                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ fontSize: 11, fontFamily: 'sans-serif-condensed', color: Colors.primary, textTransform: 'uppercase', textAlign: 'center' }}>₹{item.productListings[0].sellingPrice}</Text>
                                                            <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#A6A19E', textDecorationLine: 'line-through' }} numberOfLines={2} ellipsizeMode={'tail'} >₹{item.productListings[0]?.mrp}</Text>
                                                            {item.productListings[0].mrp - item.productListings[0].sellingPrice > 0 && <Text style={{ paddingLeft: 5, fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 11, color: '#000', }}>Save ₹ {Math.round((
                                                                item.productListings[0].mrp) - (item.productListings[0].sellingPrice))}</Text>}
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                        onEndReachedThreshold={0.5}
                                        onEndReached={() => {
                                            if (this.state.bottomOneLoader) {

                                            }
                                        }}
                                    />
                                </View>
                            </>
                            ) : <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', }}>
                                    <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 250, alignSelf: 'center' }} />
                                    <Text style={{ textAlign: "center", fontSize: 24 }}>No Products Available</Text>
                                </View>}

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

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);