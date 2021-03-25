import * as ActionTypes from './ActionTypes';

export const DeliverableSocieties = (
  state = {
    societyList: [],
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_SOCIETY_DATA:
      return {
        ...state,
        societyList: action.payload,
        isLoading: false,
      };

    case ActionTypes.SOCIETY_DATA_LOADING:
      return {
        ...state,
        societyList: [],
        isLoading: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        societyList: [],
        isLoading: false,
      };
    default:
      return state;
  }
};
