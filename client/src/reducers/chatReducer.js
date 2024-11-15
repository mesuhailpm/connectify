import {FETCH_CHATS_FAILURE, FETCH_CHATS_REQUEST, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_FAILURE, FETCH_MESSAGES_REQUEST, FETCH_MESSAGES_SUCCESS, SELECT_CHAT, SEND_MESSAGE_FAILURE, SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, UPDATE_MESSAGE_STATUS} from '../constants/actionTypes';

const initialState = {
    chats: [],                 // List of all chat threads
    selectedChat: null,         // The currently selected chat
    messages: [],               // Messages for the selected chat
    loading: false,             // Loading status for async requests
    chatsLoading: false, // Loading status for fetching chats
  error: null, // Errors when fetching/sending messages
    sendingMessage: false,      // Status for when a message is being sent
  };
  
  const chatReducer = (state = initialState, action) => {
  if (!action.type.startsWith("@@")) {
    switch (action.type) {
      case FETCH_CHATS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case FETCH_CHATS_SUCCESS:
        return {
          ...state,
          loading: false,
          chats: action.payload.chats,
        };
  
      case FETCH_CHATS_FAILURE:
        return {
          ...state,
        chatsLoading: false,
        error: action.payload,
        };
  
      case SELECT_CHAT:
        return {
          ...state,
          selectedChat: action.payload.chat,
          messages: [],
          loading: false,
        };
  
      case FETCH_MESSAGES_REQUEST:
        return {
          ...state,
          loading: true,
        };
  
      case FETCH_MESSAGES_SUCCESS:
        return {
          ...state,
          loading: false,
          messages: action.payload.messages,
        };
  
      case FETCH_MESSAGES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
        };
  
      case SEND_MESSAGE_REQUEST:
        return {
          ...state,
          sendingMessage: true,
        };
  
      case SEND_MESSAGE_SUCCESS:
        return {
          ...state,
          sendingMessage: false,
          messages: [...state.messages, action.payload.message], // Add the new message to the chat
        };
  
      case SEND_MESSAGE_FAILURE:
        return {
          ...state,
          sendingMessage: false,
          error: action.payload.error,
        };
  
      case UPDATE_MESSAGE_STATUS: // For updating read, delivered, sent status
        return {
          ...state,
          messages: state.messages.map((msg) =>
            msg._id === action.payload.messageId
              ? { ...msg, status: action.payload.status }
              : msg
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default chatReducer;
  