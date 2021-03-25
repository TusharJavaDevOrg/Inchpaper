import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StatusBar, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { Icon, Header, SocialIcon } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { connect } from 'react-redux';
import Axios from 'axios';
import { addAbondonedId, addOneFavourite, addOneItemToCart, createDefaultVariants, decreaseProductCount, deleteAbandoneId, deleteAllDefaultVarinats, deleteAllItemsFromCart, deleteFaqData, deleteOneItemFromCart, editDefaultVariant, increaseProductCount, removeOneFavourite } from '../Redux/Cart/ActionCreators';
import { abondendCheckoutUrl, fetchSimilarProducts, getProductByNameAndId, getProductReviewUrl, updateAbondendCheckoutUrl } from '../../Config/Constants';
import { errorToast, toast } from '../Functions/functions';
import HTML from 'react-native-render-html';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../config/GlobalContants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VariantSelector from '../ProductDetails/VarientSelector';
import SocialScreen from '../Components/SocialIconScreen';
import { Share } from 'react-native';
import { Linking } from 'react-native';

const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        user: state.user,
        abandonedCheckout: state.abandonedCheckout,
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
    deleteFaqData: () => dispatch(deleteFaqData())
});

const SCREEN_WIDTH = Dimensions.get('window').width;
class SubsDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            scroll: new Animated.Value(0),
            activeProductListingArr: [],
            indexOfSelectedVariant: 0,
            product: [],
            productLoading: true,
            currentSelectedVariant: '',
            isloading: true,
            prodData: [],
            isProductsLoading: false,
            varientSelect: [],
            currentSelectedVariant: 0,


        };
    }
    async componentDidMount() {
        // this.forceUpdate();
        // this.props.deleteAllDefaultVarinats();
        await this.checkScreen();
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
            abondenedCheckoutProductRequests: cartArray,
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
                errorToast('Error while loading abandoned data');
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
    checkScreen = async () => {
        const { from, product } = this.props.route.params;

        console.log('from  ====== ,', from)
        if (from === 'productListing') {
            var productListingActiveArr = [];
            product?.productListings?.map((item, index) => {
                if (index === 0) {
                    productListingActiveArr.push({ isActive: true });
                } else {
                    productListingActiveArr.push({ isActive: false });
                }
            });
            var varientSelector = [];
            product.variantValues.map((it, ind) => {
                varientSelector.push({ id: ind, selectedVariant: it.variantValue[0] });
            });
            this.setState({ varientSelect: varientSelector });
            console.log('product detail', varientSelector, productListingActiveArr)
            this.getProductReview(product.productListings[0].id)
            // this.getCategoriesProducts(1, product?.category?.id, product?.subCategory?.id,)
            this.setState({
                activeProductListingArr: productListingActiveArr,
                product: product,
                currentSelectedVariant: product.productListings[0].variantValues[0],
                productLoading: false,
                isloading: false,
            });
        } else if (from === 'Search' || from === 'Cart') {
            console.log('search', product)
            const productId = product.id;
            const productName = product.name;

            await this.getProductUsingNameAndId(productId, productName);
        }
    };
    getCategoriesProducts = async (pageNum, catid, subcatid,) => {
        this.setState({ isProductsLoading: true });
        var url = fetchSimilarProducts(pageNum, catid, subcatid,);
        if (this.state.firstRun) {
            this.props.deleteAllDefaultVarinats();
        }
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                this.setState({
                    prodData: response.data.object,
                    isProductsLoading: false,
                });
                this.props.createDefaultVariants(response.data.object);
            })
            .catch((error) => {
                this.setState({
                    isProductsLoading: false,

                });
            });
    }
    getProductReview = async (pId) => {
        this.setState({ isReviewLoading: true });

        var url = getProductReviewUrl(pId);

        console.log('url of product reviews', url)
        Axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + this.props.login.accessToken,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },

        }).then((resp) => {
            this.setState({ reviews: resp.data.object, isReviewLoading: false })
        }).catch((err) => {
            this.setState({ isReviewLoading: false })
            console.log('e', err.message);
            errorToast('failed to get reviews');
        });
    }
    onShareProduct = (productId) => {
        var url = 'https://inchpaper.com/#/product-details?q=' + productId;
        try {
            const result = Share.share({
                message:
                    url,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    getProductUsingNameAndId = async (productId, productName) => {
        this.setState({ productLoading: true });
        var url = getProductByNameAndId(productName, productId);

        console.log('product search', url)
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + ' ',
                'Content-type': 'application/json',
            },
        })
            .then((resp) => {
                var productListingActiveArr = [];
                var product = resp.data.object;
                product[0].productListings.map((item, index) => {
                    if (index === 0) {
                        productListingActiveArr.push({ isActive: true });
                    } else {
                        productListingActiveArr.push({ isActive: false });
                    }
                });
                var varientSelector = [];
                product[0].variantValues.map((it, ind) => {
                    varientSelector.push({ id: ind, selectedVariant: it.variantValue[0] });
                });
                this.setState({ varientSelect: varientSelector });
                this.setState({
                    activeProductListingArr: productListingActiveArr,
                    product: resp.data.object[0],
                    productLoading: false,
                    isloading: false,
                }, () => {
                    this.getProductReview(this.state.product?.productListings[0]?.id)
                    // this.getCategoriesProducts(1, this.state.product?.category?.id, this.state.product?.subCategory?.id,)
                });
            })
            .catch((err) => {
                // console.log(err.message);
            });
    };

    handlePress = (indexOfVarinat) => {
        // console.log('Inside handle press New Active index state');
        if (this.state.activeProductListingArr.length > 0) {
            var currentActiveState = this.state.activeProductListingArr;
            var newActiveIndex = [];
            currentActiveState.map((item, index) => {
                if (index === indexOfVarinat) {
                    if (currentActiveState[index].isActive) {
                        this.setState({ indexOfSelectedVariant: indexOfVarinat });
                        newActiveIndex.push({
                            isActive: currentActiveState[index].isActive,
                        });
                    } else {
                        this.setState({ indexOfSelectedVariant: indexOfVarinat });
                        newActiveIndex.push({
                            isActive: !currentActiveState[index].isActive,
                        });
                    }
                } else {
                    newActiveIndex.push({ isActive: false });
                }
            });
            this.setState({ activeProductListingArr: newActiveIndex });
            // console.log('New Active index state =====', newActiveIndex);
        } else {
            return;
        }
    };

    renderVariants = ({ item, index }) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    console.log('currentSleeee', item.variantValues[0], index)
                    this.handlePress(index);
                    this.setState({
                        currentSelectedVariant: item.variantValues[0],
                    });
                }}
                style={[
                    styles.verient,
                    {
                        borderColor: this.state.activeProductListingArr[index].isActive
                            ? '#e3ffde'
                            : '#dfdfdf',
                        backgroundColor: this.state.activeProductListingArr[index].isActive
                            ? '#e3ffde'
                            : '#fff',
                    },
                ]}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.variantText,
                                {
                                    color: this.state.activeProductListingArr[index].isActive
                                        ? 'green'
                                        : '#222',
                                },
                            ]}>
                            {item.itemWeight ? item.itemWeight : item.variantValues[0]}
                        </Text>
                    </View>
                    {/* {this.state.activeProductListingArr[index].isActive ? null : ( */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.variantText,
                                {
                                    color: this.state.activeProductListingArr[index].isActive
                                        ? 'green'
                                        : '#222',
                                },
                            ]}>
                            ₹ {item.sellingPrice}
                        </Text>
                    </View>
                    {/* )} */}
                </View>
            </TouchableOpacity>
        );
    };
    linkOpenTo = (type) => {
        var phone = "7703860982";
        if (type === 'whatsapp') {
            // Linking.openURL(`whatsapp://send?phone=${phone}&text=`);

            Linking.openURL('whatsapp://send?text=' + '&phone=91' + phone);
        } else {
            let phoneNumber = phone;
            if (Platform.OS !== 'android') {
                phoneNumber = `telprompt:${phone}`;
            }
            else {
                phoneNumber = `tel:${phone}`;
            }
            Linking.canOpenURL(phoneNumber)
                .then(supported => {
                    if (!supported) {
                        Alert.alert('Phone number is not available');
                    } else {
                        return Linking.openURL(phoneNumber);
                    }
                })
                .catch(err => console.log(err));
        }
    }
    findProductVarientSelectedByCustomer = (product, varientSelect) => {
        var wantedIndex = 0;
        var selectedResult = '';
        varientSelect.map((it, ind) => {
            selectedResult.length === 0
                ? (selectedResult = it.selectedVariant)
                : (selectedResult += ' ' + it.selectedVariant);
        });

        product?.productListings?.map((item, index) => {
            var result = '';
            item.variantValues.map((it, ind) => {
                result.length === 0 ? (result = it) : (result += ' ' + it);
                // console.log(it);
            });
            if (result === selectedResult) {
                console.log('Found varient index', index);
                wantedIndex = index;
                // console.log('Here are the results', {result, selectedResult});
            }
            // console.log('Here are the results', { result, selectedResult });
        });

        return wantedIndex;
    };

    handleAddToCart = (item, indexOfSelecetdVarient) => {
        this.props.deleteFaqData();

        var cartArray = [];

        var oneCartitemToBePosted = {
            productListingId:
                item.productListings[indexOfSelecetdVarient].id,
            productId: item.id,
            productName: item.name,
            sellingPrice: item.productListings[indexOfSelecetdVarient].sellingPrice,
            mrp: item.productListings[indexOfSelecetdVarient].mrp,
            productDes: item.description,
            productImage: item.productListings[indexOfSelecetdVarient].medias[0].mediaUrl,
            quantity: 1,
            variantValues: item.productListings[indexOfSelecetdVarient].variantValues[0],
            // tax: null,
            maxQuantityPerUser: item.productListings[indexOfSelecetdVarient].maxOrderQty,
        };
        cartArray.push(oneCartitemToBePosted);
        console.log('cartbody', cartArray, item.productListings[indexOfSelecetdVarient])
        this.props.navigation.navigate('Que', { data: cartArray, subCat: item?.subCategory?.name });
    }

    render() {
        const { from } = this.props.route.params;
        const { scroll } = this.state;
        scroll.addListener(({ value }) => {
            // console.log('value of scroll', value)
            if (value < 0) {
                this.setState({ show: true })
            }
            else if (value > 600) {
                this.setState({ show: true })
            }
            else {
                this.setState({ show: false })
            }
        })
        if (this.state.isloading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} style={{ alignSelf: 'center' }} />
                </View>
            )
        } else {
            if (from === 'Search' || from === 'Cart') {
                console.log('from detail', from, this.state.productLoading)
                if (this.state.productLoading) {
                    return (<View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={'large'} color={Colors.primary} style={{ alignSelf: 'center' }} />
                    </View>)
                } else {
                    const { product } = this.state;
                    var productSellingPrice = 0;
                    var productMrp = 0;
                    var indexOfSelecetdVarient = -222;
                    indexOfSelecetdVarient = this.findProductVarientSelectedByCustomer(
                        product,
                        this.state.varientSelect,
                    );
                    product.productListings
                        ? (productSellingPrice =
                            product.productListings[indexOfSelecetdVarient]
                                .sellingPrice)
                        : (productSellingPrice = 0);
                    product.productListings
                        ? (productMrp =
                            product.productListings[indexOfSelecetdVarient].mrp)
                        : (productMrp = 0);

                    var indexOfProductWithSameIdAndVariantInCart = this.props.cart.cart.findIndex(
                        (x) =>
                            x.id === product.id &&
                            x.variantSelectedByCustome ===
                            product.productListings[indexOfSelecetdVarient]
                                .variantValues[0],
                    );

                    var images = [];
                    product.productListings.map((it, ind) => {
                        it.medias.map((item, index) =>
                            images.push(item.mediaUrl)
                        )
                    })
                    // product.medias.map((it, ind) =>
                    //     images.push(it.mediaUrl)
                    // )
                    return (
                        <View style={{ flex: 1 }}>
                            <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                            <Header backgroundColor="#fff"
                                leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                                rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                            />
                            <View style={{ flex: 1, }}>
                                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }])}>
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

                                    {/* ====== Product Image SliderBox ====== */}
                                    <View style={{ backgroundColor: '#fff', }}>
                                        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('ProductFullImage', { images: images })}>
                                            <SliderBox on images={images} sliderBoxHeight={400} resizeMode={'cover'} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{ padding: 10, backgroundColor: '#fff', }}>
                                        <Text style={{ fontSize: 13, fontFamily: 'Roboto', color: '#716464' }}>{product.name}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, fontFamily: 'Roboto', color: '#B70000', paddingVertical: 5 }}>{product?.brand?.name}</Text>
                                            {/* <TouchableWithoutFeedback style={{ borderColor: '#5A5A5A', borderWidth: 1, borderRadius: 30, paddingHorizontal: 5, paddingVertical: 2 }}>
                                                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontFamily: 'sans', color: "#5A5A5A" }}>Best Seller</Text>
                                            </TouchableWithoutFeedback> */}
                                        </View>
                                        {/* {product?.brand?.name !== null && product?.brand?.name !== undefined && <View style={{ flexDirection: 'row' }}>
                                            <Icon name="shipping-fast" color="#9B9B9B" size={16} type="font-awesome-5" />
                                            <Text style={{ fontSize: 12, fontFamily: 'Roboto', color: '#716464', paddingLeft: 8 }}>Fulfilled by {product?.brand?.name}</Text>
                                        </View>} */}
                                    </View>
                                    <View style={{ backgroundColor: '#fff', }}>
                                        <View style={{ paddingTop: 2 }}>
                                            <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                        </View>
                                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10, alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', color: '#B70000', fontSize: 15, }}>₹{productSellingPrice}</Text>
                                            {productMrp - productSellingPrice > 0 && <Text style={{ fontFamily: 'Roboto', fontSize: 13, color: '#716464', textDecorationLine: 'line-through', paddingHorizontal: 8 }}>₹{productMrp} MRP</Text>}
                                            <Text style={{ fontFamily: 'Roboto', fontSize: 13, color: '#716464' }}>(Inclusive of all taxes)</Text>
                                        </View>
                                        {/* <View style={{ padding: 10, }}>
                                        <Image source={{ uri: 'https://ii2.pepperfry.com/media/wysiwyg/banners/Web_vipcoupon_500_10k_2221.jpg' }} style={{ height: 50, width: '100%' }} resizeMode="center" />
                                    </View> */}

                                        <View style={{ padding: 10 }}>
                                            {productMrp - productSellingPrice > 0 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <Text style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 'bold', color: '#B70000' }}>Total Savings</Text>
                                                <Text style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 'bold', color: '#B70000' }}>₹ {productMrp - productSellingPrice}</Text>
                                            </View>}
                                            {/* <Text style={{ fontSize: 11, color: '#737070', textTransform: 'capitalize' }}>Also Earn cashback ₹ 10,000</Text> */}
                                        </View>
                                    </View>
                                    {/* <View>
                                        {product?.variantValues &&
                                            product?.variantValues[0]?.variant != 'NO VARIANT' ? (
                                                <>
                                                    <Text style={styles.variantType}>
                                                        {product?.variantValues
                                                            ? product?.variantValues[0].variant
                                                            : 'No Variant'}
                                                    </Text>
                                                    <FlatList
                                                        data={product.productListings}
                                                        renderItem={this.renderVariants}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        numColumns={2}
                                                    />
                                                </>
                                            ) : null}
                                    </View> */}

                                    <VariantSelector
                                        productListings={product.productListings}
                                        variantValues={product.variantValues}
                                        onPress={(selectData) =>
                                            this.setState({ varientSelect: selectData })
                                        }
                                    />

                                    {/* <View style={{ backgroundColor: '#fff' }}>
                                    <FlatList horizontal={true} data={this.state.companyPolicyData} keyExtractor={(item, index) => String(index)} renderItem={({ item }) => (
                                        <View style={{ width: Dimensions.get('window').width / 3, alignItems: 'center', paddingVertical: 10 }} >
                                            <Icon name={item.icon} iconType={item.iconType} color='#ADADAD' size={25} />
                                            <Text style={{ fontFamily: 'sans-serif', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', paddingTop: 5, textAlign: 'center' }}>{item.data}</Text>
                                            <Text style={{ fontFamily: 'sans-serif', fontSize: 10, textAlign: 'center', textTransform: 'capitalize' }}>{item.data2}</Text>
                                        </View>
                                    )} />
                                </View> */}


                                    {/* ==== cuppons ===== */}
                                    {/* <View style={{ backgroundColor: '#fff' }}>
                                    <Text style={{ textTransform: 'uppercase', fontSize: 14, color: '#636363', paddingLeft: 10, paddingTop: 10 }}>2 More Offers</Text>
                                    <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.state.cuponsData} keyExtractor={(item, index) => String(index)} renderItem={({ item }) => (
                                        <View style={{ padding: 10 }} >
                                            <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderStyle: 'dashed', padding: 8, width: 250, height: 80 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#B70000', fontFamily: 'sans-serif' }}>{item.offerName}</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#B70000', fontFamily: 'sans-serif' }}>{item.offerCode}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ fontSize: 11, color: '#525050', fontFamily: 'sans', paddingTop: 10 }}>{item.promoDesc}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )} />
                                </View> */}

                                    <View style={{ backgroundColor: '#fff' }}>
                                        <View style={{ alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 10, width: '100%' }}>

                                            <TouchableOpacity
                                                onPress={() => this.handleAddToCart(product, indexOfSelecetdVarient)}
                                                style={{ padding: 12, backgroundColor: Colors.primary, width: '100%', borderRadius: 3 }}>
                                                <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff', fontFamily: 'sans' }}>Add to cart</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ paddingTop: 10 }}>
                                            <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                        </View>
                                        <View style={{ paddingVertical: 10 }}>
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Need Help? Reach Out To Us Through</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                <TouchableOpacity onPress={() => this.linkOpenTo('whatsapp')}>
                                                    <Image source={require('../assets/whatsapp.png')} style={{ height: 50, width: 50 }} />
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: 3 }}>WhatsApp</Text>
                                                </TouchableOpacity>
                                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>OR</Text>
                                                <TouchableOpacity onPress={() => this.linkOpenTo('call')}>
                                                    <Image source={require('../assets/phone-call.png')} style={{ height: 50, width: 50 }} />
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: 3 }}>Call</Text>
                                                </TouchableOpacity>

                                                {/* <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Call or WhatsApp at +91-7703860982</Text> */}
                                            </View>
                                        </View>
                                        <View style={{ paddingBottom: 10 }}>


                                            <View style={{ backgroundColor: '#CACACA', height: 1 }} />

                                        </View>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => this.onShareProduct(product.id)}>
                                                    <Image source={require('../assets/share.png')} style={{ height: 50, width: 50 }} />
                                                </TouchableOpacity>
                                                <Text onPress={() => this.onShareProduct(product.id)} style={{ textDecorationLine: 'underline', paddingLeft: 10, fontWeight: 'bold', }}>Share This Product</Text>

                                            </View>
                                        </View>
                                        <View style={{ paddingTop: 10 }}>
                                            <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                        </View>
                                        {/* ===== Similar Produts ===== */}
                                        {this.state.prodData.length > 0 ? <>
                                            <View style={{ paddingHorizontal: 5, borderBottomWidth: 3, borderTopWidth: 3, borderTopColor: '#efefef', borderBottomColor: '#efefef' }}>
                                                <Text style={{ fontWeight: 'bold', paddingLeft: 10, textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, paddingTop: 5 }}>You may also like</Text>
                                                <View style={{ padding: 3 }}>
                                                    <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.state.prodData} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                                        return (
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2, padding: 5, }}>
                                                                <View style={{ borderRadius: 5, backgroundColor: '#fff' }}>
                                                                    <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                                                                    <Text style={{ textTransform: 'capitalize', fontFamily: 'Roboto', color: '#959595', fontSize: 12, paddingTop: 3 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                                                    <View style={{ flexDirection: 'row', paddingTop: 4, paddingHorizontal: 5, paddingVertical: 5 }}>
                                                                        <Text style={{ fontSize: 11, color: '#D11805' }}>₹{item.productListings[0].sellingPrice}</Text>
                                                                        {item.productListings[0].mrp
                                                                            -

                                                                            item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 5 }}>₹{item.productListings[0].mrp}</Text>}
                                                                        {item.productListings[0].mrp
                                                                            -

                                                                            item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Save ₹{
                                                                                item.productListings[0].mrp
                                                                                -

                                                                                item.productListings[0].sellingPrice

                                                                            }</Text>}
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        )
                                                    }} />
                                                </View>
                                            </View></> : null}
                                        <View style={{ paddingHorizontal: 10 }}>
                                            <View style={{ borderBottomColor: '#efefef', borderBottomWidth: 0.8, paddingVertical: 10 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image source={require('../assets/box.png')} style={{ height: 30, width: 30 }} />
                                                    <Text style={{ fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 10 }}>Sold & Fulfilled by</Text>
                                                </View>
                                                <Text>Inchpaper Private Limited</Text>
                                            </View>
                                            <View style={{ paddingTop: 10, borderBottomColor: '#efefef', borderBottomWidth: 0.8, paddingBottom: 10 }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image source={require('../assets/shield.png')} style={{ height: 30, width: 30 }} />
                                                    <Text style={{ fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 10 }}>100% Genuine Products</Text>
                                                </View>
                                                <Text>All Products are far from expiry, and procured directly from the brand or authorized importers of the brand</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ width: '25%', paddingVertical: 10 }}>


                                                    <Image source={require('../assets/free_shipping.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                    <Text style={{ textAlign: 'center', paddingTop: 10 }}>Shipping Across India</Text>
                                                </View>
                                                <View style={{ width: '25%', paddingVertical: 10 }}>
                                                    <Image source={require('../assets/wallet.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                    <Text style={{ textAlign: 'center', paddingTop: 10 }}>Easy Payment Options</Text>
                                                </View>
                                                <View style={{ width: '25%', paddingVertical: 10 }}>
                                                    <Image source={require('../assets/wallet.png')} style={{ height: 20, width: 20, alignSelf: 'center' }} />
                                                    <Text style={{ textAlign: 'center', paddingTop: 10 }}>Over 10000+ Products</Text>
                                                </View>
                                                <View style={{ width: '25%', paddingVertical: 10 }}>

                                                    <Image source={require('../assets/shield-outline.png')} style={{ height: 20, width: 20, alignSelf: 'center', padding: 10, borderRadius: 360, borderWidth: 0.5, paddingVertical: 10 }} />

                                                    <Text style={{ textAlign: 'center', paddingTop: 10 }}>Authenticity Guaranteed</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* ===== Product Details ======= */}
                                        <View style={{ padding: 10 }}>
                                            <View style={{ padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 }}>
                                                <Text style={{ fontSize: 13, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 'bold', color: '#615E5E', paddingVertical: 8 }}>Product Details</Text>
                                                <View style={{ backgroundColor: '#9B9696', height: 1 }} />
                                                <HTML
                                                    baseFontStyle={{ fontSize: 14 }}
                                                    containerStyle={{ paddingHorizontal: 5 }}
                                                    html={product.description}
                                                    imagesMaxWidth={Dimensions.get('window').width}
                                                />

                                            </View>
                                        </View>

                                    </View>




                                    {/* ===== Foooter ====== */}
                                    <SocialScreen />


                                </ScrollView>
                            </View>
                            {
                                this.state.show ? <View>
                                    <View style={{ flexDirection: 'row', width: '100%' }}>

                                        <TouchableOpacity onPress={async () => {
                                            this.handleAddToCart(product, indexOfSelecetdVarient)
                                        }}
                                            style={{ padding: 12, backgroundColor: Colors.primary, width: '100%', borderRadius: 3 }}>
                                            <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff', fontFamily: 'sans' }}>Add to cart</Text>
                                        </TouchableOpacity>


                                    </View>
                                </View> : null
                            }
                        </View>
                    );
                }
            }
            else {
                const { product } = this.props.route.params;
                var productSellingPrice = 0;
                var productMrp = 0;
                var indexOfSelecetdVarient = -222;
                indexOfSelecetdVarient = this.findProductVarientSelectedByCustomer(
                    product,
                    this.state.varientSelect,
                );
                product.productListings
                    ? (productSellingPrice =
                        product.productListings[indexOfSelecetdVarient]
                            .sellingPrice)
                    : (productSellingPrice = 0);
                product.productListings
                    ? (productMrp =
                        product.productListings[indexOfSelecetdVarient].mrp)
                    : (productMrp = 0);

                var indexOfProductWithSameIdAndVariantInCart = this.props.cart.cart.findIndex(
                    (x) =>
                        x.id === product.id &&
                        x.variantSelectedByCustome ===
                        product.productListings[this.state.indexOfSelectedVariant]
                            .variantValues[0],
                );
                var images = [];
                product.productListings.map((it, ind) => {
                    it.medias.map((item, index) =>
                        images.push(item.mediaUrl)
                    )
                })

                // product.productListings[0].medias.map((it, ind) =>
                //     images.push(it.mediaUrl)
                // )
                console.log('product data', JSON.stringify(product?.variantValues[0]?.variant))
                return (
                    <View style={{ flex: 1 }}>
                        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                        <Header backgroundColor="#fff"
                            leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                            rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                        />
                        <View style={{ flex: 1, }}>
                            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scroll } } }])}>
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


                                {/* ====== Product Image SliderBox ====== */}
                                <View style={{ backgroundColor: '#fff', }}>
                                    <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('ProductFullImage', { images: images })}>
                                        <SliderBox on images={images} sliderBoxHeight={400} resizeMode={'cover'} />
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ padding: 10, backgroundColor: '#fff', }}>
                                    <Text style={{ fontSize: 13, fontFamily: 'Roboto', color: '#716464' }}>{product.name}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* <Text style={{ fontSize: 12, fontFamily: 'Roboto', color: '#B70000', paddingVertical: 5 }}>{product?.brand?.name}</Text> */}
                                        {/* <TouchableWithoutFeedback style={{ borderColor: '#5A5A5A', borderWidth: 1, borderRadius: 30, paddingHorizontal: 5, paddingVertical: 2 }}>
                                            <Text style={{ fontSize: 13, textTransform: 'uppercase', fontFamily: 'sans', color: "#5A5A5A" }}>Best Seller</Text>
                                        </TouchableWithoutFeedback> */}
                                    </View>
                                    {/* {product?.brand?.name !== null && product?.brand?.name !== undefined && <View style={{ flexDirection: 'row' }}>
                                        <Icon name="shipping-fast" color="#9B9B9B" size={16} type="font-awesome-5" />
                                        <Text style={{ fontSize: 12, fontFamily: 'Roboto', color: '#716464', paddingLeft: 8 }}>Fulfilled by {product?.brand?.name}</Text>
                                    </View>} */}
                                </View>
                                <View style={{ backgroundColor: '#fff', }}>
                                    <View style={{ paddingTop: 2 }}>
                                        <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 10, alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', color: '#B70000', fontSize: 15, }}>₹{productSellingPrice}</Text>
                                        <Text style={{ fontFamily: 'Roboto', fontSize: 13, color: '#716464', textDecorationLine: 'line-through', paddingHorizontal: 8 }}>₹{productMrp} MRP</Text>
                                        <Text style={{ fontFamily: 'Roboto', fontSize: 13, color: '#716464' }}>(Inclusive of all taxes)</Text>
                                    </View>
                                    {/* <View style={{ padding: 10, }}>
                                    <Image source={{ uri: 'https://ii2.pepperfry.com/media/wysiwyg/banners/Web_vipcoupon_500_10k_2221.jpg' }} style={{ height: 50, width: '100%' }} resizeMode="center" />
                                </View> */}

                                    <View style={{ padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 'bold', color: '#B70000' }}>Total Savings</Text>
                                            <Text style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 'bold', color: '#B70000' }}>₹ {productMrp - productSellingPrice}</Text>
                                        </View>
                                        {/* <Text style={{ fontSize: 11, color: '#737070', textTransform: 'capitalize' }}>Also Earn cashback ₹ 10,000</Text> */}
                                    </View>
                                </View>
                                {/* <View>
                                    {product?.variantValues &&
                                        product?.variantValues[0]?.variant != 'NO VARIANT' ? (
                                            <>
                                                <Text style={styles.variantType}>
                                                    {product?.variantValues
                                                        ? product?.variantValues[0].variant
                                                        : 'No Variant'}
                                                </Text>
                                                <FlatList
                                                    data={product.productListings}
                                                    renderItem={this.renderVariants}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    numColumns={2}
                                                />
                                            </>
                                        ) : null}
                                </View> */}
                                <VariantSelector
                                    productListings={product.productListings}
                                    variantValues={product.variantValues}
                                    onPress={(selectData) =>
                                        this.setState({ varientSelect: selectData })
                                    }
                                />
                                {/* <View style={{ backgroundColor: '#fff' }}>
                                <FlatList horizontal={true} data={this.state.companyPolicyData} keyExtractor={(item, index) => String(index)} renderItem={({ item }) => (
                                    <View style={{ width: Dimensions.get('window').width / 3, alignItems: 'center', paddingVertical: 10 }} >
                                        <Icon name={item.icon} iconType={item.iconType} color='#ADADAD' size={25} />
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', paddingTop: 5, textAlign: 'center' }}>{item.data}</Text>
                                        <Text style={{ fontFamily: 'sans-serif', fontSize: 10, textAlign: 'center', textTransform: 'capitalize' }}>{item.data2}</Text>
                                    </View>
                                )} />
                            </View> */}


                                {/* ==== cuppons ===== */}
                                {/* <View style={{ backgroundColor: '#fff' }}>
                                <Text style={{ textTransform: 'uppercase', fontSize: 14, color: '#636363', paddingLeft: 10, paddingTop: 10 }}>2 More Offers</Text>
                                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.state.cuponsData} keyExtractor={(item, index) => String(index)} renderItem={({ item }) => (
                                    <View style={{ padding: 10 }} >
                                        <View style={{ borderColor: '#D3D3D3', borderWidth: 1, borderStyle: 'dashed', padding: 8, width: 250, height: 80 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#B70000', fontFamily: 'sans-serif' }}>{item.offerName}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#B70000', fontFamily: 'sans-serif' }}>{item.offerCode}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 11, color: '#525050', fontFamily: 'sans', paddingTop: 10 }}>{item.promoDesc}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )} />
                            </View> */}

                                <View style={{ backgroundColor: '#fff' }}>
                                    <View style={{ alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 10, width: '100%' }}>

                                        <TouchableOpacity
                                            onPress={() => this.handleAddToCart(product, indexOfSelecetdVarient)}
                                            style={{ padding: 12, backgroundColor: Colors.primary, width: '100%', borderRadius: 3 }}>
                                            <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff', fontFamily: 'sans' }}>Add to cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 10 }}>
                                        <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                    </View>
                                    <View style={{ paddingVertical: 10 }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Need Help? Reach Out To Us Through</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                            <TouchableOpacity onPress={() => this.linkOpenTo('whatsapp')}>
                                                <Image source={require('../assets/whatsapp.png')} style={{ height: 50, width: 50 }} />
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: 3 }}>WhatsApp</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>OR</Text>
                                            <TouchableOpacity onPress={() => this.linkOpenTo('call')}>
                                                <Image source={require('../assets/phone-call.png')} style={{ height: 50, width: 50 }} />
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: 3 }}>Call</Text>
                                            </TouchableOpacity>

                                            {/* <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Call or WhatsApp at +91-7703860982</Text> */}
                                        </View>
                                    </View>
                                    <View style={{ paddingBottom: 10 }}>


                                        <View style={{ backgroundColor: '#CACACA', height: 1 }} />

                                    </View>
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                            <TouchableOpacity style={{ paddingBottom: 5 }} onPress={() => this.onShareProduct(product.id)}>
                                                <Image source={require('../assets/share.png')} style={{ height: 50, width: 50 }} />
                                            </TouchableOpacity>
                                            <Text onPress={() => this.onShareProduct(product.id)} style={{ textDecorationLine: 'underline', paddingLeft: 10, fontWeight: 'bold', }}>Share This Product</Text>

                                        </View>
                                    </View>
                                    <View style={{ paddingTop: 10 }}>
                                        <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                    </View>
                                    {/* ===== Similar Produts ===== */}
                                    {/* {this.state.prodData.length > 0 ? <>
                                        <View style={{ paddingHorizontal: 5, borderBottomWidth: 3, borderTopWidth: 3, borderTopColor: '#efefef', borderBottomColor: '#efefef' }}>
                                            <Text style={{ fontWeight: 'bold', paddingLeft: 10, textTransform: 'uppercase', fontFamily: 'Roboto', fontSize: 13, letterSpacing: 2, paddingTop: 5 }}>You may also like</Text>
                                            <View style={{ padding: 3 }}>
                                                <FlatList showsHorizontalScrollIndicator={false} horizontal={true} data={this.state.prodData} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDisplay', { product: item, from: 'productListing' })} style={{ width: Dimensions.get('window').width / 2, padding: 5, }}>
                                                            <View style={{ borderRadius: 5, backgroundColor: '#fff' }}>
                                                                <Image source={{ uri: item?.productListings[0]?.medias[0]?.mediaUrl }} style={{ width: '100%', height: 170, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} resizeMode="cover" />
                                                                <Text style={{ textTransform: 'capitalize', fontFamily: 'Roboto', color: '#959595', fontSize: 12, paddingTop: 3 }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                                                                <View style={{ flexDirection: 'row', paddingTop: 4, paddingHorizontal: 5, paddingVertical: 5 }}>
                                                                    <Text style={{ fontSize: 11, color: '#D11805' }}>₹{item.productListings[0].sellingPrice}</Text>
                                                                    {item.productListings[0].mrp
                                                                        -

                                                                        item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, textDecorationLine: 'line-through', paddingHorizontal: 5 }}>₹{item.productListings[0].mrp}</Text>}
                                                                    {item.productListings[0].mrp
                                                                        -

                                                                        item.productListings[0].sellingPrice > 0 && <Text style={{ fontSize: 11, fontWeight: 'bold' }}>Save ₹{
                                                                            item.productListings[0].mrp
                                                                            -

                                                                            item.productListings[0].sellingPrice

                                                                        }</Text>}
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }} />
                                            </View>
                                        </View></> : null}
                                  */}
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <View style={{ borderBottomColor: '#efefef', borderBottomWidth: 0.8, paddingVertical: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={require('../assets/box.png')} style={{ height: 30, width: 30 }} />
                                                <Text style={{ fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 10 }}>Sold & Fulfilled by</Text>
                                            </View>
                                            <Text>Inchpaper Private Limited</Text>
                                        </View>
                                        <View style={{ paddingTop: 10, borderBottomColor: '#efefef', borderBottomWidth: 0.8, paddingBottom: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image source={require('../assets/shield.png')} style={{ height: 30, width: 30 }} />
                                                <Text style={{ fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 10 }}>100% Genuine Products</Text>
                                            </View>
                                            <Text>All Products are far from expiry, and procured directly from the brand or authorized importers of the brand</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ width: '25%', paddingVertical: 10 }}>

                                                <Image source={require('../assets/free_shipping.png')} style={{ height: 40, width: 40, alignSelf: 'center' }} />

                                                <Text style={{ textAlign: 'center', paddingTop: 10 }}>Shipping Across India</Text>
                                            </View>
                                            <View style={{ width: '25%', paddingVertical: 10 }}>
                                                <Image source={require('../assets/wallet_black.png')} style={{ height: 40, width: 40, alignSelf: 'center' }} />
                                                <Text style={{ textAlign: 'center', paddingTop: 10 }}>Easy Payment Options</Text>
                                            </View>
                                            <View style={{ width: '25%', paddingVertical: 10 }}>
                                                <Image source={require('../assets/return_black.png')} style={{ height: 40, width: 40, alignSelf: 'center' }} />
                                                <Text style={{ textAlign: 'center', paddingTop: 10 }}>Over 10000+ Products</Text>
                                            </View>
                                            <View style={{ width: '25%', paddingVertical: 10 }}>

                                                <Image source={require('../assets/shield_black.png')} style={{ height: 40, width: 40, alignSelf: 'center', padding: 10, borderRadius: 360, borderWidth: 0.5, paddingVertical: 10 }} />

                                                <Text style={{ textAlign: 'center', paddingTop: 10 }}>Authenticity Guaranteed</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* ===== Product Details ======= */}
                                    <View style={{ padding: 10 }}>
                                        <View style={{ padding: 10, backgroundColor: '#F4F4F4', borderRadius: 5 }}>
                                            <Text style={{ fontSize: 13, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 'bold', color: '#615E5E', paddingVertical: 8 }}>Product Details</Text>
                                            <View style={{ backgroundColor: '#9B9696', height: 1 }} />
                                            <HTML
                                                baseFontStyle={{ fontSize: 14 }}
                                                containerStyle={{ paddingHorizontal: 5 }}
                                                html={product.description}
                                                imagesMaxWidth={Dimensions.get('window').width}
                                            />

                                        </View>
                                    </View>

                                </View>




                                {/* ===== Foooter ====== */}
                                <SocialScreen />


                            </ScrollView>
                        </View>
                        {
                            this.state.show ? <View>
                                <View style={{ alignContent: 'center', justifyContent: 'center', alignSelf: "center", width: "100%" }}>

                                    <TouchableOpacity
                                        onPress={() => this.handleAddToCart(product, indexOfSelecetdVarient)}
                                        style={{ padding: 12, backgroundColor: Colors.primary, width: '100%', borderRadius: 3 }}>
                                        <Text style={{ textAlign: 'center', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff', fontFamily: 'sans' }}>Add to cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> : null
                        }
                    </View >
                );
            }
        }
    }
}
const styles = StyleSheet.create({
    variantText: {
        fontWeight: '700',
    },
    verient: {
        marginHorizontal: 10,
        marginVertical: 6,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderWidth: 0.7,

        borderRadius: 5,
        width: SCREEN_WIDTH / 2 - 20,
    },
    variantType: { fontSize: 14, fontWeight: '700', padding: 10 },
    discountText: {
        fontSize: 10,
        fontWeight: '700',
        color: 'gray',
        marginLeft: 15,
        alignSelf: 'center',
        color: 'green',
    },
    mrp: {
        textDecorationLine: 'line-through',
        fontSize: 14,
        fontWeight: '700',
        color: 'gray',
        marginLeft: 15,
        alignSelf: 'center',
    },
    sellingPrice: {
        fontSize: 20,
        fontWeight: '700',
    },
    priceView: {
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingBottom: 10,
    },
    productname: { fontSize: 20, padding: 10, color: 'gray' },
    header: {
        minWidth: SCREEN_WIDTH,
        backgroundColor: '#ea0016',
        height: 70,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
        justifyContent: 'space-between',
    },
    backBtnTouchableView: {
        height: 42,
        width: 42,
        borderRadius: 360,
        marginLeft: -3.5,
        backgroundColor: '#ea0016',
        justifyContent: 'center',
    },
    searchIcon: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    backBtnImage: {
        width: 18,
        height: 18,
        padding: 5,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 360,
        backgroundColor: 'white',
        elevation: 2,
    },
    backBtnView: {
        height: 35,
        width: 35,
        borderRadius: 360,
        elevation: 2,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    activityIndicatorView: {
        position: 'absolute',
        zIndex: 1000,
        alignSelf: 'center',
        marginTop: 300,
    },
    imageStyle: {
        marginHorizontal: 10,
        height: SCREEN_WIDTH - 20,
        width: SCREEN_WIDTH - 20,
        resizeMode: 'contain',
        backgroundColor: 'white',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SubsDetailList)