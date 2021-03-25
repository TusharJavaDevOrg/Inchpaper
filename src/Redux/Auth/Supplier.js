import * as ActionTypes from './ActionTypes';

const defaultSupplierId = 315;

export const Supplier = (
  state = {
    id: defaultSupplierId,
    data: null,
    isLoading: false,
    errMess: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_SUPPLIER_DATA:
      return {
        ...state,
        id: action.payload.supplierId,
        data: action.payload.supplierData,
        isLoading: false,
        errMess: null,
      };

    case ActionTypes.DELETE_SUPPLIER_DATA:
      return {
        ...state,
        id: state.id,
        data: null,
        isLoading: false,
        errMess: null,
      };

    case ActionTypes.SUPPLIER_DATA_LOADING:
      return {
        ...state,
        id: state.id,
        data: state.data,
        isLoading: true,
        errMess: null,
      };

    case ActionTypes.SUPPLIER_DATA_ERR:
      return {
        ...state,
        id: defaultSupplierId,
        data: null,
        isLoading: false,
        errMess: action.payload.errMess,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        id: defaultSupplierId,
        data: null,
        isLoading: false,
        errMess: null,
      };
    default:
      return state;
  }
};
