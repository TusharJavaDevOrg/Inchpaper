import * as ActionTypes from './ActionTypes';

export const AbandonedCheckout = (
    state = {
        id: 0,
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.ADD_ABANDONED_ID:
            return {
                ...state,

                id: action.payload,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.DELETE_ABANDONED_ID:
            return {
                ...state,

                id: 0,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.ABANDONED_ID_LOADING:
            return {
                ...state,

                id: state.data,
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.ABANDONED_ID_ERR:
            return {
                ...state,

                id: 0,
                isLoading: false,
                errMess: action.payload.errMess,
            };

        case ActionTypes.LOG_OUT:
            return {
                ...state,
                id: 0,
                isLoading: false,
                errMess: null,
            };
        default:
            return state;
    }
};
