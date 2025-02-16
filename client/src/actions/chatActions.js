// chatActions.js
import { toast } from "react-toastify";
import API from "../api";
import {
  FETCH_CHATS_FAILURE,
  FETCH_MESSAGES_REQUEST,
  SELECT_CHAT,
  FETCH_CHAT_MESSAGES_FAILURE,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_MORE_CHAT_MESSAGES_SUCCESS,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_FAILURE,
  MUTE_CHAT,
  UNMUTE_CHAT
} from "../constants/actionTypes.js";


// Fetch chat messages for the selected user
export const fetchChatMessages = (chatId) => async (dispatch) => {
  
  try {
    dispatch({
      type: FETCH_MESSAGES_REQUEST,
    });
    const response = await API.get(`/api/chats/${chatId}/messages`);
    
    
    const messages = response.data.formattedMessages || response.data;
      dispatch({
        type: FETCH_CHAT_MESSAGES_SUCCESS,
        payload: messages,
      });
    } else {
      dispatch({
        type: FETCH_MORE_CHAT_MESSAGES_SUCCESS,
        payload: messages,
      });
    }
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    dispatch({ type: FETCH_CHAT_MESSAGES_FAILURE, payload: error.message });
  }
};

export const muteChat = ({userId, chatId}) => async (dispatch) => {
  try {
    const {data} = await API.put(`api/chats/muteChat/${userId}/${chatId}`)
    dispatch ({type: MUTE_CHAT, payload: {userId, chatId}})
    toast.success(data.message)

    
  
  } catch (error) {
    toast.error('Action failed')
    
  }
}

export const unmuteChat = ({userId, chatId}) => async (dispatch) => {
  try {
    const {data} = await API.put(`api/chats/unmuteChat/${userId}/${chatId}`)
    dispatch ({type: UNMUTE_CHAT, payload: {userId, chatId}})

    toast.success(data.message)

  
  } catch (error) {
    toast.error('Action failed')
    
  }
}

// block users this is implemented here as authRoutes is not suitable for this
export const blockUser = ({userId, blockedUserId}) => async (dispatch) => {

  try {
    const body = {userId, blockedUserId}
    console.log('inside blockUser')
    const {data} = await API.post(`api/users/block/`, body)
    dispatch ({type: 'BLOCK_USER', payload: blockedUserId})
    console.log(data)
    toast.success(data.message)
    
  } catch (error) {
    toast.error('Action failed')
    
  }
}


export const unblockUser = ({userId, blockedUserId}) => async (dispatch) => {
  try {
    const body = {userId, blockedUserId}
    
    const {data} = await API.post(`api/users/unblock/`, body)
    dispatch ({type: 'UNBLOCK_USER', payload: blockedUserId})
    toast.success(data.message)
    
  } catch (error) {
    toast.error('Action failed')
    
  }
}