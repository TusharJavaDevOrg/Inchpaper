import * as ActionTypes from './ActionTypes';

export const CouponeResp = (
  state = {
    resp: null,
    hasAddedCoupon: false,
    code: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.SAVE_COUPONCODE_RESPONSE:
      //   console.log('here is code from resucer', action.code);
      return {
        ...state,
        resp: action.payload,
        hasAddedCoupon: true,
        code: action.code,
      };

    case ActionTypes.DELETE_COUPON_RESPONSE:
      return {
        ...state,
        resp: null,
        hasAddedCoupon: false,
        code: null,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        resp: null,
        hasAddedCoupon: false,
        code: null,
      };
    default:
      return state;
  }
};
