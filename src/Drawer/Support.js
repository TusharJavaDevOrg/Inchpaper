/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, ScrollView, Image, StatusBar, TextInput, ActivityIndicator, FlatList, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import FIcon from 'react-native-vector-icons/Feather'
import firebase from 'firebase';
import { supplierId } from '../../Config/Constants';
import { Colors } from '../config/GlobalContants';
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        user: state.user,
        referalCode: state.referalCode,
    };
};

class Support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snedMessage: [
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
            ],
            reciveMessage: [
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
                { "userMessage": "It is a long established fact that a reader will be distracted by the readable content of a page when", "date": "20 jan 2020" },
            ],
            texts: [],
            textInput: '',
            isChatLoading: false,
        }
    }
    async componentDidMount() {


        this.setState({ isChatLoading: true })
        if (!firebase.apps.length) {
            await this.init();
        } else {
            firebase.app(); // if already initialized, use that one
        }

        await this.observeAuth();

        this.on(message => {

            this.setState({ texts: [...this.state.texts, message], isChatLoading: false })
            // this.setState(previousState => ({
            // messages: GiftedChat.append(previousState.messages, message),

            // }))

        }
        );

    }
    componentWillUnmount() {
        this.off();
    }

    init = () =>
        firebase.initializeApp({
            apiKey: 'AIzaSyBhFIx3_uA0uNnWMQPdU43t4WNKCvLsij8',
            authDomain: 'krenai-webapp.firebaseapp.com',
            databaseURL: 'https://krenai-webapp.firebaseio.com',
            projectId: 'krenai-webapp',
            storageBucket: 'krenai-webapp.appspot.com',
            messagingSenderId: '382818658961',

        });

    observeAuth = () =>
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    onAuthStateChanged = user => {
        if (!user) {
            try {
                firebase.auth().signInAnonymously();
            } catch ({ message }) {
                alert(message);
            }
        }
    };

    get uid() {
        return (234);
    }

    get ref() {
        return firebase.database().ref('supplier_customer_query/' + supplierId + '/' + this.props?.login?.userId);
    }


    parse = snapshot => {
        const { email, nameOfbusinnes, phone, profileUrl, role, text, userName, user, timestamp, timeSent } = snapshot.val();

        const { key: _id } = snapshot;
        // const timestamp = new Date(numberStamp).toDateString();

        const message = {
            _id,
            email,
            nameOfbusinnes,
            phone,
            profileUrl,
            role,
            text,
            timestamp,
            userName,
            user,
            timeSent
        };
        return message;
    };

    on = callback =>
        this.ref
            .limitToLast(20)
            .on('child_added', snapshot => callback(this.parse(snapshot)));

    get timestamp() {

        return firebase.database.ServerValue.TIMESTAMP;
    }
    // send the message to the Backend
    send = messages => {
        var l = this.state.texts.length == 0 ? 1 : this.state.texts
        for (let i = 0; i < 1; i++) {
            // const { text, user } = messages[i];

            const message = {
                text: this.state.textInput,
                email: this.props?.user?.email,
                phone: this.props?.user?.phoneNumber,
                nameOfbusinnes: 'Krenai',
                profileUrl: '',
                role: 'customer',
                userName: this.props.user.firstName,
                timestamp: new Date().getHours().toLocaleString() + ' : ' + new Date().getMinutes().toLocaleString(),
                id: this.props?.login?.userId,
                readReceipt: 0,
                timeSent: new Date().toLocaleString()
            };
            this.append(message);
        }
    };

    append = message => this.ref.push(message);

    // close the connection to the Backend
    off() {
        this.ref.off();
    }


    static navigationOptions = ({ navigation }) => ({
        title: 'Chat!',
    });

    state = {
        messages: [],
    };

    get user() {
        return {

            _id: this.props.login.userId, userName
        };
    }
    renderChats = ({ item, index }) => {

        return (
            <View key={index}
            >
                <View style={item.role == 'supplier' ?
                    {
                        alignSelf: 'flex-start',
                        marginVertical: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5
                    } : {
                        alignSelf: 'flex-end',
                        marginVertical: 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5

                    }}>
                    {/* <Image style={item.role == 'supplier' ?
            {
              alignSelf: 'flex-start',
              borderRadius: 50,
              marginEnd: 5,
              width: 35,
              height: 35

            } : {

              position: 'absolute',
              right: 5,
              borderRadius: 50,
              marginStart: 5,
              width: 35,
              height: 35
            }} source={{ uri: 'https://cdn2.iconfinder.com/data/icons/avatar-2/512/Fred_man-512.png' }} /> */}

                    <View style={item.role == 'supplier' ?
                        {
                            backgroundColor: '#F5E2D9',
                            borderTopRightRadius: 5,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            paddingHorizontal: 5,
                        } : {

                            backgroundColor: '#D9EEF5',
                            right: 5,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            paddingHorizontal: 5
                        }}>
                        <Text style={item.role == 'supplier' ?
                            {
                                padding: 5,
                                paddingRight: 35,
                                // width: '60%',
                                color: '#000'

                            } : {
                                padding: 5,
                                paddingLeft: 35,
                                color: '#000',

                            }}>{item.text}</Text>
                        <Text style={item.role == 'supplier' ?
                            {
                                textAlign: 'left',
                                color: '#000',
                                fontSize: 10,
                                marginBottom: 2,
                                marginTop: -15,
                            } : {
                                textAlign: 'right',
                                color: '#000',
                                fontSize: 10,
                                marginBottom: 2,

                            }}>{item.role == 'supplier' ? item.timeSent.substring(9, 15) + '' : item.timestamp + ''}</Text>
                    </View>
                </View>




            </View>
        )
    }
    loadingTexts = () => {
        return (
            <View style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>

        )
    }
    renderAvatar(props) {
        return (
            <View style={{}}>
                <Avatar rounded size={35} source={{ uri: 'https://cdn2.iconfinder.com/data/icons/avatar-2/512/Fred_man-512.png' }} />
            </View>
        );
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Live Chat' }}
                />
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView style={{ flex: 1 }}>
                            {
                                !this.state.isChatLoading ?
                                    <FlatList
                                        data={this.state.texts}
                                        contentContainerStyle={{ paddingHorizontal: 10, marginHorizontal: 15 }}
                                        keyExtractor={index => index.toString()}
                                        key={index => String(index)}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={this.renderChats}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    :
                                    <ActivityIndicator size="large" color={Colors.primary} />

                            }
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                    <View style={{ width: '85%' }}>
                        <TextInput value={this.state.textInput}
                            onChangeText={(value) => this.setState({ textInput: value })} placeholder="Type message here ..." style={{ padding: 12, backgroundColor: '#fff', borderTopLeftRadius: 5, borderBottomRightRadius: 5 }} />
                    </View>
                    <TouchableOpacity onPress={() => {

                        if (!this.state.textInput == '') {
                            this.send()
                            this.setState({ textInput: '' })
                        }

                    }} style={{ padding: 15, backgroundColor: Colors.primary, width: '15%', borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                        <Icon name="paper-plane" type="font-awesome-5" color="#fff" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps)(Support)