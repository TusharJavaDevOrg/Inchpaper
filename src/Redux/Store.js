import { createStore, combineReducers, applyMiddleware } from 'redux';
import { DefaultVariants } from './Cart/DefaultVariants';
import { Cart } from './Cart/CartReducer';
import { Login } from './Auth/Login';
import { User } from './Auth/UserProfile';
import { Addresses } from './Auth/Addresses';
import { NearestSupplier } from './Auth/NearestSupplier';
import { VisitedProfileOnes } from './Auth/HasVisitedProfile';
import { ReferalCode } from './Auth/RefferalCode';
import { WalletData } from './Auth/WalletData';
import { WalletTransactions } from './Auth/WalletTransactions';
import { UserOrders } from './Auth/UserOrders';
import { HasAddedRefferalCode } from './Auth/HasAddedRefferalCode';
import { DeliverableSocieties } from './Auth/DeliverableSocieties';
import { CouponeResp } from './Auth/CouponCode';
import { Supplier } from './Auth/Supplier';
import { Categories } from './Cart/Categories';
import { SelectData } from './Cart/SelectionData';
import { Brands } from './Cart/Brands';
import { FeaturedProducts } from './Cart/FeaturedProducts';
import { Selfpickup } from './Auth/selfpick';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistCombineReducers } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { DeliveryTime } from './Auth/DeliveryTime';
import { Loginfromcart } from './Auth/CartLogin';
import { addressSelected } from './Auth/ActionCreatore';
import { SearchQueries } from './Cart/SearchQueries';
import { Favourites } from './Cart/Favourites';
import { PaymentGateway } from './Auth/PaymentGateway';
import { AbandonedCheckout } from './Cart/abandonedCheckout';
import { TimeSlot } from './Auth/TimeSlot';
import { CollectionData } from './Cart/CollectionData';
import { SubscriptionData } from './Cart/Subscription';

export const ConfigureStore = () => {
  const config = {
    key: 'root',
    storage: AsyncStorage,
    debug: true,
  };
  const store = createStore(
    persistCombineReducers(config, {
      defaultVariants: DefaultVariants,
      cart: Cart,
      login: Login,
      addresses: Addresses,
      user: User,
      nearestSupplier: NearestSupplier,
      visitedProfileOnes: VisitedProfileOnes,
      referalCode: ReferalCode,
      walletData: WalletData,
      userOrders: UserOrders,
      hasAddedRefferalCode: HasAddedRefferalCode,
      walletTransactions: WalletTransactions,
      deliverableSocieties: DeliverableSocieties,
      couponeResp: CouponeResp,
      supplier: Supplier,
      categories: Categories,
      selectData: SelectData,
      brands: Brands,
      featuredProducts: FeaturedProducts,
      selfpickup: Selfpickup,
      deliverytime: DeliveryTime,
      loginfromcart: Loginfromcart,
      addressSelected: addressSelected,
      searchQueries: SearchQueries,
      favourites: Favourites,
      paymentGateway: PaymentGateway,
      abandonedCheckout: AbandonedCheckout,
      timeslots: TimeSlot,
      collection: CollectionData,
      subscriptionData: SubscriptionData,
    }),
    applyMiddleware(thunk),
  );

  const persistor = persistStore(store);

  return { persistor, store };
};
