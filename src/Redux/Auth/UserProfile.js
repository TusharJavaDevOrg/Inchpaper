import * as ActionTypes from './ActionTypes';

export const User = (
  state = {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    userName: null,
    description: null,
    isLoading: false,
    errMess: null,
    profilePictureUrl: null,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.USERDATA_ERR:
      return {
        ...state,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        userName: null,
        description: null,
        isLoading: false,
        errMess: action.payload,
        profilePictureUrl: null,
      };

    case ActionTypes.USERDATA_SUCCESS:
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        phoneNumber: action.payload.phoneNo,
        email: action.payload.emailId,
        userName: action.payload.userName,
        description: null,
        isLoading: false,
        errMess: null,
        profilePictureUrl: action.payload.profilePicUrl,
      };

    case ActionTypes.USERDATA_LOADING:
      return {
        ...state,
        firstName: state.firstName,
        lastName: state.lastName,
        phoneNumber: state.phoneNumber,
        email: state.email,
        userName: state.userName,
        description: null,
        isLoading: true,
        errMess: null,
        profilePictureUrl: state.profilePictureUrl,
      };

    case ActionTypes.LOG_OUT:
      return {
        ...state,
        firstName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        userName: null,
        description: null,
        isLoading: false,
        errMess: null,
        profilePictureUrl: null,
      };

    default:
      return state;
  }
};
