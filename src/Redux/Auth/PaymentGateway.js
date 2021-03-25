import * as ActionTypes from './ActionTypes';

export const PaymentGateway = (
    state = {
        mode: null,
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.ADD_PAYMENT_GATEWAY:
            return {
                ...state,

                mode: action.payload,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.DELETE_PAYMENT_GATEWAY:
            return {
                ...state,

                mode: null,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.PAYMENT_GATEWAY_LOADING:
            return {
                ...state,

                mode: state.data,
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.PAYMENT_GATEWAY_ERR:
            return {
                ...state,

                mode: null,
                isLoading: false,
                errMess: action.payload.errMess,
            };

        case ActionTypes.LOG_OUT:
            return {
                ...state,
                mode: null,
                isLoading: false,
                errMess: null,
            };
        default:
            return state;
    }
};
