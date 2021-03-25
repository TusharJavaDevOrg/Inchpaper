import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native"
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
import { Colors } from "../config/GlobalContants";
import ElevatedView from "react-native-elevated-view";
import { TextInput } from "react-native";
import { bulkOrderUrl, getSupplierDetail, supplierId, testPhoneNumber } from "../../Config/Constants";
import { TouchableOpacity } from "react-native";
import { toast, warnToast } from "../Functions/functions";
import { Platform } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        featuredProducts: state.featuredProducts,
        collection: state.collection,
        hasAddedRefferalCode: state.hasAddedRefferalCode,
    };
};
class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            email: '',
            detail: '',
            subject: '',
            message: '',
            isLoading: true,
        }
    }
    async componentDidMount() {
        console.log('supppp', this.props.supplier)
        await this.getDetails();
    }
    getDetails = async () => {
        await axios.get(getSupplierDetail).then((resp) => {
            console.log('detail', resp.data.object[0])
            this.setState({ detail: resp.data.object[0], isLoading: false })
        }).catch((err) => console.log('err', err))
    }
    onContact = async () => {
        const { name, number, email, city, subject, message } = this.state;
        var fName = "", lName = "";
        if (name == "") {
            warnToast('Please enter name');
        }
        else if (number == "") {
            warnToast('Please enter mobile number');
        }
        else if (subject == "") {
            warnToast('Please enter subject');
        }
        else if (message == "") {
            warnToast('Please enter your query');
        }

        else {
            const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (
                this.state.email !== '' &&
                emailRe.test(String(this.state.email).toLowerCase())
            ) {

            } else if (this.state.email !== '') {

                toast(
                    'Please enter a valid email.');
                return;
            }
            if (number.length < 10) {
                toast('Please enter a valid number')
            }
            console.log('lName', name.split(' ')[1])
            fName = name.split(' ')[0];
            if (name.split(' ')[1] !== "" && name.split(' ')[1] !== null && name.split(' ')[1] !== undefined) {
                lName = name.split(' ')[1]
            } else {
                lName = ""
            }
            this.setState({ isLoading: true })
            var body = {
                firstName: fName,
                lastName: lName,
                emailId: email,
                phoneNo: number,
                source: Platform.OS == 'ios' ? 'ios' : 'android',

                country: 'India',
                comments: message,
                isFlag: 1,
                subject: subject,
                supplierId: supplierId,
                isBulkOrder: 0,
                isSubscription: 0,
            }
            // var url = 'https://www.krenai.online/api/v3/account/countactUs/';
            var url = bulkOrderUrl;
            console.log('body of contact', url, body)
            await axios.post(url, body, {
                header: {
                    Authorization: 'bearer ' + '',
                    'Content-type': 'application/json',
                }
            }).then((resp) => {
                console.log('resp of contact us', resp.data)
                this.setState({ name: '', email: '', number: '', city: '', subject: '', message: '', isLoading: false })
                toast('Query Raised Sucessfully')

            }).catch((err) => console.log('err at contact', err))
        }
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <ActivityIndicator size={'large'} color={Colors.primary} style={{ alignSelf: 'center' }} />
                </View>
            )
        }
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Contact Us', style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                        <View style={{}}>
                            <ElevatedView elevation={3} style={{ margin: 10, }}>
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Contact Information</Text>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="office-building" color={Colors.primary} size={20} />
                                        <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>Inchpaper Private Limited</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="map-marker-outline" color={Colors.primary} size={20} />
                                        <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>Gurgaon 122001, Haryana, India.</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="phone" color={Colors.primary} size={20} />
                                        <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>+91-7703860982</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="email-outline" color={Colors.primary} size={20} />
                                        <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>customer@inchpaper.com</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="clock-outline" color={Colors.primary} size={20} />
                                        <View>
                                            <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>Monday - Saturday (10am - 7pm ET)</Text>
                                        </View>

                                    </View>
                                    {/* <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                        <MCIcon name="calendar-month-outline" color={Colors.primary} size={20} />
                                        <View>
                                            <Text style={{ fontSize: 14, paddingHorizontal: 10 }}>Sunday (11am-6pm ET)</Text>
                                        </View>

                                    </View> */}

                                </View>

                            </ElevatedView>
                            <ElevatedView elevation={1} style={{ margin: 10 }}>
                                <View style={{ borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: Colors.lightGray }}>
                                    <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Got Any Questions?</Text>
                                    {/* <Text style={{ padding: 10, textAlign: 'center' }}>Use the form below to get in touch with the sales team</Text> */}
                                </View>
                                <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                                    <Text style={{ paddingBottom: 10, paddingLeft: 10 }}>
                                        Use the form below to get in touch with the sales team
                            </Text>
                                    <View style={{ marginHorizontal: 5 }}>
                                        <TextInput placeholder={'Enter your name *'} placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ name: text })} value={this.state.name} style={[styles.inputBox, { textTransform: 'capitalize' }]} />
                                        <TextInput placeholder={'Enter your email address'} keyboardType="email-address" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ email: text })} value={this.state.email} style={styles.inputBox} />
                                        <TextInput placeholder={'Enter your mobile number *'} maxLength={10} keyboardType="number-pad" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ number: text.replace(testPhoneNumber, '') })} value={this.state.number.replace(testPhoneNumber, '')} style={styles.inputBox} />
                                        <TextInput placeholder={'Enter your subject *'} placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ subject: text })} value={this.state.subject} style={styles.inputBox} />
                                        <TextInput placeholder={'Enter your message *'} placeholderTextColor={Colors.lightGray} multiline={true} onChangeText={(text) => this.setState({ message: text })} value={this.state.message} style={[styles.inputBox, { minHeight: 80, marginBottom: 20, textAlignVertical: 'top' }]} />
                                    </View>
                                </View>
                                <View style={{ margin: 10, paddingHorizontal: 5 }}>
                                    <TouchableOpacity disabled={this.state.isLoading ? true : false} onPress={() => this.onContact()} style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 3 }}>
                                        {this.state.isLoading ?
                                            <ActivityIndicator size="small" style={{ alignSelf: 'center' }} color={Colors.white} />
                                            : <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold', color: Colors.white }}>
                                                SUBMIT
                                </Text>}
                                    </TouchableOpacity>
                                </View>
                            </ElevatedView>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    inputBox: {

        padding: 10,
        marginBottom: 10,
        height: 50,
        borderWidth: 0.8,
        borderColor: Colors.lightGray
    }
})
export default connect(mapStateToProps)(ContactUs)