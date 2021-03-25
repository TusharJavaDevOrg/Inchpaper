import * as ActionTypes from './ActionTypes';

export const VisitedProfileOnes = (
  state = {
    hasVisited: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.VISITED_PROFILE_ONES:
      return {
        ...state,
        hasVisited: true,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        hasVisited: false,
      };
    default:
      return state;
  }
};
