import * as ActionTypes from './ActionTypes';

export const SearchQueries = (
  state = {
    data: [],

  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_SEARCH_QUERY:
      const newProduct = [action.payload];
      return {
        ...state,
        data: [...state.data, ...newProduct],

      };
    case ActionTypes.DELETE_SEARCH_QUERY:
      return {
        ...state,
        data: []
      }



    default:
      return state;
  }
};
