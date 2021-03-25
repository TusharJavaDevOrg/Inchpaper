import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Picker, Modal, CheckBox } from "react-native"
import LottieView from 'lottie-react-native';
import { Header } from "react-native-elements";
var Querystringified = require('querystringify');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconHeaderComponenet from "../Components/IconHeaderComponenet";
import TwoIconHeaderComponent from "../Components/TwoIconHeaderComponent";
import { Colors } from "../config/GlobalContants";
import ElevatedView from "react-native-elevated-view";
import { TextInput } from "react-native";
import { bulkOrderUrl, supplierId, testPhoneNumber } from "../../Config/Constants";
import { TouchableOpacity } from "react-native";
import { toast, warnToast } from "../Functions/functions";
import { Platform } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { ActivityIndicator } from "react-native";
import { Linking } from "react-native";
import { connect } from "react-redux";
import { addAbondonedId, addSubsCatFaq, deleteAbandoneId } from "../Redux/Cart/ActionCreators";
import moment from "moment";
import DatePicker from 'react-native-datepicker'
class FaqueScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            email: '',
            city: '',
            age: this.props.route.params?.subCat,
            genderIndex: 0,
            popUp: false,
            dob: '',
            className: '',
            school: '',
            areaInterest: [{
                id: '1',
                Choose: false,
                Name: 'Art & Craft',
            }, {
                id: '2',
                Choose: false,
                Name: 'Colouring',
            }, {
                id: '3',
                Choose: false,
                Name: 'Drawing',
            }, {
                id: '4',
                Choose: false,
                Name: 'Craft Work',
            }],
            interest: [],
            colours: '',
            chosenDate: moment().format('YYYY-MM-DD'),
            isLoading: false,
            show: false,
            promoDiscount: 0,
        }
    }
    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        this.setState({ chosenDate: currentDate });
    };

    showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    showDatepicker = () => {
        this.setState({ show: !this.state.show })
    };
    selectCat(item) {
        var arr = this.state.interest;

        if (!item.Choose) {
            const newArray = [...this.state.areaInterest];
            const replaceArray = {
                id: item.id,
                Name: item.Name,
                Choose: !item.Choose,


            };
            newArray.splice(newArray.findIndex(ele => ele.id === item.id), 1, replaceArray);
            this.setState({ areaInterest: newArray });

            this.state.interest.push(
                item.Name
            )
        } else {
            const newArray = [...this.state.areaInterest];
            const replaceArray = {
                id: item.id,
                Name: item.Name,
                Choose: !item.Choose,
            };

            newArray.splice(newArray.findIndex(ele => ele.id === item.id), 1, replaceArray);
            this.setState({ areaInterest: newArray, });

            const deleteArrayValue = [...this.state.interest];
            deleteArrayValue.splice(deleteArrayValue.findIndex(ele => ele === item.Name), 1);
            this.setState({ interest: deleteArrayValue }, () => console.log('delete array', deleteArrayValue));
        }
        console.log('itemmmmm', this.state.interest)
    }
    componentDidMount() {
        var cartData = this.props.route.params?.data;
        this.getPromoWalletAndMainWalletBalance(cartData[0].sellingPrice)
    }


    getPromoWalletAndMainWalletBalance = async (cartTotal) => {
        var walletData = this.props.walletData.wallet;
        this.setState({
            walletbalanncedata: walletData,
        });
        var promoDiscount = 0;
        if (this.props.walletData.wallet.promoWalletAmount != 0) {
            if (
                Math.round(cartTotal * 0.1) >
                this.props.walletData.wallet.promoWalletAmount
            ) {
                promoDiscount = this.props.walletData.wallet.promoWalletAmount;
            } else {
                promoDiscount = Math.round(cartTotal * 0.1);
            }
            this.setState({ promoDiscount: promoDiscount });
        } else {
            this.setState({ promoDiscount: 0 });
        }
    };

    onChoose() {
        this.setState({
            SavedPokemon: this.state.selectedItems,
            popUp: false
        })
    }


    onOrderPlace = async () => {
        var cartData = this.props.route.params?.data;
        const { name, age, genderIndex, dob, className, school, interest, colours, promoDiscount } = this.state;
        var fName = "", lName = "";
        if (name == "") {
            warnToast('Please enter name');
        }
        else if (genderIndex == 0) {
            warnToast('Please select gender');
        }
        else if (dob == "") {
            warnToast('Please enter Date of birth');
        }
        else if (className === "") {
            warnToast('Please enter class');
        }
        else if (school == "") {
            warnToast('Please enter School Name');
        }
        else if (interest == "" || interest.length === 0) {
            warnToast('Please enter area of interest');
        }
        else if (colours == "") {
            warnToast('Please enter Most liked colours');
        }
        else {
            this.setState({ isLoading: true })
            var today = new Date();
            var faqData = {
                name: name,
                ageGroup: age,
                gender: genderIndex == 1 ? 'Male' : 'Female',
                dateOfBirth: dob,
                class: className,
                school: school,
                areaOfInterest: interest.toString(),
                mostLikedColor: colours,
            }
            console.log('body of bulk order', JSON.stringify(faqData))
            var deliverCharge = 50;
            var carTotal = cartData[0].sellingPrice + deliverCharge - promoDiscount;
            var body = {
                cartProductRequests: cartData,
                orderAmount: carTotal,
                paymentMode: "NOT SELECTED YET",
                supplier:
                    supplierId,
                customer: this.props.login.userId,
                orderFrom: Platform.OS === 'ios' ? 'ios' : 'android',
                promoWallet: promoDiscount,
                couponDiscount: 0,
                giftWrap: 0,
                mainWallet: 0,
                tip: 0,
                tax: 0,
                convenienceFee: deliverCharge,
                // couponDiscount: 0.0,
                deliveryType: 'HOME-DELIVERY',
                requiredDate: today, //doubt
                requiredTimeString: '',
                message: JSON.stringify(faqData),
                subTotal: cartData[0].sellingPrice,
            }
            this.props.addSubsCatFaq(faqData);
            console.log('body of bulk order', body)
            if (this.props.addresses.userAddresses.length > 0) {
                this.props.navigation.navigate('AddedScreenAddress', { body: body, cartTotal: cartData[0].sellingPrice })
            } else {
                this.props.navigation.navigate('CheckoutAddress', { body: body, cartTotal: cartData[0].sellingPrice })
            }

        }
    }
    setDate = (newDate) => {
        this.setState({ chosenDate: newDate });
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
        var cartData = this.props.route.params?.data;
        var subCatName = this.props.route.params?.subCat;
        console.log('subscc data', subCatName)
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Question & Answer', style: { right: 15 } }}
                    rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
                />
                <ScrollView keyboardShouldPersistTaps={'handled'} style={{ flex: 1 }}>

                    <View style={{ flex: 1 }}>
                        <ElevatedView elevation={1} style={{ margin: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                            <View style={{ borderTopWidth: 0.8, borderBottomWidth: 0.8, borderColor: Colors.lightGray, backgroundColor: '#ffc107', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
                                <Text style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>Please Answer Following Questions</Text>
                            </View>
                            <View style={{ paddingVertical: 10, paddingHorizontal: 10, }}>
                                <KeyboardAvoidingView style={{}} behavior={Platform.OS == 'ios' ? 'padding' : 'padding'}>
                                    {/* <Text style={{ paddingBottom: 10, paddingLeft: 10 }}>
                                        Your Details*
                            </Text> */}
                                    <View style={{ marginHorizontal: 5, }}>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Name</Text>
                                            <TextInput placeholder={'Enter your name *'} placeholderTextColor={Colors.gray} onChangeText={(text) => this.setState({ name: text })} value={this.state.name} style={[styles.inputBox, { textTransform: 'capitalize' }]} />
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Age Group</Text>
                                            <TextInput editable={false} placeholder={'Enter Age Group'} keyboardType="default" placeholderTextColor={Colors.gray} onChangeText={(text) => this.setState({ age: text })} value={this.state.age} style={styles.inputBox} />
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Gender</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity onPress={() => this.setState({ genderIndex: 1 })} style={[this.state.genderIndex === 1 ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.white }, { width: '49%', borderBottomLeftRadius: 5, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }]}>
                                                    <Text style={[this.state.genderIndex === 1 ? { color: Colors.white } : { color: Colors.black }, { padding: 10, textAlign: 'center' }]}>Male</Text>
                                                    <Icon name="human-male" size={20} style={{ paddingTop: 8 }} color={this.state.genderIndex === 1 ? Colors.white : Colors.black} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.setState({ genderIndex: 2 })} style={[this.state.genderIndex === 2 ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.white }, { width: '49%', borderBottomRightRadius: 5, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }]}>
                                                    <Text style={[this.state.genderIndex === 2 ? { color: Colors.white } : { color: Colors.black }, { padding: 10, textAlign: 'center' }]}>Female</Text>
                                                    <Icon name="human-female" size={20} style={{ paddingTop: 8 }} color={this.state.genderIndex === 2 ? Colors.white : Colors.black} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={[styles.taggs, { flexDirection: 'row', }]}>
                                            <View style={{ paddingVertical: 8 }}>
                                                <Text style={styles.heading}>Date Of Birth:</Text>
                                            </View>
                                            <DatePicker
                                                style={{
                                                    width: '70%', borderWidth: 0
                                                }}
                                                date={this.state.dob}
                                                mode="date"
                                                placeholder="Select Date"
                                                format="DD-MM-YYYY"
                                                minDate="01-01-1985"
                                                maxDate={moment().format('DD-MM-YYYY')}
                                                confirmBtnText="Confirm"
                                                placeholderTextColor={Colors.gray}
                                                cancelBtnText="Cancel"
                                                showIcon={true}

                                                customStyles={{
                                                    dateInput: {
                                                        marginLeft: 5,
                                                        borderWidth: 0

                                                    },

                                                    placeholderText: { color: Colors.gray, borderWidth: 0 }
                                                }}
                                                onDateChange={(date) => { this.setState({ dob: date }) }}
                                            />
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Class</Text>
                                            <TextInput placeholder={'Class in which your child studies *'} keyboardType="default" placeholderTextColor={Colors.gray} onChangeText={(text) => this.setState({ className: text })} value={this.state.className} style={styles.inputBox} />
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>School Name</Text>
                                            <TextInput placeholder={'Enter School Name *'} placeholderTextColor={Colors.gray} onChangeText={(text) => this.setState({ school: text })} value={this.state.school} style={styles.inputBox} />
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Area Of Interest</Text>
                                            <TouchableOpacity onPress={() => this.setState({ popUp: true })} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
                                                <Text style={[this.state.interest.length > 0 ? { fontSize: 14, color: Colors.black } : { fontSize: 14, color: Colors.gray }]} onPress={() => this.setState({ popUp: true })}>{this.state.interest.length > 0 ? this.state.interest.toString() : 'Select Area of Interests'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.taggs}>
                                            <Text style={styles.heading}>Most Liked Colours</Text>
                                            <TextInput placeholder={'Enter Most Liked Colours Name *'} keyboardType="default" placeholderTextColor={Colors.gray} onChangeText={(text) => this.setState({ colours: text })} value={this.state.colours} style={styles.inputBox} />
                                        </View>
                                    </View>
                                </KeyboardAvoidingView>
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
                    </View>
                </ScrollView>
                <Modal transparent={true} visible={this.state.popUp}>
                    <View style={styles.modalMain}>
                        <View style={styles.modalView}>
                            <View style={styles.modalTitleView}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{}} onValueChange={(itemValue, itemIndex) => this.setState({ interest: itemValue })} style={styles.modalTitle}>Select Area of Interests</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ popUp: false })} >
                                    <Icon name="close" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                            {this.state.areaInterest.length > 0 ?
                                <ScrollView showsVerticalScrollIndicator={true} style={{ paddingHorizontal: 20 }}>
                                    {this.state.areaInterest.map(item => {
                                        var n = this.state.interest;
                                        return (
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <CheckBox value={item.Choose} onValueChange={() => this.selectCat(item)} color="black" />
                                                    <Text style={
                                                        {
                                                            marginTop: 5,
                                                            color: !item.Choose ? "black" : "black",
                                                            fontWeight: item.Choose ? "bold" : "normal",

                                                        }}
                                                    >
                                                        {item.Name}</Text>
                                                </View>
                                                <>

                                                </>
                                            </View>

                                        )
                                    })}
                                </ScrollView>
                                :
                                <Text style={{}}>No Area of Interests found</Text>
                            }
                            <TouchableOpacity onPress={() => this.onChoose()} style={styles.chooseButton}>
                                <Text style={styles.chooseText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    inputBox: {

        padding: 10,
        color: Colors.black,
        // marginBottom: 10,
        // height: 50,
        // borderBottomWidth: 0.8,
        // borderBottomColor: Colors.gray,
        // borderRadius: 5,
    }, taggs: {
        marginVertical: 5,
        borderWidth: 0.8, borderColor: Colors.lightGray, borderRadius: 5, backgroundColor: Colors.placeholder
    },
    heading: {
        paddingVertical: 2,
        paddingLeft: 5,
        fontWeight: "bold",
        letterSpacing: 1,
        color: Colors.gray
    },

    textStyle: {
        margin: 24,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pickerStyle: {
        height: 150,
        width: "80%",
        color: '#344953',
        justifyContent: 'center',
    },
    modalMain: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        flex: 1,
        position: 'absolute',
        left: 0, right: 0,
        top: 0, bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitleView: {
        padding: 10,
        borderBottomWidth: 1,
        flexDirection: "row",
        borderBottomColor: "#efefef"
    },
    modalView: {
        backgroundColor: "#fff",
        width: '80%',
        height: 'auto',
        maxHeight: '60%',
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 15,
        color: '#000'
    },
    chooseButton: {
        backgroundColor: Colors.primary,
        padding: 8,
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 100,
        borderRadius: 5
    },
    chooseText: {
        color: "#fff",
        textAlign: "center", fontFamily: 'Poppins-Regular',
    },

})
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        user: state.user,
        walletData: state.walletData,
        addresses: state.addresses,
        abandonedCheckout: state.abandonedCheckout,
        favourites: state.favourites, subscriptionData: state.subscriptionData
    };
};

const mapDispatchToProps = (dispatch) => ({
    addSubsCatFaq: (data) => dispatch(addSubsCatFaq(data)),
    addAbondonedId: (id) => dispatch(addAbondonedId(id)),
    deleteAbandoneId: () => dispatch(deleteAbandoneId())
});

export default connect(mapStateToProps, mapDispatchToProps)(FaqueScreen)