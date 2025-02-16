// src/actions/authActions.js
import API from '../api'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE ,LOGOUT} from '../constants/actionTypes';
import { toast } from 'react-toastify';
import socket from '../sockets/socket';

// Load user from the token if it exists in localStorage
export const loadUserFromToken = () => async (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      // Attach token to headers (assuming you use JWT and Bearer token)
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch the user's data (this can be from your /me or /profile endpoint)
      const { data: {user} } = await API.get('/api/auth/me');
      //when the user details are not returned, the user is not authenticated
      if(!user) throw new Error('Failed to authenticate')
      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, token },
      });
    } catch (error) {
      console.log(error)
      const errorMessage = (error.message === "Network Error" || error.message === 'Session expired') ? error.message : error.response?.data?.message || 'Failed to authenticate';
      dispatch({
        type: AUTH_FAILURE,
        payload: { error: errorMessage },
      });

      // Optionally, clear token if expired
      if (error.message === 'Session expired') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    }
  } else {
    dispatch({
      type: AUTH_FAILURE,
      payload: { error: "Failed to authenticate" },
    });
    // Optionally, clear userId if failed
    localStorage.removeItem('userId');
  }
};

//
export const login = (credentials) => async (dispatch) => {
    try {
    // dispatch({ type: AUTH_REQUEST });
    const { data : {user, token} } = await API.post("/api/auth/login", credentials); // API endpoint for login  
    dispatch({
      type: AUTH_SUCCESS,
      payload: { user, token }, //data.data is object with _id, username, email, avatar, createdAt,
    });

    // Save token to localStorage if needed
    localStorage.setItem('token', token);
    localStorage.setItem("userId", user._id);
    toast.success('Login Sucessfull!')

  } catch (error) {

    const errorMessage = error.message === "Network Error" ? error.message : error.response?.data?.message || 'Login failed';


    dispatch({
      type: AUTH_FAILURE,
      payload: error,
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
      payload: { user: data.data.user, token: data.token },
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
  socket.emit('user-logout', localStorage.getItem('userId'));
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  dispatch({ type: LOGOUT });
};
