import * as ActionTypes from './ActionTypes';

export const UserOrders = (
  state = {
    orders: [],
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_USER_ORDERS:
      return {
        ...state,
        orders: action.payload,
        isLoading: false,
      };

    case ActionTypes.USER_ORDERS_LOADING:
      return {
        ...state,
        orders: [],
        isLoading: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        orders: [],
        isLoading: false,
      };

    default:
      return state;
  }
};
