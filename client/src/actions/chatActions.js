// chatActions.js
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
  SEARCH_USERS_FAILURE
} from "../constants/actionTypes.js";


// Fetch chat messages for the selected user
export const fetchChatMessages = (chatId) => async (dispatch) => {
  console.log("inside fetchchatMessages");
  try {
    dispatch({
      type: FETCH_MESSAGES_REQUEST,
    });
    const response = await API.get(`/api/chats/${chatId}/messages`);
    // const response = await API.get(`/api/chats/${userId}/messages`);
    console.log(response);
    const messages = response.data.formattedMessages || response.data;
    console.log(messages);
    if (messages.length) {
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
