import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';

import Landing from '../Landing/landing';

import Signup from '../pages/Account/Signup';

import Login from '../pages/Account/Login';

import Forgotpass from '../pages/Account/Forgotpass';

import Slides from '../Slides/Slides';

import Home from '../Home/Home';

import Cart from '../Cart/Cart';

import Categories from '../Categories/Categories';

import Search from '../Search/Search';

import Items from '../Items/Items';


import ItemDetail from '../ItemDetail/ItemDetail';

import ImageItem from '../ItemDetail/ImageItem';

import Review from '../Review/Review';

import CartItem from '../Cart/CartItem';

import Settings from '../Drawer/Settings';

import Profile from '../Drawer/Profile';

import OrderConfirm from '../Payment/OrderConfirm';

import SelectAddress from '../Payment/SelectAddress';

import DrawerContent from '../Home/DrawerContent';

import Header from '../Components/Header';

import Wishlist from '../Drawer/Wishlist';

import Address from '../Drawer/Address';

import Support from '../Drawer/Support';

import Order from '../Drawer/Order';

import Refer from '../Drawer/Refer';
import OtpScreen from '../pages/Account/OtpScreen';
import SubCategoriesScreen from '../Categories/SubCategoriesScreen';
import HomeSubCategoryScreen from '../Home/HomeSubCategoryScreen';
import ProductDetailsScreen from '../ProductDetails/ProductDetailsScreen';
import ProductListingScreen from '../ProductListing/ProductListingScreen';
import CheckoutAddressScreen from '../Cart/CheckoutAddressScreen';
import PaymentsScreen from '../Cart/PaymentsScreen';
import AddedAddressScreen from '../Cart/AddedAddressScreen';
import OrederDetailScreen from '../Drawer/OrederDetailScreen';
import OrderConfirmedScreen from '../Cart/OrderConfirmedScreen';
import ProfileEditScreen from '../Drawer/ProfileEditScreen';
import MyWalletScreen from '../Drawer/MyWalletScreen';
import TermsAndConditionScreen from '../Drawer/TermsAndConditionScreen';
import FAQScreen from '../Drawer/FAQScreen';
import ProductFullImageView from '../ProductDetails/ProductFullImageView';
import FilterScreen from '../ProductListing/FilterScreen';
import SortScreen from '../ProductListing/SortScreen';
import SplashScreen from '../Splash/SplashScreen';
import RechargeWalletScreen from '../Drawer/RechargeWalletScreen';
import { gioCoderApiKey, LiveReportIntegrationUrl, otpVerificationUrl } from '../../Config/Constants';
import { connect } from 'react-redux';
import GetLocation from 'react-native-get-location';
import Geocoder from 'react-native-geocoding';
import Axios from 'axios';
import AddAddress from '../Drawer/AddAddress';
import brandProductListing from '../ProductListing/brandProductListing';
import refundProcedure from '../Drawer/refundProcedure';
import SearchProductListing from '../Search/SearchProductListing';
import ReturnPolicy from '../Drawer/ReturnPolicy';
import TrackingScreen from '../Tracking/TrackingScreen';
import WriteReviewScreen from '../Drawer/WriteReviewScreen';
import { getuserAddresses } from '../Redux/Auth/ActionCreatore';
import FeaturedProducts from '../Home/FeaturedProducts';
import DiscountProducts from '../Home/DiscountProducts';
import EnterRefer from '../Components/EnterRefer';
import Counpons from '../Cart/Counpons';
import Notification from '../Notification/Notification';
import BulkOrder from '../Drawer/BulkOrder';
import GiftCard from '../Drawer/GiftCard';
import BuyOnCall from '../Drawer/BuyOnCall';
import PartyPlan from '../Drawer/PartyPlan';
import ContactUs from '../Drawer/ContactUs';

import { Badge } from 'react-native-elements';
import { Colors } from '../config/GlobalContants';

const Tab = createMaterialBottomTabNavigator();

const mapStateToProps = state => {
    return {
        cart: state.cart,
    };
};

class TheTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator
                barStyle={{ backgroundColor: '#fff' }}
                activeColor={Colors.primary}
                inactiveColor="#999"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        if (route.name === 'Home') {
                            return (
                                <Icon
                                    name={focused ? 'home' : 'home-outline'}
                                    size={23}
                                    color={color}
                                />
                            );
                        } else if (route.name === 'Categories') {
                            return (
                                <Icon
                                    name={focused ? 'grid' : 'grid'}
                                    size={23}
                                    color={color}
                                />
                            );
                        } else if (route.name === 'Account') {
                            return (
                                <Icon
                                    name={focused ? 'account' : 'account-outline'}
                                    size={23}
                                    color={color}
                                />
                            );
                        }
                    },
                })}>
                <Tab.Screen name="Home" component={Home} />

                <Tab.Screen name="Categories" component={Categories} />

                <Tab.Screen name="Account" component={Profile} />
            </Tab.Navigator>
        );
    }
}

export default connect(mapStateToProps)(TheTabs);
