import React, { Component } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import { termsAndConditionsUrl } from '../../Config/Constants';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import HTML from 'react-native-render-html';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Colors } from '../config/GlobalContants';
import DescriptionPage from '../ProductDetails/DescriptionPage';
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
class TermsAndConditionScreen extends Component {
    constructor(props) {
        super(props);
        // console.log('props at load', props);
        this.state = {
            count: 1,
            isLoading: true,
            termsOfService: undefined,
        };
    }
    componentDidMount() {
        this.getTermsAndCondition();
    }
    getTermsAndCondition() {
        var url = termsAndConditionsUrl();
        console.log('url', url)
        this.setState({ isLoading: true });

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
                        termsOfService: response.data.object[0].termsOfService,
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
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Terms And Conditions' }}
                />

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
                        {!this.state.isLoading && this.state.termsOfService == undefined ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>Not Available</Text>
                            </View>
                        ) : (
                                // <HTML
                                //     baseFontStyle={{ fontSize: 8 }}
                                //     containerStyle={{ paddingHorizontal: 15, marginBottom: 150 }}
                                //     html={this.state.termsOfService}
                                //     imagesMaxWidth={Dimensions.get('window').width}
                                // />
                                <DescriptionPage data={this.state.termsOfService} />
                            )}
                    </ScrollView>

                </View>

            </View>
        )
    }
}
export default connect(mapStateToProps)(TermsAndConditionScreen)