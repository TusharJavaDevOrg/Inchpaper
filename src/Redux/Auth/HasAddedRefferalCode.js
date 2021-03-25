import * as ActionTypes from './ActionTypes';

export const HasAddedRefferalCode = (
  state = {
    hasAdded: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADDED_REDDERAL_CODE:
      return {
        ...state,
        hasAdded: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        hasAdded: false,
      };
    default:
      return state;
  }
};
