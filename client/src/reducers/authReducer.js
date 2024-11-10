import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE, LOGOUT } from '../constants/actionTypes';

const initialState = {
    user: null,        // Stores the logged-in user's details
    token: !!localStorage.getItem('token'),       // JWT token for authentication
    isAuthenticated: false, // Whether the user is logged in
    loading: true,    // Loading status for async requests
    error: null,       // Errors during login/signup
  };
  
  const authReducer = (state = initialState, action) => {
    if (!action.type.startsWith("@@")) {console.log(action)}
    switch (action.type) {
      case AUTH_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case AUTH_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          error: null,
        };
  
      case AUTH_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        };
  
      case LOGOUT:
        return {
          ...state,
          user: null,
          token: null,
          isAuthenticated: false,
        };
  
      default:
        return state;
    }
  };
  
  export default authReducer;
  