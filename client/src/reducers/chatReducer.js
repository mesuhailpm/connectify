import {
  FETCH_CHATS_FAILURE,
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
  FETCH_MORE_CHAT_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  FETCH_MESSAGES_REQUEST,
  SELECT_CHAT,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE,
  UPDATE_MESSAGE_STATUS,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILURE,
  FETCH_MORE_CHAT_MESSAGES_SUCCESS,
  RE_SEND_MESSAGE_REQUEST,
  MESSAGE_READ_CONFIRMATION ,
  MESSAGE_READ_BY_SELF ,
  UPDATE_CHAT_PARTNER,
  LOGOUT,
  INITILAIZE_SELECT_CHAT,
  MARK_ONE_MESSAGE_NOTIFICATION_AS_READ
} from "../constants/actionTypes";

const initialState = {
  chats: [], // List of all chat threads
  selectedChat: null, // The currently selected chat
  messages: [], // Messages for the selected chat
  loading: false, // Loading status for async requests
  chatsLoading: false, // Loading status for fetching chats
  error: null, // Errors when fetching/sending messages
  sendingMessage: false, // Status for when a message is being sent
  getChatMessagesError: null,
  unreadMessageNotifications: [],
};

const chatReducer = (state = initialState, action) => {
  if (!action.type.startsWith("@@")) {
    console.log(action);
  }
  switch (action.type) {

    case MARK_ONE_MESSAGE_NOTIFICATION_AS_READ:

      return {
        ...state,
        unreadMessageNotifications: state.unreadMessageNotifications.map((el)=>(el._id === action.payload ? {...el, isRead: true} : el))
      }

    case FETCH_MESSAGE_NOTIFICATION_FROM_DATABASE:

      return {
        ...state,
        unreadMessageNotifications : action.payload
      };
    
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

    case LOGOUT:
            return {
              ...state,
              getChatMessagesError:null,
              messages:[],
              chats:[],            
              selectedChat: null,
            };

    case SELECT_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
        messages: [],
        loading: false,
      };
    case INITILAIZE_SELECT_CHAT:
      const completeChat = state.chats.find(
        (chat) => chat._id === action.payload
      );

      return {
        ...state,
        selectedChat: completeChat,
        messages: [],
        loading: false,
      };

    case UPDATE_CHAT_PARTNER:
      return {
        ...state,
        selectedChat: {...state.selectedChat, ...action.payload},
      }
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
        getChatMessagesError: null
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

    case RECEIVE_MESSAGE:
      const isTheMessageInActiveChat = state.selectedChat?._id === action.payload.chat;

      let unreadMessageNotifications = state.unreadMessageNotifications;
      
      if (!isTheMessageInActiveChat || !action.isOnChatsPage) {
          const exisitingNotification = state.unreadMessageNotifications.find(
        (notif) => notif.sender === action.payload.sender
      );

      const chat = state.chats.find((chat) => chat._id === action.payload.chat);

      unreadMessageNotifications = exisitingNotification
        ? state.unreadMessageNotifications.map((notif) =>
            notif.sender === action.payload.sender
              ?
              
               {
                  ...notif,
                  label: action.payload.content,
                  moreMessageCount: exisitingNotification.moreMessageCount + 1,
                  name: chat.username
                }
              : notif
          )
        : [
            ...state.unreadMessageNotifications,
            {
              label: action.payload.content,
              sender: action.payload.sender,
              moreMessageCount: 0,
              chat: action.payload.chat,
              name: chat?.username,
              avatar: chat?.avatar
            },
          ];}
      return {
        ...state,
        // Add the new message to the chat
        messages:
          state.selectedChat?._id === action.payload.chat
            ? [...state.messages, action.payload]
            : state.messages, 
        // Update the last message of the chat
        chats: state.chats?.map((chat) =>
          chat._id === action.payload.chat
            ? { ...chat, lastMessage: action.payload.content }
            : chat
        ),

        unreadMessageNotifications : (isTheMessageInActiveChat && action.isOnChatsPage) ? state.unreadMessageNotifications : unreadMessageNotifications
      };

    
    case UPDATE_NOTIFICATION_NAME:
      return {
        ...state,
        unreadMessageNotifications: state.unreadMessageNotifications.map((notif) => {
          if (notif.sender === action.payload.sender) {
            return {
              ...notif,
              name: action.payload.name,
            };
          }
          return notif;
        }),
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

    case MESSAGE_READ_CONFIRMATION  :
      return {
        ...state,
        messages: state.messages.map((msg) => msg._id === action.payload.messageId ? {...msg, readBy: [...msg.readBy, action.payload.readerId],isReadByTarget: true} : msg),
      }

    case MESSAGE_READ_BY_SELF :
    return {  
      ...state,
        messages: state.messages.map((msg) => msg._id === action.payload.messageId ? {...msg, readBy: [...msg.readBy, action.payload.readerId]} : msg) 
      
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
