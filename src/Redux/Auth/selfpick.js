import * as ActionTypes from './ActionTypes';

export const Selfpickup = (
    state = false,
    action,
) => {
    switch (action.type) {

        case ActionTypes.START_SELF_PICKUP:
            console.log('self pickuppppppppppppppppppp')
            return state = false;

        case ActionTypes.START_HOME_DELIVERY:
            console.log('home deliveryyyyyyyyyyyyyyyyy')

            return state = true;
        case ActionTypes.LOG_OUT:
            return state = true;
        default:
            return state;
    }
};
