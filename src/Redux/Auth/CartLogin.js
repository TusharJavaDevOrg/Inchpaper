import * as ActionTypes from './ActionTypes';

export const Loginfromcart = (
    state = false,
    action,
) => {
    switch (action.type) {

        case ActionTypes.LOGING_FROM_CART:
            console.log('login from cart')
            return state = true;

        case ActionTypes.LOGING_FROM_START:
            console.log('home deliveryyyyyyyyyyyyyyyyy')

            return state = false;
        case ActionTypes.LOG_OUT:
            return state = false;
        default:
            return state;
    }
};
