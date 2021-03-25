
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
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
import TheTabs from './TheTabs';
import Subscription from '../AdditionalCategory/Subscription';
import SubsDetailList from '../AdditionalCategory/SubsDetailList';
import FAQUE from '../AdditionalCategory/FAQUE';
import GiftCardPaymentsScreen from '../Cart/GiftCardPaymentsScreen';

const stacknavigatorOptions = { headerShown: false };
const StackNavigator = createStackNavigator();

class TheStack extends Component {
    render() {
        return (
            <StackNavigator.Navigator initialRouteName={"Tabs"} screenOptions={{ headerShown: false }}>
                {/* {this.props.login.loginSuccess ? null : <StackNavigator.Screen
                    name="Landing"
                    component={Landing}
                    options={stacknavigatorOptions}
                />}
                {this.props.login.loginSuccess ? null : <StackNavigator.Screen
                    name="Login"
                    component={Login}
                    options={stacknavigatorOptions}
                />}
                {this.props.login.loginSuccess ? null : <StackNavigator.Screen
                    name="OTP"
                    component={OtpScreen}
                    options={stacknavigatorOptions}
                />} */}
                <StackNavigator.Screen
                    name="Tabs"
                    component={TheTabs}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Home"
                    component={Home}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Bulk"
                    component={BulkOrder}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="GiftCard"
                    component={GiftCard}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="BuyOnCall"
                    component={BuyOnCall}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Subscription"
                    component={Subscription}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Party"
                    component={PartyPlan}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Contact"
                    component={ContactUs}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="TermsAndConditions"
                    component={TermsAndConditionScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="notification"
                    component={Notification}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ReturnPolicy"
                    component={ReturnPolicy}
                    options={stacknavigatorOptions}
                />

                <StackNavigator.Screen
                    name="Address"
                    component={Address}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="AddAddress"
                    component={AddAddress}
                    options={stacknavigatorOptions}
                />

                <StackNavigator.Screen
                    name="HomeSubCategory"
                    component={HomeSubCategoryScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ProductListing"
                    component={ProductListingScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Discounted"
                    component={DiscountProducts}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Featured"
                    component={FeaturedProducts}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="BrandProductListing"
                    component={brandProductListing}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Cart"
                    component={Cart}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Coupon"
                    component={Counpons}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="CheckoutAddress"
                    component={CheckoutAddressScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="AddedScreenAddress"
                    component={AddedAddressScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Payments"
                    component={PaymentsScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="GiftCardPayments"
                    component={GiftCardPaymentsScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Categories"
                    component={Categories}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="FAQ"
                    component={FAQScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="SearchProductListing"
                    component={SearchProductListing}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="SubCategories"
                    component={SubCategoriesScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ProfileEditScreen"
                    component={ProfileEditScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Search"
                    component={Search}
                    options={stacknavigatorOptions}
                />

                <StackNavigator.Screen
                    name="Support"
                    component={Support}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Items"
                    component={Items}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Filter"
                    component={FilterScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Sort"
                    component={SortScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ItemDetail"
                    component={ItemDetail}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ProductDisplay"
                    component={ProductDetailsScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="SubsDetailList"
                    component={SubsDetailList}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Que"
                    component={FAQUE}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ImageItem"
                    component={ImageItem}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Review"
                    component={Review}
                    options={stacknavigatorOptions}
                />

                <StackNavigator.Screen
                    name="CartItem"
                    component={CartItem}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="OrderConfirm"
                    component={OrderConfirm}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="SelectAddress"
                    component={SelectAddress}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Header"
                    component={Header}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Wishlist"
                    component={Wishlist}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Tracking"
                    component={TrackingScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="WriteReview"
                    component={WriteReviewScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="MyWallet"
                    component={MyWalletScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="RechargeWallet"
                    component={RechargeWalletScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Order"
                    component={Order}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="OrderDetails"
                    component={OrederDetailScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="RefundProcedure"
                    component={refundProcedure}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="OrderConfirmed"
                    component={OrderConfirmedScreen}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="ProductFullImage"
                    component={ProductFullImageView}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="Refer"
                    component={Refer}
                    options={stacknavigatorOptions}
                />
                <StackNavigator.Screen
                    name="EnterRefer"
                    component={EnterRefer}
                    options={stacknavigatorOptions}
                />

            </StackNavigator.Navigator>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        loginfromcart: state.loginfromcart,
        defaultVariants: state.defaultVariants,
        login: state.login,
        addresses: state.addresses,
        supplier: state.supplier,
        selfpickup: state.selfpickup,
    };
};
export default connect(mapStateToProps)(TheStack)