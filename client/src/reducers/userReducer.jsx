import {
  CLEAR_ERRORS,
  GET_USERS_BY_ROOM_REQUEST,
  GET_USERS_BY_ROOM_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_FAILURE,
  LOGOUT_USER_RESET,
  LOGOUT_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_RESET,
  REGISTER_USER_SUCCESS,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_SUCCESS,
} from "../constants/userConstants";

export const authReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        success: true,
      };
    case LOGIN_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
        loggedOut: true,
      };
    case LOGOUT_USER_RESET:
      return {
        ...state,
        loggedOut: false,
      };
    case REGISTER_USER_RESET:
      return {
        loading: false,
        ...state,
        success: false,
      };
    case LOGOUT_USER_FAILURE:
      return {
        ...state,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case LOAD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case REGISTER_USER_FAILURE:
    case LOGIN_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case GET_USERS_BY_ROOM_REQUEST:
      return {
        loading: true,
      };
    case GET_USERS_BY_ROOM_SUCCESS:
      return {
        loading: false,
        users: action.payload.users,
      };
    case UPDATE_PROFILE_FAILURE:
      return {
        loading: false,
        users: null,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
      return {
        loading: true,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        loading: false,
        isUpdated: action.payload.success,
      };
    case UPDATE_PROFILE_FAILURE:
      return {
        loading: false,
        error: action.payload,
      };
    case UPDATE_PROFILE_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
