import * as ActionTypes from './ActionTypes';

export const ReferalCode = (
  state = {
    code: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.GET_REFFERAL_CODE:
      return {
        ...state,
        code: action.payload,
      };

    // case ActionTypes.DELETE_REFFERAL_CODE:
    //   return {
    //     ...state,
    //     code: null,
    //   };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        code: null,
      };
    default:
      return state;
  }
};
