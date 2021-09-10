export const supplierId = 868;

// const staggingStoreManager =
//   'http://ec2-13-126-234-238.ap-south-1.compute.amazonaws.com/';

// const staggingAccountManager =
//   'http://ec2-13-234-237-49.ap-south-1.compute.amazonaws.com/';

const staggingAccountManager =
  'https://www.krenai.online/';

const staggingStoreManager =
  'https://www.outsourcecto.com/';
const DunzoAccount = "https://api.dunzo.in/";
export const testPhoneNumber = /[- #*;,.<>\{\}\[\]\\\/]/gi;
export const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const gioCoderApiKey = 'AIzaSyD-jQqFiTFbtheigXxNWd1-M8Utt59FrQ0';
export const rzpKey = 'rzp_live_SOgPs8jiYRFTdw';
export const rzpName = "inchpaper"
export const stripePublicKey = 'pk_test_51IGMcNBoASVeJCabyoVDoJc321COaifoVibII0DGapG2ndbFcbE4enAwp4zHSz72WtJWC5ZncT5aHlAzbWImx12j00gZxfTfZl';
export const stripeSecretKey = "sk_test_51IGMcNBoASVeJCabbJhyqQtFpSoy3rbkQz9gwPxZddDoiiarnvQK3XS6TeJ7mz4Aht1H8mj67CmY1ZUQLyGYhoL800hJv7BJ0x";
export const LiveReportIntegrationUrl = (ccode) => {
  return (
    staggingAccountManager + 'api/v3/firebase/active-users/' + supplierId + '?region=in-' + ccode + '&activeSource=app'
  )
}

export const postFCMTokenUrl = (fcmToken, id) => {
  return staggingAccountManager + "api/v4/customer/fcm/" + id + '/' + fcmToken;
};

export const bulkOrderUrl =
  staggingAccountManager + 'api/v3/account/countactUs/';

export const giftCardUrl = staggingAccountManager + 'api/v3/account/giftcard';
export const getGiftCardDataUrl = (custId) => { return (staggingAccountManager + 'api/v3/account/giftcard/customer/' + custId) }
export const getSupplierDetail =
  staggingAccountManager + 'api/v3/account/suppliers/' + supplierId;
export const getFaqDataUrl = staggingAccountManager + 'api/v3/account/faq/' + supplierId;
export const paytmGWUrl = (mid, key, userId, phoneNumber, total, websiteName,) => {
  return staggingAccountManager + 'api/v3/account/paytm/utility/pay/' + supplierId +
    `?mid=${mid}&key=${key}%23&body=%7B%22mid%22:%22${mid}%22,%22websiteName%22:%22${websiteName}%22,%22userInfo%22:%7B%22custId%22:%22${userId}%22,%22mobile%22:%22${phoneNumber}%22%7D,%22txnAmount%22:%7B%22value%22:${total},%22currency%22:%22INR%22%7D,%22callbackUrl%22:%22%22,%22requestType%22:%22Payment%22,%22paymentMode%22:%22BALANCE%22%7D`
  // '?mid=' + mid + '&key=' + key + '%23&body=%7B%22mid%22:%22' + mid + '%22,%22websiteName%22:%22' + websiteName + '%22,%22userInfo%22:%7B%22custId%22:%22' + userId + '%22,%22mobile%22:%22' + phoneNumber + '%22%7D,%22txnAmount%22:%7B%22value%22:' + total + ',%22currency%22:%22INR%22%7D,%22callbackUrl%22:%22%22,%22requestType%22:%22Payment%22,%22paymentMode%22:%22BALANCE%22%7D'
}
export const timeSlotUrl = () => {
  return (
    staggingStoreManager + "api/v3/store/delivery-slot/" + supplierId
  )
}
export const abondendCheckoutUrl = () => {
  return (
    staggingStoreManager + 'api/v3/store/abondened-checkout'
  );
}

export const updateAbondendCheckoutUrl = (id, stateId) => {
  return (
    staggingStoreManager + 'api/v3/store/abondened-checkout/status/change/' + id + '/' + stateId
  )
}

export const updateHashKeyOnServerUrl = () => {
  return staggingAccountManager + 'api/v3/notification';
};

export const getCouponsUrl = supplId => {
  return staggingStoreManager + 'api/v3/store/coupon/supplier/' + supplId;
};

export const validateCouponsUrl = () => {
  return staggingStoreManager + 'api/v3/store/coupon/validation';
};

// export const getAllStoresUrl = supplId => {
//   return staggingAccountManager + 'api/v3/suppliers/vendors/' + supplId;
// };
export const getAllStoresUrl = (supplId, latitude, longitude) => {
  return staggingAccountManager + 'api/v3/account/suppliers/check/delivery/' + supplId + '/' + latitude + '/' + longitude;
};

export const googleDirectionMatrixApi = (
  userLat,
  userLng,
  destLatLngString,
) => {
  return (
    'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' +
    destLatLngString +
    '&destinations=' +
    userLat +
    ',' +
    userLng +
    '&key=AIzaSyD-jQqFiTFbtheigXxNWd1-M8Utt59FrQ0'
  );
};

export const searchUrl = (searchKey, supplId) => {

  return (
    staggingStoreManager +
    'api/v3/stores/products/tags/' +
    supplId +
    '?tags=' +
    searchKey +
    '&getAllBrands=' +
    searchKey
  );
};

export const fetchCategoriesUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/stores/categories/supplier/' +
    supplId +
    '?sortBy=position&sortOrder=asc&isHidden=1'
  );
};

export const fetchSubCategoriesUrl = (categoryId, supplId) => {
  return (
    staggingStoreManager +
    'api/v3/stores/sub-categories/category/' +
    categoryId + '/' + supplId
    // +
    // '?isHidden=1'
  );
};

export const fetchAllSubCategoriesUrl = (supplId, idString) => {
  return (
    staggingStoreManager +
    'api/v3/stores/sub-categories/supplier/' + supplId + '?sortBy=category&categoryList=' + idString

  )
}



export const fetchSubSubCategoriesUrl = (subCategoryId, supplId) => {
  return (
    staggingStoreManager +
    'api/v3/sub-sub-categories/subCategory/' +
    subCategoryId +
    '/' +
    supplId
    // +
    // '?isHidden=1'
  );
};

export const fetchSubCategoryProductsUrl = (
  pageNum,
  subCatId,
  categoryId,
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?currentPage=' +
    pageNum +
    '&isApp=1&isFeatured=0&itemPerPage=12&categoryId=' +
    categoryId +
    '&subCategoryId=' +
    subCatId
  );
};
export const fetchCategoryProductsUrl = (
  pageNum,
  categoryId,
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?currentPage=' +
    pageNum +
    '&isApp=1&isFeatured=0&itemPerPage=12&categoryId=' +
    categoryId

  );
};

export const reorderAddUrl = idsString => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' + supplierId + '?currentPage=0&' +
    idsString +
    'isApp=1&isFeatured=0&topCount=0'
  );
};

export const fetchFeaturesProductsUrl = (
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplierId + '?currentPage=1&isApp=1&isFeatured=1&itemPerPage=12'

  );
};

export const getCollectionsUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/store/collection/supplier/' +
    supplId + '?source=app'

  );
};

export const fetchSubSubCategoryProductsUrl = (
  pageNumber,
  subSubCategoryId,
  subCategoryId,
  categoryId,
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?currentPage=' +
    pageNumber +
    '&id=0&isApp=1&isFeatured=0&itemPerPage=12&categoryId=' +
    categoryId +
    '&subCategoryId=' +
    subCategoryId +
    '&subSubCategoryId=' +
    subSubCategoryId
  );
};
export const fetchCategoryFeaturedProductsUrl = (
  pageNumber,
  categoryId,
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?currentPage=' +
    pageNumber +
    '&id=0&isApp=1&isFeatured=1&itemPerPage=10&categoryId=' +
    categoryId

  );
};

export const fetchCategoryNewArrivalProductsUrl = (
  pageNumber,
  categoryId,
  supplId,
) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?currentPage=' +
    pageNumber +
    '&id=0&isApp=1&isFeatured=0&itemPerPage=10&sortOrder=desc&sortBy=createdDate&categoryId=' +
    categoryId

  );
};

export const fetchSimilarProducts = (
  pageNumber,
  categoryId,
  subCategoryId,

) => {
  return (
    staggingStoreManager + 'api/v3/stores/products/supplier/' +
    supplierId +
    '?currentPage=' +
    pageNumber +
    '&id=0&isApp=1&isFeatured=0&itemPerPage=10&categoryId=' +
    categoryId +
    '&subCategoryId=' +
    subCategoryId
  );
};

export const customerAddressesUrl = customerId => {
  return (
    staggingAccountManager +
    'api/v3/store/customer/address/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const uploadAddressUrl =
  staggingAccountManager + 'api/v3/store/customer/address/';
export const updateAddressUrl = (id) => {
  return (

    staggingAccountManager + 'api/v3/store/customer/address/' + id
  )
}
export const mainWalletBalance = customerId => {
  return staggingAccountManager + 'api/v3/account/wallet/amount/' + customerId;
};

export const promoWalletBalance = customerId => {
  return (
    staggingAccountManager + 'api/v3/account/wallet/promo/amount/' + customerId
  );
};

export const promoWalletAndMainWalletBalance = (customerId) => {
  return (
    staggingAccountManager +
    'api/v3/account/wallet/promo/and/wallet/amount/' +
    supplierId +
    '/' +
    customerId
  );
};

export const userTransactionsInWallet = customerId => {
  return (
    staggingAccountManager +
    'api/v3/account/wallet/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const promoTransactionsUrl = customerId => {
  return (
    staggingAccountManager +
    'api/v3/account/wallet/promo/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const deliveriblityCheckUrl = (lattitude, longitude) => {
  return (
    staggingAccountManager +
    'api/v3/suppliers/check/delivery/' +
    supplierId +
    '/' +
    lattitude +
    '/' +
    longitude
  );
};

export const findDelivarableSocietiesUrl = () => {
  return staggingAccountManager + 'api/v3/society';
};

export const getNearestStoreUrl = (latitude, longitude, supplId) => {
  return (
    staggingAccountManager +
    'api/v3/suppliers/' +
    supplId +
    '/' +
    latitude +
    '/' +
    longitude
  );
};

export const userOrdersUrl = (customerId, supplId) => {
  return (
    staggingStoreManager +
    'api/v3/store/cart/supplier/' +
    supplierId +
    '?cancelled=1&currentPage=0&customerId=' +
    customerId +
    '&dayCount=365&invoiceGenerate=0&itemPerPage=0&sortBy=createdDate&sortOrder=desc'
  );
};

export const updateuserProfileUrl = customerId => {
  return staggingAccountManager + 'api/v3/customers/' + customerId;
};

export const getUserProfile = customerId => {
  return (
    staggingAccountManager +
    'api/v3/customers/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const fetchPaymentGetway = () => {
  return (
    staggingAccountManager + 'api/v3/account/payment/configuration/payment-service/' + supplierId
  )
}

export const otpVerificationUrl = () => {
  return staggingAccountManager + 'oauth/token';
};

export const getProductByNameAndId = (productName, productId) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplierId +
    '?currentPage=1&id=' +
    productId +
    '&isApp=1&isFeatured=0&itemPerPage=20&topCount=0'

  );
};
export const postReviewUrl = (id) => {
  return staggingStoreManager + 'api/v3/store/product/review/';
};


export const validatePhoneNumberUrl = (supplId, phoneNumber) => {
  return staggingAccountManager + 'api/v3/' + supplId + '/otp/' + phoneNumber;
};

export const cartPostUrl = () => {
  return staggingStoreManager + 'api/v3/store/cart';
};

//not being used
export const removeBalanceFromMainWalletUrl = () => {
  return staggingAccountManager + 'api/v3/account/wallet/';
};

//not being used
export const removeBalanceFromPromoWalletUrl = () => {
  return staggingAccountManager + '/api/v3/account/wallet/promo/wallet/';
};

export const getReferalCodeUrl = customerId => {
  return (
    staggingAccountManager +
    'api/v3/account/referral/customer/' +
    customerId +
    '?currentPage=0&itemPerPage=0'
  );
};

export const createReferalCodeUrl = () => {
  return staggingAccountManager + 'api/v3/account/referral/';
};

export const termsAndConditionsUrl = supplId => {
  return (
    staggingAccountManager +
    'api/v3/account/legal/supplier/' +
    supplierId +
    '?type=termsOfService'
  );
};
export const getDunzoAccessToken = () => {
  return DunzoAccount + 'api/v1/token';
};

export const dunzoTrackStatus = (task_id) => {
  return DunzoAccount + 'api/v1/tasks/' + task_id + '/status';
};
export const fetchSupplierDetails = () => {
  return staggingStoreManager + 'api/v3/stores/shipping/' + supplierId;
};
export const getBrandsUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/stores/brand/' +
    supplId +
    '?currentPage=0&itemPerPage=10&isFeatured=1&sortBy=position&sortOrder=asc'
  );
};
export const getCategoryBrandsUrl = (supplId, categId) => {
  return (
    staggingStoreManager +
    'api/v3/stores/brand/' +
    supplId +
    '?currentPage=0&itemPerPage=10&isFeatured=0&categoryId=' + categId + '&sortBy=position&sortOrder=asc'
  );
};
export const getProductReviewUrl = (productId) => {
  return staggingStoreManager + "api/v3/store/product/review/all?supplierId=" + supplierId + "&productId=" + productId
}
export const checkProductReviewUrl = (custId, pId) => {
  return staggingStoreManager + "api/v3/store/product/review/customer/" + custId + "?currentPage=0&itemPerPage=0&productId=" + pId

}
export const fetchDiscountedProducts = (pageNum) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/discouted-products/supplier/' +
    supplierId +
    '?itemPerPage=12&currentPage=' + pageNum
  );
};
export const fetchDiscountedCategoryProducts = (pageNum, categId) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/discouted-products/supplier/' +
    supplierId +
    '?itemPerPage=12&categoryId=' + categId + '&currentPage=' + pageNum
  );
};

export const cancelOrderUrl = () => {
  return staggingStoreManager + 'api/v3/store/cart/status';
};
export const getProductsFormCollectionIdUrl = (collectionId, pageNum) => {
  return (
    staggingStoreManager +
    'api/v3/store/collection/product/paginated/list/collection/' +
    collectionId +
    '?supplierId=' + supplierId + '&currentPage=' +
    pageNum +
    '&id=0&itemPerPage=10&sortBy=createdDate&sortOrder=Desc&topCount=0'
  );
};


export const getProductsFormBrandIdUrl = (brandId, pageNum, supplId) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' +
    supplId +
    '?brandId=' +
    brandId +
    '&currentPage=' +
    pageNum +
    '&id=0&itemPerPage=10&sortBy=createdDate&sortOrder=Desc&topCount=0'
  );
};

export const getProductWithProductIdsUrl = (idsString, supplId, pageNum) => {
  return (
    staggingStoreManager +
    'api/v3/stores/products/supplier/' + supplId + '?' +
    idsString + 'currentPage=' + pageNum +
    '&isApp=1&isFeatured=0&itemPerPage=10&topCount=0'
  );
};

export const updateWalletDataUrl = () => {
  return staggingAccountManager + 'api/v3/account/wallet/';
};

export const getBannersUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/account/banner/supplier/' +
    supplId +
    '?currentPage=0&itemPerPage=0&sortBy=position&sortOrder=asc'
  );
};

export const getAppPopupUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/account/app-popup/supplier/' +
    supplId
  );
};

export const verifyRefferalCodeUrl = (refferalCode, customerId) => {
  return (
    staggingAccountManager +
    'api/v3/account/referral/verify/' +
    refferalCode +
    '/' +
    customerId
  );
};

export const getPrivecyPolicyUrl = supplId => {
  return (
    staggingAccountManager +
    'api/v3/account/legal/supplier/' +
    supplId +
    '?type=privacyPolicy'
  );
};
export const refundGenerateUrl = () => {
  return staggingStoreManager + 'api/v3/store/cart/refund';
}

export const getRefundPolicyUrl = supplId => {
  return (
    staggingAccountManager +
    'api/v3/account/legal/supplier/' +
    supplId +
    '?type=refundPolicy'
  );
};

export const deleteAddressUrl = addressId => {
  return staggingAccountManager + 'api/v3/store/customer/address/' + addressId;
};

export const needsBrandsUrl = supplId => {
  return (
    staggingStoreManager +
    'api/v3/stores/brand/' +
    supplId +
    '?currentPage=0&isBanner=1&isFeatured=0&itemPerPage=0&sortBy=position&sortOrder=asc'
  );
};