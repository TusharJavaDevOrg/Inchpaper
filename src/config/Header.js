import React from 'react';
import { View, Text } from 'react-native';
import I from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
// import { SCREEN_WIDTH } from '../Shared/Styles';
import { Badge } from 'react-native-elements';
import { Dimensions } from 'react-native';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

function Header(props) {
  return (
    <View
      style={{
        // flex: 1,
        height: 60,

        width: SCREEN_WIDTH,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#efefef',
        backgroundColor: props.backgroundColor,
        paddingHorizontal: 10,
        paddingTop: 18,
      }}>
      <View>
        {props.showLeftIcon ? (
          <Icon
            name={props.leftIconName}
            onPress={() => props.leftIconFunc()}
            size={25}
            color={'#fff'}
            style={{ alignSelf: 'center' }}
          />
        ) : (
            <Text style={{ minWidth: 25 }}></Text>
          )}
      </View>
      <View>
        <Text
          style={{
            fontSize: 14,
            alignSelf: 'center',
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {props.title}
        </Text>
      </View>
      <View>
        {props.showRightIcon ? (
          <>
            <I
              name={props.rightIconName}
              onPress={() => props.rightIconFunc()}
              size={25}
              color={'#fff'}
              style={{ alignSelf: 'center' }}
            />
            {props.cart.products.length > 0 ? (
              <Badge
                status="success"
                containerStyle={{
                  position: 'absolute',
                  top: -7,
                  right: -7,

                }}
                value={props.cart.products.length}
              />
            ) : null}
          </>
        ) : (
            <Text style={{ minWidth: 25 }}></Text>
          )}
      </View>
    </View>
  );
}

export default connect(mapStateToProps)(Header);
