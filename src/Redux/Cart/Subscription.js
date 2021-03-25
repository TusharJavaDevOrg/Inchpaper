import * as ActionTypes from './ActionTypes';

export const SubscriptionData = (
    state = {
        id: 0,
        isSubscription: false,
        faq: null,
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.ADD_SUBSCRIPTION_ID:
            return {
                ...state,
                id: action.payload,
                isSubscription: true,
                faq: null,
                isLoading: false,
                errMess: null,
            };
        case ActionTypes.ADD_SUBSCRIPTION_FAQ_ID:
            return {
                ...state,
                id: state.id,
                isSubscription: true,
                faq: action.payload,
                isLoading: false,
                errMess: null,
            };
        case ActionTypes.DELETE_SUBSCRIPTION_FAQ_ID:
            return {
                ...state,
                id: state.id,
                isSubscription: true,
                faq: null,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.DELETE_SUBSCRIPTION_ID:
            return {
                ...state,
                id: 0,
                isSubscription: false,
                faq: null,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.SUBSCRIPTION_ID_LOADING:
            return {
                ...state,

                id: state.data,
                isSubscription: state.isSubscription,
                faq: state.faq,
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.SUBSCRIPTION_ID_ERR:
            return {
                ...state,

                id: 0,
                faq: null,
                isSubscription: false,
                isLoading: false,
                errMess: action.payload.errMess,
            };

        case ActionTypes.LOG_OUT:
            return {
                ...state,
                id: 0,
                faq: null,
                isSubscription: false,
                isLoading: false,
                errMess: null,
            };
        default:
            return state;
    }
};
