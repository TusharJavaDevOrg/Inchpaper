import * as ActionTypes from './ActionTypes';

export const Favourites = (
  state = {
    products: [],
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_ONE_FAVOURITE:
      const newProduct = [action.payload];
      return {
        ...state,
        products: [...state.products, ...newProduct],
      };

    case ActionTypes.REMOVE_ONE_FAVOURITE:
      const productId = action.payload;
      var indexOfProductToBeleted = state.products.findIndex(
        (it, ind) => it.id === productId,
      );
      var currentFavourites = state.products;
      currentFavourites.splice(indexOfProductToBeleted, 1);
      return {
        ...state,
        products: currentFavourites,
      };

    case ActionTypes.REMOVE_ALL_FAVOURITES:
      return {
        ...state,
        products: [],
      };
    default:
      return state;
  }
};
