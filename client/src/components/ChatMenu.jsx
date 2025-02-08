import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getTimeDifference from "../utils/getTimeDifference.ts";
import {
  FaBell,
  FaUserSlash,
  FaTrash,
  FaFileDownload,
  FaFlag,
  FaUsers,
  FaPaperclip,
  FaImage,
  FaBellSlash
} from "react-icons/fa";

import ChatMenuButton from "../components/ChatMenuButton";
import { useDispatch, useSelector } from "react-redux";
import socket from "../sockets/socket.js";
import { muteChat, unmuteChat } from "../actions/chatActions.js";
import { toast } from "react-toastify";

const ChatMenu = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [isChatOnMute, serIsChatOnMute] = useState(selectedChat.dndUsers.some((usr)=>usr === user._id))
  const [muteLoading, setMuteLoading] = useState(false)

  useEffect(()=>{
    if(user)serIsChatOnMute(selectedChat.dndUsers.some((usr)=>usr === user._id))

  },[selectedChat.dndUsers, user._id])
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = async (userId) => {
      if (userId === selectedChat.recipient) {
        dispatch({
          type: "UPDATE_CHAT_PARTNER",
          payload: { isOnline: true },
        });
      }
    };

    const handleOffline = async (userId) => {
      if (userId === selectedChat.recipient) {
        dispatch({
          type: "UPDATE_CHAT_PARTNER",
          payload: { isOnline: false, lastSeen: new Date().toLocaleString() },
        });
      }
    };

    // Listen for chat partner status changes
    socket.on("user-online", handleOnline);
    socket.on("user-offline", handleOffline);

    // Cleanup function to remove event listeners
    return () => {
      socket.off("user-online", handleOnline);
      socket.off("user-offline", handleOffline);
    };
  }, [dispatch, selectedChat.recipient]);

  // const chatPartner = selectedChat.participants
  const handleMuteNotifications = async () => {
    try {
      setMuteLoading(true)
      
      if(isChatOnMute){
        await dispatch(unmuteChat({userId: user._id, chatId: selectedChat._id}))
        
      }else{
        await dispatch(muteChat({userId: user._id, chatId: selectedChat._id}))
      }
    } catch (error) {
     toast.error('Action failed') 
    }finally{
      setMuteLoading(false)
    }
  };

  const handleBlockUser = () => {
    console.log("User blocked");
  };

  const handleClearChatHistory = () => {
    console.log("Chat history cleared");
  };

  const handleExportChat = () => {
    console.log("Chat exported");
  };

  const handleReportUser = () => {
    console.log("User reported");
  };

  const handleCreateGroupChat = () => {
    console.log("Group chat created");
  };

  const handlePinMessages = () => {
    console.log("Messages pinned");
  };

  const handleShareFile = () => {
    console.log("File shared");
  };

  return (
    <div className="chat-menu bg-black overflow-y-auto hide-scrollbar flex w-3/12 flex-col h-full flex-grow p-1 gap-1">
      <h2 className="text-lg text-center font-bold mb-2">Chat Options</h2>
      <h2 className="text-teal-300 text-lg text-center font-bold mb-2">
        {selectedChat.username}
      </h2>
      <div className="profile-info text-center mb-4">
        <img
          src={selectedChat.avatar}
          alt="Profile"
          className="w-16 h-16 rounded-full mx-auto mb-2"
        />
        <h3 className="text-xl">{selectedChat.name}</h3>
        <p className="text-green-100">
          {selectedChat.isOnline ? (
            <span className="font-semibold text-lime-500">Online</span>
          ) : (
            <span className="font-semibold text-blue-500">{`Last seen: ${getTimeDifference(
              new Date(selectedChat.lastSeen).toLocaleString()
            )}`}</span>
          )}
        </p>
      </div>
      <input
        type="text"
        placeholder="Search messages..."
        className="p-2 mb-4 w-full rounded-md bg-gray-300 placeholder:text-gray-500"
      />
      <ChatMenuButton
        label={muteLoading ? "Loading..." : `${isChatOnMute ? "Unmute" : "Mute Notifications"}`}
        icon={isChatOnMute ? <FaBell /> : <FaBellSlash className="text-2xl" />}
        style="bg-primary"
        onClick={handleMuteNotifications}
        disabled={muteLoading}
      />
      <ChatMenuButton
        label="Block User"
        icon={<FaUserSlash />}
        style="bg-primary"
        onClick={handleBlockUser}
      />
      <ChatMenuButton
        label="Clear Chat History"
        icon={<FaTrash />}
        style="bg-primary"
        onClick={handleClearChatHistory}
      />
      <ChatMenuButton
        label="Export Chat"
        icon={<FaFileDownload />}
        style="bg-primary"
        onClick={handleExportChat}
      />
      <ChatMenuButton
        label="Report User"
        icon={<FaFlag />}
        style="bg-primary"
        onClick={handleReportUser}
      />
      <ChatMenuButton
        label="Create Group Chat"
        icon={<FaUsers />}
        style="bg-primary"
        onClick={handleCreateGroupChat}
      />
      <ChatMenuButton
        label="Pin Important Messages"
        icon={<FaPaperclip />}
        style="bg-primary"
        onClick={handlePinMessages}
      />
      <ChatMenuButton
        label="Share File"
        icon={<FaImage />}
        style="bg-primary"
        onClick={handleShareFile}
      />
      <h3 className="text-lg font-semibold mt-4">Recent Media</h3>
      <div className="recent-media mt-2">
        {/* Display recent media items here */}
      </div>
      <Link to="/help" className="block mt-4 text-blue-400 hover:underline">
        Help & Support
      </Link>
    </div>
  );
};

export default ChatMenu;
