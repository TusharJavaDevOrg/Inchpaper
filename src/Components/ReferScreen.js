import React, { Component } from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { SocialIcon } from "react-native-elements";
import { connect } from "react-redux";
import { addedRefferalCode, getReferalCode } from "../Redux/Auth/ActionCreatore";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { Colors } from "../config/GlobalContants";
const mapStateToProps = (state) => {
    return {
        login: state.login,
        visitedProfileOnes: state.visitedProfileOnes,
        hasAddedRefferalCode: state.hasAddedRefferalCode,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
    addedRefferalCode: () => dispatch(addedRefferalCode()),
});
class ShowRefer extends Component {
    componentDidMount() {
        console.log('rrrreeee', this.props.hasAddedRefferalCode, this.props.login.loginCount)
    }

    render() {
        const { onPress } = this.props;
        return (
            <View>
                {this.props.login.loginSuccess && this.props.login.loginCount < 2 && !this.props.hasAddedRefferalCode.hasAdded ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15 }}>
                    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', }}>
                        <LottieView source={require('../assets/refer.json')} autoPlay loop={false} style={{ height: 50, alignSelf: 'center' }} />
                        <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'sans' }}>Having an invite Code?</Text>
                            <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'sans-serif-light' }}>Enter invite code</Text>
                        </View>
                    </TouchableOpacity>
                    <Icon name="close" onPress={() => this.props.addedRefferalCode()} size={20} style={{ elevation: 2, padding: 5, backgroundColor: Colors.white, borderRadius: 360, alignSelf: 'center' }} color={Colors.primary} />

                </View> : null}
            </View>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowRefer)