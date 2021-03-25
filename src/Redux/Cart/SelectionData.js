import * as ActionTypes from './ActionTypes';

export const SelectData = (
  state = {
    data: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_SELECTDATA:
      return {
        ...state,
        data: action.payload,
      };

    case ActionTypes.DELETE_SELECTDATA:
      return {
        ...state,
        data: null,
      };

    default:
      return state;
  }
};
