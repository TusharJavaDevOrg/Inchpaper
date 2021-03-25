import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Header({ title, backFunction }) {
  return (
    <View
      style={{
        minWidth: SCREEN_WIDTH,
        backgroundColor: '#ea0016',
        height: 70,
      }}>
      <View
        style={{
          height: '10%',
          flexDirection: 'row',
          paddingHorizontal: 10,
          backgroundColor: '#fff',
          paddingVertical: 35,
        }}>
        <TouchableWithoutFeedback
          style={{
            height: 42,
            width: 42,
            borderRadius: 360,
            marginLeft: -3.5,
            backgroundColor: '#fff',
            justifyContent: 'center',
          }}
          onPress={() => backFunction()}>
          <View
            style={{
              height: 35,
              width: 35,
              borderRadius: 360,
              elevation: 2,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Image
              source={require('../assets/a1.png')}
              style={{
                width: 18,
                height: 18,
                padding: 5,
                alignSelf: 'center',
                alignItems: 'center',
                borderRadius: 360,
                backgroundColor: 'white',
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            alignSelf: 'center',
            paddingLeft: 10,
            color: '#000',
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
