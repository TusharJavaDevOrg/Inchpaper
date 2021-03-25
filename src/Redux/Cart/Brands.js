import * as ActionTypes from './ActionTypes';

export const Brands = (
  state = {
    data: null,
    isLoading: false,
    errMess: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_BRANDS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        errMess: null,
      };

    case ActionTypes.BRANDS_LOADING:
      return {
        ...state,
        data: null,
        isLoading: true,
        errMess: null,
      };

    case ActionTypes.BRANDS_ERR:
      return {
        ...state,
        data: null,
        isLoading: false,
        errMess: action.payload,
      };

    default:
      return state;
  }
};
