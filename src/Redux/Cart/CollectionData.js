import * as ActionTypes from './ActionTypes';

export const CollectionData = (
    state = {
        banners: [],
        bannerData: [],
        offers: [],
        isLoading: false,
        errMess: null,
    },
    action,
) => {
    switch (action.type) {
        case ActionTypes.GET_COLLECTION_DATA:
            return {
                ...state,
                banners: action.payload.banners,
                bannerData: action.payload.bannerData,
                offers: action.payload.offers,
                isLoading: false,
                errMess: null,
            };

        case ActionTypes.COLLECTION_DATA_LOADING:
            return {
                ...state,
                banners: [],
                bannerData: [],
                offers: [],
                isLoading: true,
                errMess: null,
            };

        case ActionTypes.COLLECTION_DATA_ERR:
            return {
                ...state,
                banners: [],
                bannerData: [],
                offers: [],
                isLoading: false,
                errMess: action.payload,
            };

        default:
            return state;
    }
};
