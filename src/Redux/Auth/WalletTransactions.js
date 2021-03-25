import * as ActionTypes from './ActionTypes';

export const WalletTransactions = (
  state = {
    transactions: [],
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_WALLET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        isLoading: false,
      };

    case ActionTypes.WALLET_TRANSACTIONS_LOADING:
      return {
        ...state,
        transactions: [],
        isLoading: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        transactions: [],
        isLoading: false,
      };
    default:
      return state;
  }
};
