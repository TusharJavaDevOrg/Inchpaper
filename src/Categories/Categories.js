/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { Header, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { supplierId } from '../../Config/Constants';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import { getPaymentMode } from '../Redux/Auth/ActionCreatore';
import { addSubsCat, deleteSubsCat, getCategorys } from '../Redux/Cart/ActionCreators';;
import FastImage from 'react-native-fast-image';
import { Colors } from '../config/GlobalContants';
// import {Button, Icon, Right} from 'native-base';

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    brands: state.brands,
    defaultVariants: state.defaultVariants,
    login: state.login,
    visitedProfileOnes: state.visitedProfileOnes,
    addresses: state.addresses,
    nearestSupplier: state.nearestSupplier,
    supplier: state.supplier,
    categories: state.categories,
    selectData: state.selectData,
    deliverytime: state.deliverytime,
    favourites: state.favourites,
    paymentGateway: state.paymentGateway,
    abandonedCheckout: state.abandonedCheckout,
    timeslots: state.timeslots,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  getPaymentMode: () => dispatch(getPaymentMode()),
  logOut: () => dispatch(logOut()),
  getReferalCode: (customerId) => dispatch(getReferalCode(customerId)),
  getCategorys: (supplId) => dispatch(getCategorys(supplId)),
  getBrands: (supplierId) => dispatch(getBrands(supplierId)),
  getNeedsBrands: (supplId) => dispatch(getNeedsBrands(supplId)),
  addOneFavourite: (item) => dispatch(addOneFavourite(item)),
  removeOneFavourite: (productId) => dispatch(removeOneFavourite(productId)),
  addAbondonedId: (id) => dispatch(addAbondonedId(id)),
  deleteAbandoneId: () => dispatch(deleteAbandoneId()),
  getTimeSlots: () => dispatch(getTimeSlots()),
  addSubsCat: (catId) => dispatch(addSubsCat(catId)),
  deleteSubsCat: () => dispatch(deleteSubsCat()),
});
class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      categoriesData: [
        { "categoryName": "Furniture" },
        { "categoryName": "Living" },
        { "categoryName": "BedRoom" },
        { "categoryName": "kids room" },
        { "categoryName": "Mattress" },
        { "categoryName": "Furnishings" },
        { "categoryName": "Decor" },
        { "categoryName": "Lighting" },
        { "categoryName": "Modular Kitchen" },
      ],
    };
  }
  state = { categoryList: [] };
  async componentDidMount() {
    await this.props.getCategorys(supplierId);
    this.props.getPaymentMode();
  }
  // state = {Email: '', Password: '', Loading: false};

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        {/* <Header>
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />

          <View
            style={{
              height: '100%',
              width: '110%',
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}>
              <Icon
                style={{
                  fontSize: 27,
                  paddingTop: 15,
                  marginLeft: 15,
                }}
                name="arrow-left"
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            <Right>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 20,
                  marginBottom: 12,
                }}>
                Categories
              </Text>
            </Right>
          </View>
        </Header> */}
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack(null)} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: 'Categories' }}
          rightComponent={<TwoIconHeaderComponent onPressMark={() => this.props.navigation.navigate('Wishlist')} onPressCart={() => this.props.navigation.navigate('Cart')} onPressBell={() => this.props.navigation.navigate('notification')} />}
        />
        <View style={{ bottom: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity style={{ height: 50, width: '95%', padding: 5, alignSelf: 'center', }} onPress={() => this.props.navigation.navigate('Search')}>
            <View style={{ height: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: Colors.placeholder, padding: 10, borderRadius: 5, borderColor: Colors.placeholder, borderWidth: 0.5, }}>
              <Text style={{ color: Colors.black, alignSelf: 'center', paddingStart: 10 }}>
                Search Products...
                                    </Text>
              <Icon name="magnify" size={20} color="grey" />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            // padding: 8
          }}>
          {this.props.categories.isLoading ?
            <FlatList
              data={[1, 2,]}
              showsVerticalScrollIndicator={false}
              renderItem={this._renderItemLoader}
              keyExtractor={(item, i) => i.toString()}
            // ItemSeparatorComponent={() => (
            //   <View style={{ paddingVertical: '5%' }} />
            // )}
            /> : <FlatList
              data={this.props.categories.data}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={this._renderItemEmpty}
              renderItem={this._renderItem}
              keyExtractor={(item, i) => i.toString()}
            // ItemSeparatorComponent={() => (
            //   <View style={{ paddingVertical: '5%' }} />
            // )}
            />}
        </View>
      </View>
    );
  }
  _renderItemEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', }}>
        <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 350, alignSelf: 'center' }} />
        <Text style={{ textAlign: "center", fontSize: 24 }}>No Products Available</Text>
      </View>
    )
  }
  _renderItemLoader = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: '#efefef', marginBottom: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
        <TouchableOpacity

          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{
            fontSize: 14,
            color: '#181818',
            fontFamily: 'sans'

          }}></Text>
          <Icon name="chevron-right" size={20} color={'black'} />
        </TouchableOpacity>
      </View>
    )
  }
  _renderItem = ({ item, index }) => (
    <ListItem bottomDivider={false} containerStyle={{ height: 65 }} onPress={() => {
      console.log('ittttttttt', item.id, index)
      if (item.id == '832' || index == 6) {
        this.props.deleteSubsCat();
        this.props.addSubsCat(item.id);
        this.props.navigation.navigate('Subscription', { id: item.id, catName: item.name, data: item })
      } else {
        this.props.deleteSubsCat();
        this.props.navigation.navigate('SubCategories', { id: item.id, catName: item.name })
      }
    }}>
      <ListItem.Content>
        <ListItem.Title style={{ fontFamily: 'sans', textTransform: 'uppercase', color: '#181818', fontSize: 15 }}>{item.name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color="#3A3838" size={23} />
    </ListItem>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Categories);