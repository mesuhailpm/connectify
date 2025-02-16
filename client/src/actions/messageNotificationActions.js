import { toast } from "react-toastify";
import API from "../api";
import { FETCH_MESSAGE_NOTIFICATION_FROM_DATABASE, MARK_ALL_MESSAGE_NOTIFICATIONS_AS_READ, MARK_ONE_MESSAGE_NOTIFICATION_AS_READ } from "../constants/actionTypes";

export const fetchUnreadMessageNotifications = (userId, isOnChatsPage) => async (dispatch)=> {
    try{
        
        const { data } =  await API.get('/api/messageNotifications/'+userId);
        console.log(data);
        
        const unreadMessageNotifications = data.map((el) => ({...el, avatar: el.sender.avatar, name: el.sender.username, label: el.content}));
        dispatch( {type: FETCH_MESSAGE_NOTIFICATION_FROM_DATABASE, payload: unreadMessageNotifications, isOnChatsPage});
        return unreadMessageNotifications;
    } catch (error) {
        toast.error("Unable to fetch message notifications")
        throw error;
    }
}
export const markNotificationAsReadInDb = ({userId, notificationId}) => async (dispatch)  => {
    try { 
      const {data} = await API.put(
        "/api/messageNotifications/markOneAsRead/"+userId+"/"+notificationId
      );
    dispatch({type: MARK_ONE_MESSAGE_NOTIFICATION_AS_READ, payload: notificationId})
    toast.success(data.message)
  } catch (error) {
      toast.error('Failed to mark as read', {autoClose: 2000})
    }
    
  }
  
  export const markNotificationForChatAsReadInDb = async ({userId, chatId}) => {
    try {
      const {data} = await API.put(
        "/api/messageNotifications/markOneAsReadByChatId/"+userId+"/"+chatId
      );
      
    } catch (error) {
      console.log('error inside markNotificationForMessageAsReadInDb ',error)
      throw error;    
    }
    
  }

  export const markAllNotificationsAsReadInDb = async (userId) => async (dispatch) => {
    try { 
      const {data} = await API.put(
        "/api/messageNotifications/"+userId+"/markAsRead"
      );
      console.log(data)
      await dispatch({type: MARK_ALL_MESSAGE_NOTIFICATIONS_AS_READ});
    } catch (error) {
      toast.error('Failed to mark all as read', {autoClose: 2000})
      }
  }
  