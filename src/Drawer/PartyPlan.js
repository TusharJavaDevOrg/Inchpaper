import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TextInput } from "react-native"
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
import { TouchableOpacity, Linking, Platform } from "react-native";
import { Colors } from "../config/GlobalContants";
import ElevatedView from "react-native-elevated-view";
import { bulkOrderUrl, supplierId, testPhoneNumber } from "../../Config/Constants";
import { toast } from "../Functions/functions";
import { ScrollView } from "react-native";
import { ActivityIndicator } from "react-native";
import axios from "axios";
class PartyPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            email: '',
            city: '',
            isLoading: false,
        }
    }
    onOrderPlace = async () => {
        const { name, number, email, city } = this.state;
        var fName = "", lName = "";
        if (name == "") {
            warnToast('Please enter name');
        }
        else if (number == "") {
            warnToast('Please enter mobile number');
        }
        // else if (email == "") {
        //     warnToast('Please enter email address');
        // }
        else if (city === "") {
            warnToast('Please enter city');
        } else {
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


                subject: 'Party Planning',
                supplierId: supplierId,
                isBulkOrder: 1,
                isSubscription: 0,
            }
            // var url = 'https://www.krenai.online/api/v3/account/countactUs/';
            var url = bulkOrderUrl;
            console.log('body of bulk order', url, body)
            await axios.post(url, body, {
                header: {
                    Authorization: 'bearer ' + '',
                    'Content-type': 'application/json',
                }
            }).then((resp) => {
                console.log('resp of bulk order', resp.data)
                this.setState({ name: '', email: '', number: '', city: '', isLoading: false })
                toast('Thank You')

            }).catch((err) => {
                this.setState({ isLoading: false })
                console.log('err at bulk order', err)
            })
        }
    }
    onCall = (phone) => {
        console.log('callNumber ----> ', phone);
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
    linkOpenTo = (type) => {
        var phone = "7703860982";
        if (type === 'whatsapp') {
            // Linking.openURL(`whatsapp://send?phone=${phone}&text=`);

            Linking.openURL('whatsapp://send?text=' + '&phone=+91' + phone);
        } else if (type === 'email') {
            Linking.openURL('mailto:customer@inchpaper.com?subject=Need Help&body=');
        }
        else {
            let phoneNumber = phone;
            if (Platform.OS !== 'android') {
                phoneNumber = `telprompt:+91${phone}`;
            }
            else {
                phoneNumber = `tel:+91${phone}`;
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
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Party Planning', style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => this.onCall(+917703860982)} style={{ width: '100%' }}>
                            <Image source={require('../assets/party1.png')} style={{ height: Dimensions.get('window').height / 2.08, width: Dimensions.get('window').width / 1 }} resizeMethod="auto" resizeMode="stretch" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <ElevatedView elevation={1} style={{ margin: 10 }}>
                            <View style={{ borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: Colors.lightGray }}>
                                <Text style={{ padding: 10, textAlign: 'center' }}>GET IN TOUCH WITH US</Text>
                            </View>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                                {/* <Text style={{ paddingBottom: 10, paddingLeft: 10 }}>
                                        Your Details*
                            </Text> */}
                                <View style={{ marginHorizontal: 5 }}>
                                    <TextInput placeholder={'Enter your name *'} placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ name: text })} value={this.state.name} style={[styles.inputBox, { textTransform: 'capitalize' }]} />
                                    <TextInput placeholder={'Enter your email address '} keyboardType="email-address" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ email: text })} value={this.state.email} style={styles.inputBox} />
                                    <TextInput placeholder={'Enter your mobile number *'} maxLength={10} keyboardType="number-pad" placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ number: text.replace(testPhoneNumber, '') })} value={this.state.number.replace(testPhoneNumber, '')} style={styles.inputBox} />
                                    <TextInput placeholder={'Enter your city *'} placeholderTextColor={Colors.lightGray} onChangeText={(text) => this.setState({ city: text })} value={this.state.city} style={styles.inputBox} />
                                </View>
                            </View>
                            <View style={{ margin: 10, paddingHorizontal: 5 }}>
                                <TouchableOpacity disabled={this.state.isLoading ? true : false} onPress={() => this.onOrderPlace()} style={{ backgroundColor: Colors.primary, padding: 15, borderRadius: 3 }}>
                                    {this.state.isLoading ?
                                        <ActivityIndicator size="small" style={{ alignSelf: 'center' }} color={Colors.white} />
                                        : <Text style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold', color: Colors.white }}>
                                            SUBMIT
                                </Text>}
                                </TouchableOpacity>
                            </View>
                        </ElevatedView>
                        <ElevatedView elevation={2} style={{ backgroundColor: '#fff' }}>
                            {/* <View style={{ paddingTop: 10 }}>
                                    <View style={{ backgroundColor: '#CACACA', height: 1 }} />
                                </View> */}
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Need Help? Reach Out To Us Through</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity onPress={() => this.linkOpenTo('whatsapp')}>
                                        <Image source={require('../assets/whatsapp.png')} style={{ height: 50, width: 50 }} />
                                        <Text style={{ fontWeight: 'bold', paddingTop: 3 }}>WhatsApp</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>OR</Text>
                                    <TouchableOpacity onPress={() => this.linkOpenTo('call')}>
                                        <Image source={require('../assets/phone-call.png')} style={{ height: 50, width: 50 }} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: 3 }}>Call</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center', paddingBottom: 5 }}>Or drop one liner at <Text onPress={() => this.linkOpenTo('email')} style={{ color: 'blue', textDecorationLine: 'underline' }}>customer@inchpaper.com</Text></Text>
                        </ElevatedView>
                    </View>
                    {/* <View

                    style={{}}
                >
                    <TouchableOpacity onPress={() => this.onCall(1234567890)} style={{ padding: 15, width: '100%', backgroundColor: Colors.primary }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: Colors.white, textTransform: 'uppercase' }}>Plan Party</Text>
                    </TouchableOpacity>
                </View> */}
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
export default PartyPlan