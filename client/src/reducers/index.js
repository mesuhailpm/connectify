import { applyMiddleware, combineReducers, createStore } from 'redux';
import authReducer from './authReducer';
import chatReducer from './chatReducer';
import {thunk} from 'redux-thunk'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

const store = createStore (rootReducer,applyMiddleware(thunk))

export default store;
