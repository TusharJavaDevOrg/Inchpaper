import * as ActionTypes from './ActionTypes';

export const DiscountedProducts = (
    state = {
        data: [],
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.GET_DISCOUNT_PRODUCT:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.DISCOUNT_PRODUCT_LOADING:
            return {
                ...state,
                data: [],
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.DISCOUNT_PRODUCT_ERR:
            return {
                ...state,
                data: [],
                isLoading: false,
                errMess: action.payload,
            };

        default:
            return state;
    }
};
