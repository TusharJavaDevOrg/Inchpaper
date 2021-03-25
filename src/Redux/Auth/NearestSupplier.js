import * as ActionTypes from './ActionTypes';

export const NearestSupplier = (
  state = {
    supplierIdWithMinDist: null,
    minDist: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_NEAREST_SUPPLIER:
      return {
        ...state,
        supplierIdWithMinDist: action.payload,
        minDist: action.minDist,
      };

    case ActionTypes.DELETE_NEAREST_SUPPLIER:
      return {
        ...state,
        supplierIdWithMinDist: null,
        minDist: null,
      };

    case ActionTypes.REMOVE_SELECTED_ADDRESS_AND_SUPPLIER_WITH_MIN_DIST:
      return {
        ...state,
        supplierIdWithMinDist: null,
        minDist: null,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        supplierIdWithMinDist: null,
        minDist: null,
      };
    default:
      return state;
  }
};
