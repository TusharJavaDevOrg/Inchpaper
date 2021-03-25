import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { connect } from 'react-redux';
import { getUserData, loginFail, loginSuccess } from '../Redux/Auth/ActionCreatore';
import { toast } from '../Functions/functions';
import { supplierId, updateuserProfileUrl } from '../../Config/Constants';
import Axios from 'axios';
import { ToastAndroid } from 'react-native';
import { Colors } from '../config/GlobalContants';
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
const mapDispatchToProps = (dispatch) => ({
    skipLoginForNow: () => dispatch(skipLoginForNow()),
    loginSuccess: (userData) => dispatch(loginSuccess(userData)),
    loginFail: () => dispatch(loginFail()),
    getUserData: (customerId) => dispatch(getUserData(customerId)),
});
class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            description: '',
            email: '',
            getuserDataLoading: false,
            userData: {},
            updatingUserProfile: false,
            hasSelectedImage: false,
            avatarSource: '',
            avatarPath: '',
        };
    }
    componentDidMount() {
        this.props.getUserData(this.props.login.userId);
        this.props.user.firstName
            ? this.setState({ firstName: this.props.user.firstName })
            : null;
        this.props.user.lastName
            ? this.setState({ lastName: this.props.user.lastName })
            : null;
        this.props.user.phoneNumber
            ? this.setState({ phoneNumber: this.props.user.phoneNumber })
            : null;
        this.props.user.email
            ? this.setState({ email: this.props.user.email })
            : null;

        this.props.user.profilePictureUrl
            ? this.setState({ avatarSource: { uri: this.props.user.profilePictureUrl } })
            : null;
        console.log('user', this.props.user)
    }

    getuserData = async (customerId) => {
        this.setState({ getuserDataLoading: true });

        const url = getUserProfile(customerId);

        await Axios.get(url, {
            headers: {
                Authorization: 'bearer ' + '',
                'Content-type': 'application/json',
            },
            timeout: 15000,
        })
            .then((response) => {
                console.log('User Profile ->', JSON.stringify(response.data.object[0]));
                this.setState({
                    getuserDataLoading: false,
                    userData: response.data.object[0],
                });
            })
            .catch((err) => {
                this.setState({ getuserDataLoading: false });
                // console.log(err.message);
            });
    };


    // postUserDataHere = async (custId) => {
    //     console.log('now uploading data');
    //     const { firstName, lastName, phoneNumber, email } = this.state;
    //     const url = updateuserProfileUrl(custId);

    //     var dataToBeUploaded = this.state.userData;
    //     firstName === '' ? null : (dataToBeUploaded.firstName = firstName);
    //     lastName === '' ? null : (dataToBeUploaded.lastName = lastName);
    //     phoneNumber === '' ? null : (dataToBeUploaded.phoneNumber = phoneNumber);
    //     email === '' ? null : (dataToBeUploaded.emailId = email);


    //     const stringifiedDataToBeUploaded = JSON.stringify(dataToBeUploaded);
    //     // console.log('Data to be uploaded', dataToBeUploaded);
    //     // console.log('Data to be uploaded', stringifiedDataToBeUploaded);
    //     // dataToBeUploaded.description = this.state.description;
    //     console.log('profile data', stringifiedDataToBeUploaded, url)
    //     await Axios.put(url, stringifiedDataToBeUploaded, {
    //         headers: {
    //             Authorization: 'Bearer ' + this.props.login.accessToken,
    //             'Content-Type': 'application/json',
    //         },
    //     })
    //         .then((resp) => {
    //             console.log('here is response from profile posting', resp);
    //             if (resp.data.status) {
    //                 this.setState({
    //                     firstName: '',
    //                     lastName: '',
    //                     phoneNumber: '',
    //                     description: '',
    //                     email: '',
    //                 });
    //                 this.setState({ updatingUserProfile: false });
    //                 this.props.getUserData(this.props.login.userId);
    //                 toast('Profile Updated');
    //                 this.props.navigation.goBack();
    //             }
    //         })
    //         .catch((err) => {
    //             // console.log(err.message);
    //             this.setState({ updatingUserProfile: false });
    //             toast('Could not update profile, please try again.');
    //         });
    // };
    postUserData = async (customerId) => {
        const url = updateuserProfileUrl(customerId);

        const { firstName, lastName, phoneNumber, email } = this.state;
        if (firstName === "") {
            toast('please enter first name')
        }

        else if (email === "") {
            toast('please enter email address')
        }
        else if (phoneNumber === "") {
            toast('please enter mobile number')
        }

        else {
            const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (
                this.state.email !== '' &&
                emailRe.test(String(this.state.email).toLowerCase())
            ) {

            } else if (this.state.email !== '') {
                this.setState({ updatingUserProfile: false });
                toast(
                    'Please enter a valid email.');
                return;
            }
            this.setState({ updatingUserProfile: true });
            var lName = ""

            var body = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNo: this.state.phoneNumber,
                emailId: this.state.email,
                supplierId: supplierId,
                id: this.props.login.userId,
                userName: this.state.phoneNumber + '/' + supplierId


            }
            console.log('Data to be uploaded', url, 'body', body);
            // console.log('urllll', url)
            await Axios.put(url, body, {
                headers: {
                    Authorization: 'Bearer ' + this.props.login.accessToken,
                    // 'Content-Type': 'application/json',
                },
            })
                .then((resp) => {
                    console.log('here is response from profile posting', resp.data);
                    if (resp.data.status) {
                        this.setState({ updatingUserProfile: false });
                        this.props.getUserData(this.props.login.userId);
                        toast('Profile Updated.');
                        this.setState({ isEdit: false })
                        this.props.navigation.goBack();
                    }
                })
                .catch((err) => {
                    // console.log(err.message);
                    this.setState({ updatingUserProfile: false });
                    toast('Could not update profile, please try again.');
                });
        }
    };
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Profile' }}
                />
                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                    <KeyboardAvoidingView style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputViewStyle}>
                                <TextInput placeholder="First Name" value={this.state.firstName} onChangeText={(text) => this.setState({ firstName: text })} style={styles.inputStyle} />
                            </View>
                            <View style={styles.inputViewStyle}>
                                <TextInput placeholder="Last Name" value={this.state.lastName} onChangeText={(text) => this.setState({ lastName: text })} style={styles.inputStyle} />
                            </View>
                            <View style={styles.inputViewStyle}>
                                <TextInput placeholder="Email Address" value={this.state.email.replace(' ', '')} onChangeText={(text) => this.setState({ email: text.replace(' ', '') })} style={styles.inputStyle} />
                            </View>
                            <View style={styles.inputViewStyle}>
                                <TextInput editable={false} placeholder="Phone Number" value={this.state.phoneNumber.replace(' ', '')} onChangeText={(text) => this.setState({ phoneNumber: text.replace(' ', '') })} keyboardType="phone-pad" maxLength={10} style={styles.inputStyle} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
                <View>
                    <TouchableOpacity onPress={() => this.postUserData(this.props.login.userId)} style={{ padding: 15, backgroundColor: Colors.primary }}>
                        <Text style={{ fontSize: 15, color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center', fontFamily: 'sans-serif-light', letterSpacing: 1 }}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputStyle: {
        borderBottomColor: '#AAADA9',
        borderBottomWidth: 1,
        color: '#636363',
        fontSize: 15,
        height: 40,
    },
    inputViewStyle: {
        paddingVertical: 20
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);