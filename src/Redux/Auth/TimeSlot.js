import * as ActionTypes from './ActionTypes';

export const TimeSlot = (
    state = {
        slots: undefined,
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.ADD_TIME_SLOTS:
            return {
                ...state,

                slots: action.payload,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.DELETE_TIME_SLOTS:
            return {
                ...state,

                slots: undefined,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.TIME_SLOTS_LOADING:
            return {
                ...state,

                slots: state.data,
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.TIME_SLOTS_ERR:
            return {
                ...state,

                slots: undefined,
                isLoading: false,
                errMess: action.payload.errMess,
            };

        case ActionTypes.LOG_OUT:
            return {
                ...state,
                slots: undefined,
                isLoading: false,
                errMess: null,
            };
        default:
            return state;
    }
};
