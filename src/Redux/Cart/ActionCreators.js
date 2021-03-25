import * as ActionTypes from './ActionTypes';
import {
  fetchCategoriesUrl,
  getBrandsUrl,
  supplierId,
  needsBrandsUrl,
  fetchFeaturesProductsUrl,
  getCollectionsUrl,
} from '../../../Config/Constants';
import Axios from 'axios';
import { toast } from '../../Functions/functions';


export const addAbondonedId = (id) => (dispatch) => {
  dispatch(addId(id))
}
const addId = (id) => ({
  type: ActionTypes.ADD_ABANDONED_ID,
  payload: id,
})
export const deleteAbandoneId = () => (dispatch) => {
  dispatch(deleteId());
}
const deleteId = () => ({
  type: ActionTypes.DELETE_ABANDONED_ID
})

export const addSearchQueries = (product) => (dispatch) => {
  dispatch(addSearchQuery(product));
};

export const deleteSearchQueries = () => (dispatch) => {
  dispatch(deleteSearchQuery());
};
const deleteSearchQuery = () => ({
  type: ActionTypes.DELETE_SEARCH_QUERY,
});
const addSearchQuery = (product) => ({
  type: ActionTypes.ADD_SEARCH_QUERY,
  payload: product,
});

export const addOneFavourite = (product) => (dispatch) => {
  dispatch(addToFavourites(product));
};

const addToFavourites = (product) => ({
  type: ActionTypes.ADD_ONE_FAVOURITE,
  payload: product,
});

export const removeOneFavourite = (productId) => (dispatch) => {
  dispatch(removeFromFavourites(productId));
};

const removeFromFavourites = (productId) => ({
  type: ActionTypes.REMOVE_ONE_FAVOURITE,
  payload: productId,
});

export const removeAllFavourites = () => (dispatch) => {
  dispatch(deleteAllFavourites());
};

const deleteAllFavourites = () => ({
  type: ActionTypes.REMOVE_ALL_FAVOURITES,
});


// default variants
export const createDefaultVariants = objectOfProducts => dispatch => {
  dispatch(creatingDefaultVariants(objectOfProducts));
};

export const creatingDefaultVariants = objectOfProducts => ({
  type: ActionTypes.ADD_DEFAULT_VARIANTS,
  payload: objectOfProducts,
});

export const deleteAllDefaultVarinats = () => dispatch => {
  dispatch(deleteAllVariants());
};

export const deleteAllVariants = () => ({
  type: ActionTypes.DELETE_DEFAULT_VARIANTS,
});

export const editDefaultVariant = (
  newVariantInfo,
  indexOfProduct,
) => dispatch => {
  dispatch(editVariant(newVariantInfo, indexOfProduct));
};

export const editVariant = (newVariantInfo, indexOfProduct) => ({
  type: ActionTypes.EDIT_DEFAULT_VARIANTS,
  payload: { newVariantInfo: newVariantInfo, indexOfProduct: indexOfProduct },
});

// cart
export const addOneItemToCart = object => dispatch => {
  dispatch(addItemToCart(object));
};


export const addItemToCart = product => ({
  type: ActionTypes.ADD_ONE_PRODUCT,
  payload: product,
});

export const deleteOneItemFromCart = index => dispatch => {
  dispatch(deleteItem(index));
};

export const deleteItem = index => ({
  type: ActionTypes.DELETE_ONE_ITEM,
  payload: index,
});

export const deleteAllItemsFromCart = () => dispatch => {
  dispatch(clearCart());
};

export const clearCart = () => ({
  type: ActionTypes.CLEAR_CART,
});

export const increaseProductCount = (
  productId,
  variantSelectedByCustomer,
) => dispatch => {
  dispatch(increaseCount(productId, variantSelectedByCustomer));
};

export const increaseCount = (productId, variantSelectedByCustomer) => ({
  type: ActionTypes.INCREASE_PRODUCT_COUNT,
  payload: {
    productId: productId,
    variantSelectedByCustomer: variantSelectedByCustomer,
  },
});

export const decreaseProductCount = (
  productId,
  variantSelectedByCustomer,
) => dispatch => {
  dispatch(decreaseCount(productId, variantSelectedByCustomer));
};

export const decreaseCount = (productId, variantSelectedByCustomer) => ({
  type: ActionTypes.DECREASE_PRODUCT_COUNT,
  payload: {
    productId: productId,
    variantSelectedByCustomer: variantSelectedByCustomer,
  },
});

export const getCategorys = supplId => dispatch => {
  dispatch(categoriesLoading());
  dispatch(deleteSelectData());

  var url = fetchCategoriesUrl(supplId);
  console.log('inside get Category Data From Server, ACTION CREATOR', url);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + '',
      'Content-type': 'application/json',
    },
    timeout: 15000,
  })
    .then(response => {
      // console.log('No of categories->', response.data.object.length);
      response.data.object.length === 0 ? toast('No Categories found') : null;
      dispatch(addCategories(response.data.object));
      dispatch(addSelectData(createSelectData(response.data.object)));
    })
    .catch(error => {
      toast('Error while loading data');
      dispatch(categoriesError(error.messsage));
      console.log('Error in fetching categories', error.message);
    });

  // console.log('select data-> ', this.state.selectdata);
};

const addCategories = data => ({
  type: ActionTypes.ADD_CATEGORIES,
  payload: data,
});

const categoriesLoading = () => ({
  type: ActionTypes.CATEGORIES_LOADING,
});

const categoriesError = errMess => ({
  type: ActionTypes.CATEGRIES_ERR,
  payload: errMess,
});

function createSelectData(data) {
  let selectData = [];
  for (let i = 0; i < data.length; i++) {
    selectData.push(i);
  }
  return selectData;
}

const addSelectData = data => ({
  type: ActionTypes.ADD_SELECTDATA,
  payload: data,
});

const deleteSelectData = () => ({
  type: ActionTypes.DELETE_SELECTDATA,
});

export const getBrands = supplId => dispatch => {
  dispatch(brandsLoading());
  var url = getBrandsUrl(supplId);
  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + ' ',
      'Content-type': 'application/json',
    },
  })
    .then(response => {
      dispatch(setBrands(response.data.object));

    })
    .catch(error => {
      dispatch(brandsErr(error.message));
      console.log('Error in getting brands ACTION CREATOR', error.message);
    });
};

const brandsLoading = () => ({
  type: ActionTypes.BRANDS_LOADING,
});

const brandsErr = errMess => ({
  type: ActionTypes.BRANDS_ERR,
  payload: errMess,
});

const setBrands = brands => ({
  type: ActionTypes.GET_BRANDS,
  payload: brands,
});

export const getFeaturedProducts = () => dispatch => {
  dispatch(featuredLoading());

  var url = fetchFeaturesProductsUrl();
  console.log('inside get featured productss ACTION CREATOR', url);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + ' ',
      'Content-type': 'application/json',
    },
    //   timeout: 15000,
  })
    .then(response => {
      // console.log(
      //   'Needs brands fetch complete ACTION CREATOR, number of brands',
      //   response.data.object.length,
      // );
      var evenArray = [];
      // var dummyData = [
      //   {
      //     name: 'dummyData',
      //   },
      // ];
      // if (response.data.object.length % 2 != 0) {
      //   evenArray = [...response.data.object, ...dummyData];
      // } else {
      evenArray = response.data.object;
      // }

      dispatch(setFeaturedProducts(evenArray));
    })
    .catch(error => {
      dispatch(featuredErr(error.message));
      console.log(
        'Error in getting featured Products ACTION CREATOR',
        error.message,
      );
    });
};

const featuredLoading = () => ({
  type: ActionTypes.FEATURED_PRODUCTS_LOADING,
});

const featuredErr = errMess => ({
  type: ActionTypes.FEATURED_PRODUCTS_ERR,
  payload: errMess,
});

const setFeaturedProducts = products => ({
  type: ActionTypes.GET_FEATURED_PRODUCTS,
  payload: products,
});


//DISCOUNT PRODUCT

export const getDiscountedProducts = () => dispatch => {
  dispatch(discountLoading());

  var url = fetchDiscountedProducts();
  console.log('inside get needs brands ACTION CREATOR', url);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + ' ',
      'Content-type': 'application/json',
    },
  })
    .then(response => {
      var evenArray = [];
      evenArray = response.data.object;
      dispatch(setDiscountProducts(evenArray));
    })
    .catch(error => {
      dispatch(discountErr(error.message));
      console.log(
        'Error in getting discount Products ACTION CREATOR',
        error.message,
      );
    });
};

const discountLoading = () => ({
  type: ActionTypes.DISCOUNT_PRODUCT_LOADING,
});

const discountErr = errMess => ({
  type: ActionTypes.DISCOUNT_PRODUCT_ERR,
  payload: errMess,
});

const setDiscountProducts = products => ({
  type: ActionTypes.GET_DISCOUNT_PRODUCT,
  payload: products,
});

////COLLECTION DATA
export const getCollection = (suppId) => dispatch => {
  dispatch(collectionLoading());

  var url = getCollectionsUrl(suppId);
  console.log('inside get collection ACTION CREATOR', url);

  Axios.get(url, {
    headers: {
      Authorization: 'bearer ' + ' ',
      'Content-type': 'application/json',
    },
    //   timeout: 15000,
  })
    .then(resp => {
      var collecData = [];
      var banners = [];
      var bannerData = [];
      resp.data.object.map((item, index) => {
        // console.log('top', item.type, item)
        if (item.type == 'Top Banners') {
          bannerData.push(item);
          banners.push(item.imageUrl);
        }
        if (item.type == 'Top Offers') {
          // console.log('colllllll', item)
          collecData.push(item);
        }
      })
      dispatch(setCollectionData(bannerData, banners, collecData));
    })
    .catch(error => {
      dispatch(collectionErr(error.message));
      console.log(
        'Error in getting featured collection ACTION CREATOR',
        error.message,
      );
    });
};

const collectionLoading = () => ({
  type: ActionTypes.COLLECTION_DATA_LOADING,
});

const collectionErr = errMess => ({
  type: ActionTypes.COLLECTION_DATA_ERR,
  payload: errMess,
});

const setCollectionData = (bannerData, banner, offers) => ({
  type: ActionTypes.GET_COLLECTION_DATA,
  payload: {
    banners: banner,
    bannerData: bannerData,
    offers: offers
  },
});
// ADD SUBSCRIPTION Data
export const addSubsCat = (id) => dispatch => {
  dispatch(addSubsCatId(id))
}
const addSubsCatId = (id) => ({
  type: ActionTypes.ADD_SUBSCRIPTION_ID,
  payload: id
})
export const addSubsCatFaq = (data) => dispatch => {
  dispatch(addSubsCatFaqData(data))
}
const addSubsCatFaqData = (data) => ({
  type: ActionTypes.ADD_SUBSCRIPTION_FAQ_ID,
  payload: data
})
export const deleteFaqData = () => dispatch => {
  dispatch(deleteSubsCatFaqData())
}
const deleteSubsCatFaqData = () => ({
  type: ActionTypes.DELETE_SUBSCRIPTION_FAQ_ID,
})
export const deleteSubsCat = () => dispatch => {
  dispatch(deleteSubsCatId())
}
const deleteSubsCatId = () => ({
  type: ActionTypes.DELETE_SUBSCRIPTION_ID,
})
