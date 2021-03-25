import Axios from 'axios';
import React, { Component } from 'react';
import { StatusBar, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { Header, } from 'react-native-elements';
import Stars from 'react-native-stars';
import { connect } from 'react-redux';
import { checkProductReviewUrl, postReviewUrl, supplierId } from '../../Config/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { toast } from '../Functions/functions';
import { Colors } from '../config/GlobalContants';




const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        favourites: state.favourites,
        login: state.login,
        visitedProfileOnes: state.visitedProfileOnes,
        addresses: state.addresses,
        nearestSupplier: state.nearestSupplier,
        user: state.user
    };
};

class WriteReviewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            stars: 0,
            reviewd: [],
            reviewdData: [],
            reviewIndex: '',
            isLoading: false,
        }
    }
    async componentDidMount() {
        await this.checkReview();
    }
    checkReview = async () => {
        this.setState({ reviewdData: [], isLoading: true })
        var cartData = this.props.route.params.data;
        var newArr = [];
        for (var i = 0; i < cartData.length; i++) {
            await this.checkData(cartData[i], newArr)
            console.log('newwwww', newArr)
        }
        this.setState({ reviewdData: newArr, isLoading: false })
        // if (newArr.length, this.props.route.params.data?.length) {
        //         this.setState({ reviewdData: newArr, isLoading: false })
        //     }
        // this.props.route.params.data?.map(async (item, index) => {
        //     var dataIds = [item.productListingId]
        //     var data = []
        //     var url = checkProductReviewUrl(this.props.login.userId, item.productListingId);
        //     console.log('urlof check reiew', url)
        //     await Axios.get(url, {
        //         headers: {
        //             Authorization: 'bearer' + this.props.login.accessToken,
        //             'Content-type': 'application/json',
        //         }
        //     }).then(resp => {
        //         console.log('check review data', resp.data.object[0]?.productListing?.id)
        //         data = { pId: resp.data.object[0]?.productListing?.id, totalReview: resp.data.object.length, review: resp.data.object[0]?.review, rate: resp.data.object[0]?.rating }
        //     }).catch(err => console.log('error at check review', err))
        //     newArr.push(data);
        //     console.log('new Arrr', newArr)
        // })
        // if (newArr.length, this.props.route.params.data?.length) {
        //     this.setState({ reviewdData: newArr, isLoading: false }, () => console.log('review data stt', this.state.reviewdData))
        // }
    }

    checkData = async (item, newArr) => {
        // console.log('item', item)
        var data = []
        var url = checkProductReviewUrl(this.props.login.userId, item.productListingId);
        console.log('urlof check reiew', url)
        await Axios.get(url, {
            headers: {
                Authorization: 'bearer' + this.props.login.accessToken,
                'Content-type': 'application/json',
            }
        }).then(resp => {
            console.log('check review data', resp.data.object)
            data = { pId: resp.data.object.length == 0 ? item.productListingId : resp.data.object[0]?.productListing?.id, totalReview: resp.data.object.length, review: resp.data.object[0]?.review, rate: resp.data.object[0]?.rating }
        }).catch(err => console.log('error at check review', err))

        return newArr.push(data);
    }
    setData = () => {
        var cartData = this.props.route.params?.data;
        var reviewData = this.state.reviewdData;
        console.log('revid', reviewData)
        for (var i = 0; i < cartData.length; i++) {

            if (cartData[i].productListingId == reviewData[i]?.pId) {
                console.log('pid mil gayi', cartData[i].productListingId, this.state.reviewdData[i]?.pId)
            }
        }
        // })
    }
    postReview = async (cartId) => {
        var body = {
            productListing: cartId,
            review: this.state.message,
            rating: this.state.stars,
            supplier: supplierId,
            customer: this.props.login.userId,
        };
        var url = postReviewUrl();
        console.log('review', body)
        await Axios.post(
            url,
            body,
            {
                headers: {
                    Authorization: 'bearer ' + this.props.login.accessToken,
                    'Content-type': 'application/json',
                },
                //   timeout: 15000,
            },
        )
            .then(response => {
                console.log('review data on post->', this.state.reviewIndex);
                this.state.reviewd.push(this.state.reviewIndex)
                this.setState({
                    message: '',

                    stars: 0,
                });
                this.checkReview();
                if (this.props.route.params?.data.length == 1) {

                    this.props.navigation.goBack()
                }

                toast('Thanks for your Feedback !');
            })
            .catch(error => {
                toast(error.message)
                console.log('Error review', error);
            });
    };
    render() {
        // console.log('reviewd index', this.state.reviewdData)

        return (
            <View style={{ flex: 1, backgroundColor: '#F8F9F9' }}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" />
                <Header backgroundColor='#fff'
                    leftComponent={
                        <Icon name="keyboard-backspace" color="#5E5F5E" size={25} onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={<View><Text>Write Review</Text></View>}
                // rightComponent={{ text: 'POSt', style:{ textTransform: 'uppercase', fontSize: 15, color: '#F5B041', top: '15%', fontWeight: 'bold' }  }}
                />
                {this.state.isLoading ?
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator size="large" color={Colors.primary} style={{ justifyContent: 'center', flex: 1 }} />
                    </View>
                    : <FlatList
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            // console.log('feed', this.state.reviewdData[index]?.pId == item.productListingId, item?.productListing?.product?.name)
                            return (
                                <View
                                    elevation={0.5}
                                    style={[
                                        // Layout.row,
                                        {
                                            marginVertical: 1,
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            width: '100%',
                                            backgroundColor: 'white',
                                        },
                                    ]}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            source={{ uri: item?.medias[0]?.mediaUrl }}
                                            style={{ height: 52, width: 52, marginHorizontal: 8, borderWidth: 1 }}
                                        />
                                        <View style={{ width: '90%' }}>
                                            <Text
                                                style={[

                                                    { fontWeight: 'bold', marginBottom: 2 },
                                                ]}>
                                                {item?.productListing?.product?.name}
                                            </Text>
                                            <Text style={[{ marginBottom: 5 }]}>
                                                {this.state.reviewdData[index]?.pId == item.productListingId ? this.state.reviewdData[index]?.totalReview > 0 ? "Rated" : 'Rate this product' : 'Rate this product'}
                                            </Text>

                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                                        <Stars
                                            update={(val) => { this.setState({ stars: val, reviewIndex: index }) }}
                                            spacing={20}
                                            backingColor={'#efefef'}
                                            starSize={40}
                                            default={this.state.reviewdData[index]?.totalReview > 0 ? this.state.reviewdData[index]?.rate : ''}
                                            disabled={this.state.reviewdData[index]?.totalReview > 0 ? true : false}
                                            count={5}
                                            fullStar={<Icon name="star-face" color={'#fff'} style={{ borderWidth: 0.5, borderRadius: 5, padding: 3, backgroundColor: Colors.primary, borderColor: Colors.primary }} size={20} />}
                                            emptyStar={<Icon name="star-outline" color="#000" style={{ borderWidth: 0.5, borderRadius: 5, padding: 3 }} size={20} />}
                                        />
                                    </View>
                                    <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <View elevation={0.6} style={[styles.searchBarContainer]}>
                                            <TextInput

                                                editable={this.state.reviewdData[index]?.totalReview > 0 ? false : true}
                                                placeholder="Describe your experience (Optional)"

                                                multiline={true} value={this.state.reviewIndex === index ? this.state.message : ''} onChangeText={(text) => this.setState({ reviewIndex: index, message: text })}
                                                value={this.state.reviewdData[index]?.totalReview > 0 ? this.state.reviewdData[index]?.review : this.state.message}
                                                style={[styles.textInputSearch, this.state.reviewdData[index]?.totalReview > 0 ? { color: '#c1c1c1' } : { color: 'black' }]}
                                                underlineColorAndroid={'transparent'}
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={[styles.textSearchButton, this.state.reviewdData[index]?.totalReview > 0 ? { backgroundColor: '#c1c1c1' } : { backgroundColor: '#000' }, { alignContent: 'center', justifyContent: 'center', alignItems: "center" }]}
                                            onPress={() => {
                                                if (this.state.reviewdData[index]?.totalReview > 0) {
                                                    toast('Already Reviewd')
                                                } else { this.postReview(item.productListingId) }
                                            }}
                                        >
                                            <Icon name="arrow-right" color={'#fff'} size={28} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            )
                        }}
                        extraData={this.state.reviewdData}
                        data={this.props.route.params?.data}
                        keyExtractor={(item, index) => item + index}
                    />}
                {/* <View style={{ flex: 1 }}>
                    <View style={{ paddingVertical: 20 }}>
                        <Stars
                            default={0}
                            spacing={20}
                            fullStar={<Icon name={'star-face'} size={40} color={Colors.primary} />}
                            emptyStar={<Icon name={'star-outline'} size={40} color={'#CACFD2'} />}
                            count={5}
                            starSize={40}
                            val={this.state.stars}
                            update={(val) => this.setState({ stars: val })}
                        />
                    </View>
                    <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                        <TextInput onChangeText={(text) => this.setState({ message: text })} multiline={true} placeholder="Describe your experience (optional)"
                            style={{ padding: 10, borderColor: "#40a71b", borderWidth: 2, width: '90%', borderRadius: 3 }} />
                        <Text style={{ alignSelf: 'flex-end', padding: 10, paddingRight: '5%', color: '#797D7F' }}>{this.state.message.length}/500</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={{
                            backgroundColor: "#40A71B",
                            width: '90%',
                            padding: 15,
                            alignSelf: 'center',
                            borderRadius: 5
                        }}
                            onPress={
                                () => {

                                    if (this.state.stars == 0) {
                                        warnToast("Please select rating")
                                    }
                                    else {
                                        this.postReview(this.props.route.params.id);
                                    }

                                }
                            }>
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'SFUIText-Bold'
                            }}>Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    searchBarContainer: {
        // paddingLeft: 8,
        // marginHorizontal: 8,
        marginBottom: 10,
        width: '80%',
        // height: 60,
        borderColor: '#f0f0f0',
        borderWidth: 0.7,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    textInputSearch: {
        paddingLeft: 10,
        width: '95%',

        textAlign: 'justify'
    },
    textSearchButton: {
        marginBottom: 10,
        width: 48,
        borderRadius: 30,

        height: 48,
    },
});
export default connect(mapStateToProps)(WriteReviewScreen)