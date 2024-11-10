// src/actions/authActions.js
import API from '../api'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE ,LOGOUT} from '../constants/actionTypes';
import { toast } from 'react-toastify';

// Load user from the token if it exists in localStorage
export const loadUserFromToken = () => async (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      // Attach token to headers (assuming you use JWT and Bearer token)
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch the user's data (this can be from your /me or /profile endpoint)
      const { data } = await API.get('/api/auth/me');

      dispatch({
        type: AUTH_SUCCESS,
        payload: { user: data.user, token },
      });
    } catch (error) {
      dispatch({
        type: AUTH_FAILURE,
        payload: { error: 'Failed to authenticate' },
      });
      // Optionally, clear token if failed
      localStorage.removeItem('token');
    }
  }
};

//
export const login = (credentials) => async (dispatch) => {
  try {
    // dispatch({ type: AUTH_REQUEST });
    const datad = await API.post('/api/auth/login', credentials); // API endpoint for login

    console.log(datad)
    const { data } = await API.post('/api/auth/login', credentials); // API endpoint for login

    dispatch({
      type: AUTH_SUCCESS,
      payload: { user: data.user, token: data.token },
    });

    // Save token to localStorage if needed
    localStorage.setItem('token', data.token);
  } catch (error) {

    const errorMessage = error.response?.data?.message || 'Login failed';

    
    dispatch({
      type: AUTH_FAILURE,
      payload: { error: error.response ? error.response.data.message : 'Login failed' },
    });
    toast.error(errorMessage)
  }
};

export const signUp = (userData) => async (dispatch) => {
    try {
      dispatch({ type: AUTH_REQUEST });
      console.log({userData})
  
      const { data } = await API.post('/api/auth/signup', userData); // API endpoint for sign up
  
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
  
      // Save token to localStorage if needed
      localStorage.setItem('token', data.token);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Sign-up failed';

      console.log(error)
      dispatch({
        type: AUTH_FAILURE,
        payload: { error: errorMessage},
      });
      toast.error(errorMessage)
    }
  };

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  dispatch({ type: LOGOUT });
};
