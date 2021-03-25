import * as ActionTypes from './ActionTypes';

export const DeliveryTime = (
    state = false,
    action,
) => {
    switch (action.type) {

        case ActionTypes.FULL_TIME_DELIVERY:
            console.log('FULL TIMEEEEE pickuppppppppppppppppppp')
            return state = false;

        case ActionTypes.NORMAL_DELIVERY:
            console.log('home deliveryyyyyyyyyyyyyyyyy')

            return state = true;
        case ActionTypes.LOG_OUT:
            return state = true;
        default:
            return state;
    }
};
