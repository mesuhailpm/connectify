// src/components/SignedInIndicator.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../actions/authActions";
import { markAllNotificationsAsReadInDb } from "../actions/messageNotificationActions";
import { MdMessage, MdMarkEmailRead } from "react-icons/md";
import { IoMailOpen } from "react-icons/io5";
import { INITILAIZE_SELECT_CHAT, MARK_ONE_MESSAGE_NOTIFICATION_AS_READ } from "../constants/actionTypes";
import { markNotificationAsReadInDb } from "../actions/messageNotificationActions";
import { toast } from "react-toastify";
const SignedInIndicator = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadMessageNotifications, selectedChat } = useSelector(
    (state) => state.chat
  );
  const navigate = useNavigate();
  const location = useLocation()
  const [showNotification, setShowNotification] = useState(false);
  const [actuallyUnreadMessageNotifications, setActuallyUnreadMessageNotifications] = useState([])
  
  useEffect(() => {
    if (unreadMessageNotifications.length) {
      setActuallyUnreadMessageNotifications(unreadMessageNotifications.filter((el)=> {return  !el.isRead}));
    }
  }, [unreadMessageNotifications]);

  const handleMarkAllAsRead = () => { dispatch(markAllNotificationsAsReadInDb(user._id))}  
  const handleMarkAsRead = async (e, notificationId) => {
    e.stopPropagation()
      await dispatch(markNotificationAsReadInDb({userId: user._id, notificationId: notificationId}));          
  }

  const handleSelectChat = async (chat,notificationId) => {

    try {
      // same chat is selected and the user in in chat page - do nothing for marking in DB. instead, update the global state
      if (selectedChat?._id === chat && location.pathname === "/chats") {
        dispatch({type: MARK_ONE_MESSAGE_NOTIFICATION_AS_READ, payload: notificationId})
      
        setShowNotification(false);
        return;
      }
      // same chat is selected but user is not in chat page  - redirect to /chats
      await markNotificationAsReadInDb({userId: user._id, notificationId: notificationId});

      if (selectedChat?._id === chat){

        dispatch({ type: INITILAIZE_SELECT_CHAT, payload: null });
        dispatch({ type: INITILAIZE_SELECT_CHAT, payload: chat });
      
    } else {
        // same chat is not selected and user is in chat page
        dispatch({ type: INITILAIZE_SELECT_CHAT, payload: chat });
      
    }
    //same chat not selected and the user in not in chat page
      
      if (location.pathname !== "/chats" ){
        navigate("/chats")
      }

      setShowNotification(false);

    } catch (error) {
      toast.error('Something went wrong!'+error?.message)
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
  };


  const toggleShowNotification = async () => {

      setShowNotification((prev) => {
        return !prev;
      });
  
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center w-full text-white">
        <p>
          {`You have been missing. `}{" "}
          <span>
            <Link
              to="/login"
              className="text-blue-400 text-center hover:underline"
            >
              Login
            </Link>
          </span>
          {` into your account if you are a member, or `}
          <span>
            <Link
              to="/signup"
              className="text-blue-400 text-center hover:underline"
            >
              Create one
            </Link>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full justify-between space-x-4 p-2 px-0 bg-gradient-to-br from-secondary border-2  to-secondary  via-surface/40 border-secondary text-white rounded-lg">
      <div className="flex gap-4 items-center">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.username}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="font-bold">Welcome, {user?.username || "User"}!</span>
        <Link to="/profile" className="text-blue-300 font-bold hover:underline">
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="text-danger/60 font-bold hover:underline"
        >
          Logout
        </button>
      </div>
      <div>
        <div className="relative flex justify-end py-2">
          <button
            className={` text-white px-4 rounded shadow ${
              showNotification ? "bg-secondary shadow-yellow-500/30" : ""
            }`}
            onClick={toggleShowNotification}
          >
            <MdMessage className={`text-4xl relative hover:text-white/90`} />

            {actuallyUnreadMessageNotifications.length ? (
              <div
                className="rounded-full absolute -top-1 -right-1 flex justify-center items-center bg-fuchsia-500 border-2 p-[2px] min-w-[2rem] w-auto h-auto text-sm"
                style={{ aspectRatio: "1 / 1" }}
              >
                {actuallyUnreadMessageNotifications.length}
              </div>
            ) : null}
          </button>

          {showNotification ? (
            <div style={{ animation: 'fadeIn 0.3s forwards' }} className="absolute top-full mt-2 right-0 w-72 bg-primary border border-gray-300 rounded-lg shadow-lg">
              <div className="absolute top-0 right-4 -mt-2 w-4 h-4 bg-primary border-l border-t border-gray-300 rotate-45"></div>
              {unreadMessageNotifications.length ? (<>
              <ul className="py-2 relative z-10">
                {unreadMessageNotifications.map((el, index) => (
                  <li
                    key={index}
                    className={`relative hover-item px-4 py-2 ${el.isRead ? 'bg-secondary':'bg-blue-500/50'}  border-primary/5 border-2 hover:bg-gray-100 hover:text-black cursor-pointer`}
                    onClick={() => {
                      handleSelectChat(el.chat,el._id);
                    }}
                  > <div className={`icon-container${el.isRead ? '-hidden' : ''} absolute top-0 flex justify-center items-center rounded-r-lg p-1 left-full h-full bg-white`}>
                      <IoMailOpen onClick={(e) => handleMarkAsRead(e, el._id)} className=" text-xl text-green-500 left-full top-1/3" />
                  </div>
                    <div className="flex gap-2 items-center max-h-[50px]">
                      <div className="flex gap-1 justify-center items-center w-1/3 left">
                        <img src={el.avatar} alt="avatar" width={35} className="rounded-full" /> 
                        <b> {el.name.split(" ")[0]} </b>
                      </div>
                      <div className="max-h-full max-w- overflow-auto hide-scrollbar right relative">


                    <p className="whitespace-nowrap">{el.label.slice(0, 25)+ (el.label.length > 24 ? '...':'')}</p>
                      </div>
                    {el.moreMessageCount ? (
                      <span className="font-bold text-xl ml-4">
                        {"+" + el.moreMessageCount}{" "}
                      </span>
                    ) : (
                      ""
                    )}
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={handleMarkAllAsRead} className="flex w-full items-center justify-center hover:bg-white hover:text-black text-white-950">Mark All As Read</button >
              </>
              ): (<div className="flex flex-col items-center justify-center p-4">
              <MdMarkEmailRead  className="text-3xl"/>
                <p className="text-center">No new messages</p>
              </div>)
                }
            </div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default SignedInIndicator;
