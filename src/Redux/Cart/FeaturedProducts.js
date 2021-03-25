import * as ActionTypes from './ActionTypes';

export const FeaturedProducts = (
  state = {
    data: [],
    isLoading: false,
    errMess: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_FEATURED_PRODUCTS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        errMess: null,
      };

    case ActionTypes.FEATURED_PRODUCTS_LOADING:
      return {
        ...state,
        data: [],
        isLoading: true,
        errMess: null,
      };

    case ActionTypes.FEATURED_PRODUCTS_ERR:
      return {
        ...state,
        data: [],
        isLoading: false,
        errMess: action.payload,
      };

    default:
      return state;
  }
};
