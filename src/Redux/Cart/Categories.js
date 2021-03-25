import * as ActionTypes from './ActionTypes';

export const Categories = (
  state = {
    data: null,
    isLoading: false,
    errorMess: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_CATEGORIES:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        errorMess: null,
      };

    case ActionTypes.CATEGORIES_LOADING:
      return {
        ...state,
        data: null,
        isLoading: true,
        errorMess: null,
      };

    case ActionTypes.CATEGRIES_ERR:
      return {
        ...state,
        data: null,
        isLoading: false,
        errorMess: action.payload,
      };

    default:
      return state;
  }
};
