import API from "../api";
import { FETCH_MESSAGE_NOTIFICATION_FROM_DATABASE, MARK_ALL_MESSAGE_NOTIFICATIONS_AS_READ } from "../constants/actionTypes";

export const fetchUnreadMessageNotifications = (userId, isOnChatsPage) => async (dispatch)=> {
    try{
        
        const { data } =  await API.get('/api/messageNotifications/'+userId);
        console.log(data);
        
        const unreadMessageNotifications = data.map((el) => ({...el, avatar: el.sender.avatar, name: el.sender.username, label: el.content}));
        dispatch( {type: FETCH_MESSAGE_NOTIFICATION_FROM_DATABASE, payload: unreadMessageNotifications, isOnChatsPage});
        return unreadMessageNotifications;
    } catch (error) {
        throw error;
    }
}
export const markNotificationAsReadInDb = async ({userId, notificationId}) => {
    try { console.log(userId,notificationId)
      const {data} = await API.put(
        "/api/messageNotifications/markOneAsRead/"+userId+"/"+notificationId
      );
    } catch (error) {
      throw error;    
    }
    
  }
  
  export const markNotificationForChatAsReadInDb = async ({userId, chatId}) => {
    try {
      const {data} = await API.put(
        "/api/messageNotifications/markOneAsReadByChatId/"+userId+"/"+chatId
      );
      console.log(data)
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
      console.log('error inside markAllNotificationsAsReadInDb ',error)
      throw error;    
    }
  }
  