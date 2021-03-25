import * as ActionTypes from './ActionTypes';

export const DefaultVariants = (
  state = {
    defaultVariants: [],
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.DELETE_DEFAULT_VARIANTS:
      return {
        ...state,
        defaultVariants: [],
      };

    case ActionTypes.ADD_DEFAULT_VARIANTS:
      var allProducts = action.payload;
      var allDefaultVariants = [];
      allProducts.map((item, index) => {
        allDefaultVariants.push(item.productListings[0].variantValues[0]);
      });
      // console.log('All default variants from reducer---->', allDefaultVariants);
      return {
        ...state,
        defaultVariants: [...state.defaultVariants, ...allDefaultVariants],
      };

    case ActionTypes.EDIT_DEFAULT_VARIANTS:
      var newVariantValue = action.payload.newVariantInfo;
      var indexOfItemThisVariantBelongsTo = action.payload.indexOfProduct;
      var currentVariantValues = state.defaultVariants;
      currentVariantValues[indexOfItemThisVariantBelongsTo] = newVariantValue;
      var newVariantValues = currentVariantValues;
      // console.log('Edited variant values on reducer---->', newVariantValues);
      return {
        ...state,
        defaultVariants: newVariantValues,
      };

    default:
      return state;
  }
};
