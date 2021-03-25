/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Button, Icon} from 'native-base';
import InputOutline from 'react-native-input-outline';
import Style from '../../Components/Style';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../../Components/IconHeaderComponenet';

var Querystringified = require('querystringify');
export default class Login extends React.Component {
  state = {Email: '', Password: '', Loading: false};

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Login')} iconName='close-outline' iconType="ionicon" iconColor="#000" iconSize={25} /> }
        />
        <View style={{ flex: 1, padding: 5, paddingTop: '10%' }}>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

              <Text style={styles.heading}>Forgot Password</Text>

              <Text style={styles.text}>
                Please enter your email address .You will recieve a link to create a
                new password via email.
              </Text>
              <View style={{ paddingHorizontal: 10 }}>
                <InputOutline
                  onChangeText={(text) => this.setState({Email: text})}
                  style={Style.placeholder}
                  placeholder="Email"
                  focusedColor="black"
                />
                <View style={{ paddingVertical: '20%' }}>
                  <Button style={styles.loginbtn}>
                    <Text style={styles.icontext}>Sent</Text>
                  </Button>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25, 
    fontWeight: 'bold', 
    fontFamily: 'Roboto',
    paddingLeft: '3%'
  },

  text: {
    fontSize: 15,
    paddingVertical: '2%',
    paddingLeft: '3%',
    width: '80%'
  },
  icontext: {
    color: 'white',
    fontFamily: 'bold',
    alignSelf: 'center',
    marginLeft: 20,
  },
  loginbtn: {
    borderRadius: 40,
    height: 70,
    alignSelf: 'flex-end',
    width: 70,
    backgroundColor: '#A50000',
  },
});
