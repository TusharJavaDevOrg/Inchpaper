import React, { Component } from 'react';
//import Stack from './Navigator';
import Stack from './src/Navigator';
import { Root } from 'native-base';
import { Provider } from 'react-redux';

import { ConfigureStore } from './src/Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import Splash from './src/Splash/SplashScreen';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { Colors } from './src/config/GlobalContants';
const { persistor, store } = ConfigureStore();
import PushNotification from 'react-native-push-notification'
import PushController from './src/PushController/PushController';
export default class App extends Component {
  state = {
    showApp: false,

  }
  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
      // this.setState({ showApp: true });
    }, 500);
    setTimeout(() => {
      this.setState({ showApp: true })

    }, 2000);
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        // process the notification here

        // required on iOS only 
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: "382818658961",
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  render() {
    return (
      <>
        {
          // this.state.showApp ? 
          <Root>
            <StatusBar backgroundColor={Colors.primary} barStyle={'dark-content'} />
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Stack />
              </PersistGate>
            </Provider>
          </Root>
          // : (<Splash />)

        }
      </>

    );
  }
}
