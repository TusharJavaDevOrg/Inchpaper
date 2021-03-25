import React, { Component } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import { getRefundPolicyUrl, supplierId, termsAndConditionsUrl, getPrivecyPolicyUrl } from '../../Config/Constants';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import HTML from 'react-native-render-html';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Colors } from '../config/GlobalContants';
import DescriptionPage from '../ProductDetails/DescriptionPage';
import { TouchableOpacity } from 'react-native';
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
class ReturnPolicyScreen extends Component {
    constructor(props) {
        super(props);
        // console.log('props at load', props);
        this.state = {
            count: 1,
            index: 0,
            isLoading: true,
            data: undefined,
        };
    }
    componentDidMount() {
        this.getTermsAndCondition();
    }
    getTermsAndCondition() {
        var url = termsAndConditionsUrl();
        console.log('url', url)
        this.setState({ isLoading: true, data: [] });

        Axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + this.props.login.accessToken,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                // console.log('Response in ?type=termsOfService', response);
                if (response.data?.object[0]?.termsOfService) {
                    this.setState({
                        isLoading: false,
                        data: response.data.object[0].termsOfService,
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(function (error) {
                // handle error
                this.setState({ isLoading: false });
                // console.log(error);
            });
    }

    getPrivacyPolicy() {
        var url = getPrivecyPolicyUrl(supplierId);
        console.log('url', url)
        this.setState({ isLoading: true, data: [] });

        Axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + this.props.login.accessToken,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Response in ?type=termsOfService', response.data.object);
                if (response.data?.object[0]?.privacyPolicy) {
                    this.setState({
                        isLoading: false,
                        data: response.data.object[0].privacyPolicy,
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(function (error) {
                // handle error
                this.setState({ isLoading: false });
                // console.log(error);
            });
    }
    getReturnPolicy() {
        var url = getRefundPolicyUrl(supplierId);
        console.log('url', url)
        this.setState({ isLoading: true, data: [] });

        Axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + this.props.login.accessToken,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Response in ?type=termsOfService', response.data.object);
                if (response.data?.object[0]?.refundPolicy) {
                    this.setState({
                        isLoading: false,
                        data: response.data.object[0].refundPolicy,
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(function (error) {
                // handle error
                this.setState({ isLoading: false });
                // console.log(error);
            });
    }
    renderHeader = () => {
        return (
            <View style={{ height: 40, elevation: 2, backgroundColor: '#fff' }}>
                <ScrollView horizontal>
                    <TouchableOpacity onPress={() => { this.setState({ index: 1 }), this.getTermsAndCondition() }} style={[this.state.index === 1 ? { borderBottomWidth: 1, borderBottomColor: Colors.primary, padding: 10, marginHorizontal: 10, backgroundColor: '#fff' } : { padding: 10, marginHorizontal: 10, backgroundColor: '#fff' }]}>
                        <Text>
                            Terms & Condition
                </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ index: 2 }), this.getPrivacyPolicy() }} style={[this.state.index === 2 ? { borderBottomWidth: 1, borderBottomColor: Colors.primary, padding: 10, marginHorizontal: 10, backgroundColor: '#fff' } : { padding: 10, marginHorizontal: 10, backgroundColor: '#fff' }]}>
                        <Text>
                            Privacy Policy
                </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ index: 3 }), this.getReturnPolicy() }} style={[this.state.index === 3 ? { borderBottomWidth: 1, borderBottomColor: Colors.primary, padding: 10, marginHorizontal: 10, backgroundColor: '#fff' } : { padding: 10, marginHorizontal: 10, backgroundColor: '#fff' }]}>
                        <Text>
                            Return Policy
                </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Return Policy' }}
                />
                {this.renderHeader()}
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <ScrollView style={{ flex: 1, padding: 10 }} showsVerticalScrollIndicator={false}>
                        {this.state.isLoading ? (
                            <View
                                style={{
                                    alignSelf: 'center',
                                    marginTop: 300,
                                }}>
                                <ActivityIndicator size={30} color={Colors.primary} />
                            </View>
                        ) : null}
                        {!this.state.isLoading && this.state.data == undefined ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not Available</Text>
                            </View>
                        ) : (
                                // <HTML
                                //     baseFontStyle={{ fontSize: 8 }}
                                //     containerStyle={{ paddingHorizontal: 15, marginBottom: 150 }}
                                //     html={this.state.refundPolicy}
                                //     imagesMaxWidth={Dimensions.get('window').width}
                                // />
                                <DescriptionPage data={this.state.data} />
                            )}
                    </ScrollView>

                </View>

            </View>
        )
    }
}
export default connect(mapStateToProps)(ReturnPolicyScreen)