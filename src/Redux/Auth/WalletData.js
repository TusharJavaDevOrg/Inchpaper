import * as ActionTypes from './ActionTypes';

export const WalletData = (
  state = {
    wallet: null,
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_WALLET_DATA:
      return {
        ...state,
        wallet: action.payload,
        isLoading: false,
      };

    case ActionTypes.WALLET_DATA_LOADING:
      return {
        ...state,
        wallet: null,
        isLoading: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        wallet: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
