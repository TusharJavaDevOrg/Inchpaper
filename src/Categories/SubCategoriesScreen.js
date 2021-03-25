import { Header } from 'react-native-elements';
import React, { Component } from 'react';
import { View, StatusBar, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import TwoIconHeaderComponent from '../Components/TwoIconHeaderComponent';
import LottieView from 'lottie-react-native';
import { Accordion } from 'native-base';
import { List, Checkbox } from 'react-native-paper';
import { fetchSubCategoriesUrl, fetchSubSubCategoriesUrl, supplierId } from '../../Config/Constants';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getPaymentMode, getReferalCode, getTimeSlots, logOut } from '../Redux/Auth/ActionCreatore';
import { addAbondonedId, deleteAbandoneId, getCategorys } from '../Redux/Cart/ActionCreators';
import { Colors } from '../config/GlobalContants';
import { errorToast } from '../Functions/functions';
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
  addAbondonedId: (id) => dispatch(addAbondonedId(id)),
  deleteAbandoneId: () => dispatch(deleteAbandoneId()),
  getTimeSlots: () => dispatch(getTimeSlots())
});
class SubCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategoryData: [],
      subSubCategories: [],
      subSubCategoriesLoading: false,
      categoryData: [],
      selectdata: [],
      show_DropdownElements: false,
      current_dropdown_index: -1,
      selectedCategoryId: 0,
      isSubCategoryLoading: false,
      subCatIndex: -1,
      subCategory: [
        { title: "Sofa", content: "Lorem ipsum dolor sit amet" },
        { title: "Seating", content: "Lorem ipsum dolor sit amet" },
        { title: "Chairs", content: "Lorem ipsum dolor sit amet" },
        { title: "Tables", content: "Lorem ipsum dolor sit amet" },
        { title: "Cabinetry", content: "Lorem ipsum dolor sit amet" },
        { title: "Dining & Bar", content: "Lorem ipsum dolor sit amet" },
        { title: "Beds", content: "Lorem ipsum dolor sit amet" },
      ],
    };
  }
  componentDidMount() {
    var categoryId = this.props.route.params?.id;
    this.getSubCategoriesByCategoryIdFromServer(categoryId);
  }
  getSubCategoriesByCategoryIdFromServer = async (categoryId) => {
    this.setState({ subCategoryData: [], isSubCategoryLoading: true });
    var url = fetchSubCategoriesUrl(categoryId, supplierId);

    console.log('Start Getting SUB CATEGORY from server', url, categoryId);
    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + ' ',
        'Content-type': 'application/json',
      },
    })
      .then((response) => {
        // console.log('getSubCategoriesByCategoryIdFromServer', JSON.stringify(response.data.object));
        this.setState({
          subCategoryData: response.data.object,
          show_DropdownElements: true,
          isSubCategoryLoading: false,
          networkError: false,
        });
      })
      .catch((error) => {
        // if (!error.status) {
        this.setState({ networkError: true, isSubCategoryLoading: false, });
        errorToast('Error while loading data');
        // }
        // //console.log('Error', error.message);
      });
  };
  fetchSubSubCategories = async (subCatId, index) => {
    // console.log('Here is the supplierSubCatId', subCatId, supplierId);
    var url = fetchSubSubCategoriesUrl(subCatId, supplierId);

    console.log('Fetching SUB SUB CATEGORIES', url);

    this.setState({ subSubCategories: [], subSubCategoriesLoading: true, fetchingAll: true }),
      await Axios.get(url, {
        headers: {
          Authorization: 'bearer ' + ' ',
          'Content-type': 'application/json',
        },
      })
        .then((response) => {
          console.log(
            ' Sub sub cat from server on prodictlisting',
            JSON.stringify(response.data.object),
          );
          this.setState({
            subSubCategoriesLoading: false,
            subSubCategories: response.data.object,
            allSubCategoryProducts: [],
            subCatIndex: index
          });
        })
        .catch((err) => {
          this.setState({ subSubCategoriesLoading: false });
          // console.log(err);
        });
  }
  render() {
    const { id, catName } = this.props.route.params;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack(null)} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} />}
          centerComponent={{ text: catName, }}
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
        <View style={{ flex: 1 }}>
          {this.state.isSubCategoryLoading ? <FlatList data={[1, 2, 3]} keyExtractor={(item, index) => String(index)} renderItem={this._renderItemLoader} /> : <FlatList data={this.state.subCategoryData} ListEmptyComponent={this._renderItemEmpty} keyExtractor={(item, index) => String(index)} renderItem={this._renderItem} />}
        </View>
      </View>
    )
  }
  _renderItemLoader = ({ item, index }) => {
    return (
      <View style={{ backgroundColor: '#fff', marginBottom: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
        <TouchableOpacity

          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{
            fontSize: 14,
            color: '#181818',
            fontFamily: 'sans',
            color: '#c0c0c0',
            width: '30%'


          }}></Text>
          <Icon name="chevron-right" size={20} color={'black'} />
        </TouchableOpacity>
      </View>
    )
  }
  _renderItem = ({ item, index }) => (
    <View style={{ backgroundColor: '#fff', marginBottom: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('ProductListing', {

            from: 'Products',
            catName: item.name,
            subCatId: item.id,
            catId: item.category.id

          })}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{
          fontSize: 14,
          color: '#181818',
          fontFamily: 'sans'
        }}>{item.name}</Text>
        <Icon name="chevron-right" size={20} color={'black'} />
      </TouchableOpacity>
    </View>
  );
  _renderItemEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginVertical: '35%' }}>
        <LottieView source={require('../assets/paper-plane.json')} autoPlay loop={false} style={{ height: 350, alignSelf: 'center' }} />
        <Text style={{ textAlign: "center", fontSize: 24 }}>No Products Available</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 13,

  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SubCategoriesScreen);