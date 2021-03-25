/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import InputOutline from 'react-native-input-outline';

import {ScrollView} from 'react-native-gesture-handler';
import Style from '../../Components/Style';
import { Header, Icon } from 'react-native-elements';
import IconHeaderComponenet from '../../Components/IconHeaderComponenet';

var Querystringified = require('querystringify');
export default class Login extends React.Component {
  state = {Email: '', Password: '', Phone: '', Loading: false};

  render() {
    return (
      // <View style={{ flex:1, backgroundColor: '#fff' }}>
      //     <View
      //       style={{
      //         width: Dimensions.get('window').width / 1.11,
      //         alignSelf: 'center',
      //       }}>
      //       <TouchableOpacity
      //         onPress={() => this.props.navigation.navigate('Landing')}>
      //         <Icon
      //           style={Style.closeicon}
      //           name="close"
      //           type="MaterialCommunityIcons"
      //         />
      //       </TouchableOpacity>
      //       <Text style={styles.heading}>Sign Up</Text>

      //       <InputOutline
      //         onChangeText={(text) => this.setState({Email: text})}
      //         style={Style.placeholder}
      //         placeholder="Name"
      //         focusedColor="black"
      //       />

      //       <InputOutline
      //         onChangeText={(text) => this.setState({Password: text})}
      //         style={Style.placeholder}
      //         placeholder="Email"
      //         focusedColor="black"
      //       />

      //       <InputOutline
      //         onChangeText={(number) => this.setState({Phone: number})}
      //         style={Style.placeholder}
      //         placeholder="Phone"
      //         focusedColor="black"
      //         keyboardType="numeric"
      //       />

      //       <InputOutline
      //         onChangeText={(numeric) => this.setState({Password: numeric})}
      //         style={Style.placeholder}
      //         placeholder="Password"
      //         focusedColor="black"
      //         keyboardType={'number-pad'}
      //       />
      //     </View>
      //     <View>
      //       <TouchableOpacity style={Style.loginbtnview}>
      //         <Icon
      //           style={Style.loginbtnicon}
      //           name="arrow-right"
      //           type="MaterialCommunityIcons"
      //         />
      //       </TouchableOpacity>
      //     </View>

      //     <TouchableOpacity
      //       onPress={() => this.props.navigation.navigate('Login')}>
      //       <View style={styles.textview}>
      //         <Text style={styles.logintext}>
      //           Already have an account ? Sign In
      //         </Text>
      //       </View>
      //     </TouchableOpacity>
      // </View>
      <View style={{ flex:1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor='#fff'
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Landing')} iconName='close-outline' iconType="ionicon" iconColor="#000" iconSize={25} /> }
        />
        <View style={{ flex: 1 , padding: 5, }}>
          <View style={{ flex: 1, paddingHorizontal: 5 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <ScrollView  showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: '3%' }}>Sign Up</Text>
                <InputOutline
                  onChangeText={(text) => this.setState({Email: text})}
                  style={styles.inputStyle}
                  placeholder="Name"
                  focusedColor="black"
                />
                <InputOutline
                  onChangeText={(text) => this.setState({Password: text})}
                  style={styles.inputStyle}
                  placeholder="Email"
                  focusedColor="black"
                />

                <InputOutline
                  onChangeText={(number) => this.setState({Phone: number})}
                  style={styles.inputStyle}
                  placeholder="Phone"
                  focusedColor="black"
                  keyboardType={"phone-pad"}
                />

                <InputOutline
                  onChangeText={(numeric) => this.setState({Password: numeric})}
                  style={styles.inputStyle}
                  placeholder="Password"
                  focusedColor="black"
                  keyboardType={'number-pad'}
                />
                <View style={{ paddingVertical: '28%' }} >
                  <TouchableOpacity style={{ backgroundColor: '#A50000' , borderRadius: 40, padding: 20, width: 65, alignSelf: 'flex-end',}}>
                    <Icon name="arrow-forward-outline" type="ionicon" color="#fff" size={20} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: 'Roboto', textAlign: 'center', fontSize: 15 }}>Already have an Account?<Text onPress={() => this.props.navigation.navigate('Login')} style={{ color: '#A50000', fontWeight: 'bold' }}> Sign in </Text></Text>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {fontSize: 28, marginTop: 40, marginBottom: 25, fontWeight: 'bold'},

  logintext: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 100,
    color: 'black',
  },
  textview: {
    alignSelf: 'center',
    alignItems: 'center',
    color: 'black',
    justifyContent: 'center',
  },
  inputStyle:{
    borderRadius: 30,
  
  }
});
