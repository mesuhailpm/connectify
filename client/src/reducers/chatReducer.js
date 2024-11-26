import {
  FETCH_CHATS_FAILURE,
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
  FETCH_MORE_CHAT_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  SELECT_CHAT,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_STATUS,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILURE,
  FETCH_MORE_CHAT_MESSAGES_SUCCESS,
  RE_SEND_MESSAGE_REQUEST,
} from "../constants/actionTypes";

const initialState = {
  chats: [], // List of all chat threads
  selectedChat: null, // The currently selected chat
  messages: [], // Messages for the selected chat
  loading: false, // Loading status for async requests
  chatsLoading: false, // Loading status for fetching chats
  error: null, // Errors when fetching/sending messages
  sendingMessage: false, // Status for when a message is being sent
  getChatMessagesError: null
};

const chatReducer = (state = initialState, action) => {
  if (!action.type.startsWith("@@")) {
    console.log(action);
  }
  switch (action.type) {
    case FETCH_CHATS_REQUEST:
      return {
        ...state,
        chatsLoading: true,
        error: null,
      };

    case FETCH_CHATS_SUCCESS:
      return {
        ...state,
        chatsLoading: false,
        chats: action.payload, //was .chats
      };

    case FETCH_MORE_CHAT_SUCCESS:
      return { ...state, chats: [...state.chats, action.payload] };

    case FETCH_CHATS_FAILURE:
      return {
        ...state,
        chatsLoading: false,
        getChatMessagesError: action.payload,
      };

    case SELECT_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
        messages: [],
        loading: false,
      };

    case FETCH_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload,
      };

    case FETCH_CHAT_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        getChatMessagesError: action.payload,
      };

    case FETCH_MORE_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
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
        messages: [...state.messages, action.payload], // Add the new message to the chat
      };


      case RE_SEND_MESSAGE_REQUEST: 
        return {
          ...state,
          sendingMessage: true,
          messages: [...state.messages.filter( msg => msg._id !== action.payload._id), action.payload], // Add the new message to the chat
        };
  

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sendingMessage: false,
        messages: [...state.messages.map((msg)=>msg._id === action.payload._id ? {...msg, status: 'sent'}: msg)], // Add the new message to the chat
      };

    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        sendingMessage: false,
        messages: [
          ...state.messages.map((msg) =>
            msg._id === action.payload.message ? { ...msg, status: "notSent" } : msg
          ),
        ],
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
