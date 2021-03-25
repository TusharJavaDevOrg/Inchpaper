import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '../config/GlobalContants';

class VariantSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DataEX: 'XS',
      varientSelect: [],
    };
  }

  componentDidMount() {
    const { productListings, variantValues } = this.props;
    var varientSelector = [];
    variantValues.map((it, ind) => {
      varientSelector.push({ id: ind, selectedVariant: it.variantValue[0] });
    });
    this.setState({ varientSelect: varientSelector });
    // console.log('Here is varient select', varientSelector);
  }

  render_Variants = (item, index, indexOfVariantType) => {
    console.log('Here is index of VariantType', indexOfVariantType);
    return (
      <TouchableOpacity
        onPress={() => {
          var currentSelection = this.state.varientSelect;
          currentSelection[indexOfVariantType].selectedVariant = item;
          this.setState({ varientSelect: currentSelection });
          this.props.onPress(currentSelection);
          // console.log('here is new variant selection', currentSelection);
        }}>
        <View
          style={[
            this.state.varientSelect.length > 0
              ? this.state.varientSelect[indexOfVariantType].selectedVariant ===
                item
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: '#fff' }
              : null,
            {
              height: 30,
              width: Dimensions.get('screen').width / 3.5,
              marginVertical: 5,
              marginRight: 10,
              justifyContent: 'space-evenly',
              borderWidth: 1,
              borderRadius: 5,
              borderColor: '#efefef',
            },
          ]}>
          <Text
            style={[
              this.state.varientSelect.length > 0
                ? this.state.varientSelect[indexOfVariantType]
                  .selectedVariant === item
                  ? { color: 'white' }
                  : { color: 'black' }
                : null,
              { fontSize: 12, alignSelf: 'center', paddingHorizontal: 10 },
            ]}>
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { productListings, variantValues } = this.props;
    return (
      <>
        {variantValues.map((it, ind) => {
          if (it.variant != 'NO VARIANT')
            return (
              <View
                style={{
                  backgroundColor: 'white',
                  marginHorizontal: 10,
                  marginTop: 10,
                  elevation: 2,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    paddingLeft: 10,
                    paddingVertical: 10,
                    color: Colors.primary,
                  }}>
                  {it.variant}
                </Text>
                {it.variantValue ? (
                  <FlatList
                    style={{
                      paddingLeft: 10,
                      marginVertical: 10,
                    }}
                    data={it.variantValue}
                    renderItem={({ item, index }) =>
                      this.render_Variants(item, index, ind)
                    }
                    extraData={this.state.DataEX}
                    numColumns={3}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}
              </View>
            );
        })}
      </>
    );
  }
}

export default VariantSelector;

const styles = StyleSheet.create({});
