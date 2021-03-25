import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Dimensions, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import ElevatedView from 'react-native-elevated-view';
import { connect } from 'react-redux';
import { Colors } from '../config/GlobalContants';



class DescriptionPage extends React.Component {
    componentDidMount() {
        this.setState({ isLoading: false })
    }
    state = {
        webViewHeight: 0,
        isLoading: true
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size="large" color={Colors.primary} style={{ justifyContent: 'center', alignSelf: 'center' }} />
                </View>
            )
        } else {
            const { data } = this.props;
            console.log('dataaaa', data)
            return (
                <View >
                    <ElevatedView elevation={1} style={{ backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 10, overflow: 'hidden', opacity: 0.99, flex: 1 }}>
                        <AutoHeightWebView
                            style={{ width: Dimensions.get('window').width - 15, marginVertical: 15 }}
                            customScript={`document.body.style.background = 'white';`}
                            customStyle={`
      *
      p {
        font-size: 12px;
      }
    `}
                            onSizeUpdated={size => console.log('sizeee', size.height)}
                            originWhitelist={['*']}
                            onNavigationStateChange={(event) => {
                                console.log('uuuu', event)
                            }}
                            source={{ html: data }}
                            // scalesPageToFit={false}
                            viewportContent={'width=device-width, user-scalable=no'}
                        />

                    </ElevatedView>
                </View>
            )

        }
    }
}

const mapStateToProps = state => {
    return {
        cart: state.cart,
        login: state.login
    };
};


export default connect(mapStateToProps)(DescriptionPage);
