import * as ActionTypes from './ActionTypes';
import { ToastAndroid } from 'react-native';
import {
  customerAddressesUrl,
  getUserProfile,
  getReferalCodeUrl,
  createReferalCodeUrl,
  promoWalletAndMainWalletBalance,
  userOrdersUrl,
  userTransactionsInWallet,
  findDelivarableSocietiesUrl, supplierId, fetchPaymentGetway, timeSlotUrl
} from '../../../Config/Constants';
import Axios from 'axios';
export const loginSuccess = obj => dispatch => dispatch(addUser(obj));

export const reLogin = (screenName) => dispatch => dispatch(reLoginUser(screenName));
const reLoginUser = (screenName) => ({
  type: ActionTypes.RE_LOGIN,
  payload: screenName,
})
export const addUser = userData => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: userData,
});

export const loginFail = errMessage => dispatch => {
  dispatch(errInLogin(errMessage));
};

export const errInLogin = errMessage => ({
  type: ActionTypes.LOGIN_ERR,
  payload: errMessage,
});

export const logOut = () => dispatch => dispatch(logOutuser());

logOutuser = () => ({
  type: ActionTypes.LOG_OUT,
});

export const skipLogin = () => dispatch => {
  console.log('skip login at actioncreator')
  dispatch(loginSkipped());
};

export const loginSkipped = () => ({
  type: ActionTypes.SKIPPED_LOGIN,
});

//the below action sets a value hasSelectedAddress In login reducer to true which means that user has selected ana ddress
export const addressSelected = () => dispatch => {
  dispatch(userSelectedDeliveryAddress());
};

export const userSelectedDeliveryAddress = () => ({
  type: ActionTypes.ADDRESS_SELECTED,
});

export const getuserAddresses = data => dispatch => {
  // dispatch(addressesLoading());
  var userId = data?.userId;
  var currentSelectedAddress = data?.currentSelectedAddress ?? null;
  // console.log(
  //   'Current selected address of user on action creator screen==============',
  //   currentSelectedAddress,
  // );
  var url = customerAddressesUrl(data);
  // console.log('user address url', url)
  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log(
      //   'Addresses data->',
      //   response.data.object,
      //   'currentSelectedAddress===========================================',
      //   currentSelectedAddress,
      // );
      dispatch(addAddresses(response.data.object, null));
      if (response.data.object.length === 0) {
        dispatch(removeSelectedAddressAndNearestSupplier());
      }
    })
    .catch(error => {
      dispatch(addressesFailed(error.message));
      console.log('Error', error.message);
    });
};

export const addAddresses = (addresses, currentSelectedAddress) => ({
  type: ActionTypes.GET_USER_ADDRESSES,
  payload: {
    addresses: addresses,
    // currentSelectedAddress: currentSelectedAddress,
  },
});

export const addressesLoading = () => ({
  type: ActionTypes.USER_ADDRESSES_LOADING,
});

export const addressesFailed = error => ({
  type: ActionTypes.USER_ADDRESSES_FAILED,
  payload: error,
});

//the below reducre is used to set a address selected by the user as the address selected by the user for delivery in addresses reducer
export const addSelectedAddress = address => dispatch => {
  // console.log('action creator adrres log')
  dispatch(selectedAddress(address));
};

export const toggleLogin = (bool) => dispatch => {
  bool ? dispatch(LogingFromCart()) : dispatch(LogingFromStart());
}

const LogingFromCart = () => ({
  type: ActionTypes.LOGING_FROM_CART,
})
const LogingFromStart = () => ({
  type: ActionTypes.LOGING_FROM_START,
})

export const toggleOrderType = (bool) => dispatch => {
  !bool ? dispatch(StartSelfPickUp()) : dispatch(StartHomeDelivery());
}

const StartSelfPickUp = () => ({
  type: ActionTypes.START_SELF_PICKUP,
})
const StartHomeDelivery = () => ({
  type: ActionTypes.START_HOME_DELIVERY,
})

export const toggleDeliveryType = (bool) => dispatch => {
  !bool ? dispatch(FullTimeDelivery()) : dispatch(NormalDelivery());
}
const FullTimeDelivery = () => ({
  type: ActionTypes.FULL_TIME_DELIVERY,
})
const NormalDelivery = () => ({
  type: ActionTypes.NORMAL_DELIVERY,
})

export const selectedAddress = address => ({
  type: ActionTypes.ADD_SELECTED_ADDRESS,
  payload: address,
});

export const getUserData = customerId => dispatch => {
  // dispatch(userDataLoading());

  const url = getUserProfile(customerId);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('User data from action creatore screen', response.data);
      dispatch(addUserData(response.data.object[0]));
    })
    .catch(err => {
      dispatch(userDataErr(err.message));
      // toast('Error while loading profile');
    });
};

export const userDataLoading = () => ({
  type: ActionTypes.USERDATA_LOADING,
});

export const addUserData = data => ({
  type: ActionTypes.USERDATA_SUCCESS,
  payload: data,
});

export const userDataErr = err => ({
  type: ActionTypes.USERDATA_ERR,
  payload: err,
});

export const addNearestSupplier = (
  nreaestSupplierData,
  minDistCalculatedUsingGoogleDistMatrix,
) => dispatch => {
  dispatch(
    addSupplire(nreaestSupplierData, minDistCalculatedUsingGoogleDistMatrix),
  );
};

export const addSupplire = (
  nreaestSupplierData,
  minDistCalculatedUsingGoogleDistMatrix,
) => ({
  type: ActionTypes.ADD_NEAREST_SUPPLIER,
  payload: nreaestSupplierData,
  minDist: minDistCalculatedUsingGoogleDistMatrix,
});

export const deleteNearestSupplier = () => dispatch => {
  dispatch(deleteSupplier());
};

export const deleteSupplier = () => ({
  type: ActionTypes.DELETE_NEAREST_SUPPLIER,
});

export const profileVisitedOnes = () => dispatch => {
  dispatch(hasVisitedProfile());
};

export const hasVisitedProfile = () => ({
  type: ActionTypes.VISITED_PROFILE_ONES,
});

export const getReferalCode = (customerId) => dispatch => {
  // var getReffralCodeUrl = getReferalCodeUrl(customerId);
  var postRefferalCodeUrl = createReferalCodeUrl();
  // console.log('referaal', postRefferalCodeUrl)
  var bodyForReferalCodeGeneration = {

    customer: customerId,

    supplier: supplierId,

  };
  // console.log('body of referal', bodyForReferalCodeGeneration)
  Axios.post(postRefferalCodeUrl, bodyForReferalCodeGeneration, {
    headers: {
      Authorization: 'Bearer ' + '',
      'Content-Type': 'application/json',
    },
  })
    .then(resp => {
      // console.log(
      //   'Here is response from posting a referal code =================================================================================================================================',
      //   resp.data.object[0].referralCode,
      // );
      dispatch(addReferalToLocal(resp.data.object[0].referralCode));
    })
    .catch(err => {
      console.log('Err in getting refferal code', err.message);
    });
};

export const addReferalToLocal = code => ({
  type: ActionTypes.GET_REFFERAL_CODE,
  payload: code,
});

export const getWalletData = (customerId, supplierID) => dispatch => {
  dispatch(walletDataLoading());
  // GET_WALLET_DATA
  var url = promoWalletAndMainWalletBalance(customerId, supplierID);
  // console.log('url of wallet dataaaa', url)
  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('All Wallet data->', response.data);
      dispatch(addWalletData(response.data));
    })
    .catch(error => {
      console.log('Error in loading wallet data', error.message);
    });
};

export const addWalletData = walletData => ({
  type: ActionTypes.GET_WALLET_DATA,
  payload: walletData,
});

export const walletDataLoading = () => ({
  type: ActionTypes.WALLET_DATA_LOADING,
});

export const getWalletTransactions = customerId => dispatch => {
  dispatch(walletTransactionsLoading());

  var url = userTransactionsInWallet(customerId);
  // console.log('wallet transsssssss', url)
  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + ' ',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('Heere are wallet transactions', response.data.object);
      dispatch(addWalletTransactions(response.data.object));
    })
    .catch(error => {
      // console.log('Error in loading wallet transactions', error.message);
    });
};

export const addWalletTransactions = transactionData => ({
  type: ActionTypes.GET_WALLET_TRANSACTIONS,
  payload: transactionData,
});

export const walletTransactionsLoading = () => ({
  type: ActionTypes.WALLET_TRANSACTIONS_LOADING,
});

export const getUserOrders = (customerId, supplId) => dispatch => {
  // console.log('inside get user orders');
  dispatch(userOrdersLaoding());
  // console.log('fetching user orders')
  var url = userOrdersUrl(customerId);
  // console.log('user orders url', url)
  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('Order data->', JSON.stringify(response.data.object));
      dispatch(addUserOrders(response.data.object));
    })
    .catch(error => {
      console.log('Error in getting user orders', error);
    });
};

export const addUserOrders = orders => ({
  type: ActionTypes.GET_USER_ORDERS,
  payload: orders,
});

export const userOrdersLaoding = () => ({
  type: ActionTypes.USER_ORDERS_LOADING,
});

export const addedRefferalCode = () => dispatch => {
  dispatch(setItTrue());
};

export const setItTrue = () => ({
  type: ActionTypes.ADDED_REDDERAL_CODE,
});

export const findDelivrableSocieties = () => dispatch => {
  var url = findDelivarableSocietiesUrl();
  // console.log(
  //   'Finding deliverable societies address===========================================================================================> ',
  //   url,
  // );
  dispatch(societyDataLoading());

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
  })
    .then(response => {
      // console.log('Delivary society check data->', response.data.object);
      dispatch(addSocietyData(response.data.object));
    })
    .catch(error => {
      console.log('Error', error);
    });
};

export const addSocietyData = orders => ({
  type: ActionTypes.GET_SOCIETY_DATA,
  payload: orders,
});

export const societyDataLoading = () => ({
  type: ActionTypes.SOCIETY_DATA_LOADING,
});

export const removeSelectedAddressAndNearestSupplier = () => ({
  type: ActionTypes.REMOVE_SELECTED_ADDRESS_AND_SUPPLIER_WITH_MIN_DIST,
});

export const saveCouponResponse = (resp, code) => dispatch => {
  dispatch(saveCouponData(resp, code));
};

const saveCouponData = (resp, code) => ({
  type: ActionTypes.SAVE_COUPONCODE_RESPONSE,
  payload: resp,
  code: code,
});

export const deleteCouponResponse = () => dispatch => {
  dispatch(deleteCouponData());
};

const deleteCouponData = () => ({
  type: ActionTypes.DELETE_COUPON_RESPONSE,
});

export const addStoreData = (data, id) => dispatch => {
  dispatch(addOneStore(data, id));
};

const addOneStore = (data, id) => ({
  type: ActionTypes.ADD_SUPPLIER_DATA,
  payload: { supplierId: id, supplierData: data },
});

export const deleteStoreData = () => dispatch => {
  dispatch(deleteOneStore());
};

const deleteOneStore = () => ({
  type: ActionTypes.DELETE_SUPPLIER_DATA,
});


//Payment gateway
export const getPaymentMode = () => dispatch => {
  dispatch(paymentModeLoading());

  const url = fetchPaymentGetway();

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('payment gateway data from action creatore screen', response.data);
      dispatch(addPaymentMode(response.data.object));
    })
    .catch(err => {
      dispatch(paymentModeErr(err.message));
      // toast('Error while loading profile');
    });
};

export const paymentModeLoading = () => ({
  type: ActionTypes.PAYMENT_GATEWAY_LOADING,
});

export const addPaymentMode = data => ({
  type: ActionTypes.ADD_PAYMENT_GATEWAY,
  payload: data,
});

export const paymentModeErr = err => ({
  type: ActionTypes.PAYMENT_GATEWAY_ERR,
  payload: err,
});


//TIME SLOTS ACTION CREATOR

export const getTimeSlots = () => dispatch => {
  dispatch(timeSlotsLoading());

  const url = timeSlotUrl();

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('time slots data from action creatore screen', JSON.stringify(response.data.object));
      dispatch(addTimeSlots(response.data.object));
    })
    .catch(err => {
      dispatch(timeSlotserr(err.message));
      // toast('Error while loading profile');
    });
};

export const timeSlotsLoading = () => ({
  type: ActionTypes.TIME_SLOTS_LOADING,
});

export const addTimeSlots = data => ({
  type: ActionTypes.ADD_TIME_SLOTS,
  payload: data,
});

export const timeSlotserr = err => ({
  type: ActionTypes.TIME_SLOTS_ERR,
  payload: err,
});