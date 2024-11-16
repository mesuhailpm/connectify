import React from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaUserSlash,
  FaTrash,
  FaFileDownload,
  FaFlag,
  FaUsers,
  FaPaperclip,
  FaImage,
} from "react-icons/fa";

import ChatMenuButton from "../components/ChatMenuButton";
import { useSelector } from "react-redux";

const ChatMenu = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const handleMuteNotifications = () => {
    console.log("Notifications muted");
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

  if (!selectedChat)
    return (
      <div className="chat-menu text-center w-3/12 flex flex-grow items-center h-full justify-center p-1 border-2 border-black font-bold">
        No Chat Selected
      </div>
    );

  return (
    <div className="chat-menu border-2 overflow-y-auto hide-scrollbar flex w-3/12 flex-col border-black h-full flex-grow p-1 gap-1">
      <h2 className="text-lg text-center font-bold mb-2">Chat Options</h2>
      <h2 className="text-teal-700 text-lg text-center font-bold mb-2">
        {selectedChat.username}
      </h2>
      <div className="profile-info text-center mb-4">
        <img
          src={selectedChat.avatar}
          alt="Profile"
          className="w-16 h-16 rounded-full mx-auto mb-2"
        />
        <h3 className="text-xl">{selectedChat.name}</h3>
        <p className="text-green-">
          Status: <span className="font-semibold text-lime-500">Online</span>
        </p>
      </div>
      <input
        type="text"
        placeholder="Search messages..."
        className="p-2 mb-4 w-full rounded-md bg-gray-700"
      />
      <ChatMenuButton
        label="Mute Notifications"
        icon={<FaBell />}
        style="bg-gray-700"
        onClick={handleMuteNotifications}
      />
      <ChatMenuButton
        label="Block User"
        icon={<FaUserSlash />}
        style="bg-gray-700"
        onClick={handleBlockUser}
      />
      <ChatMenuButton
        label="Clear Chat History"
        icon={<FaTrash />}
        style="bg-gray-700"
        onClick={handleClearChatHistory}
      />
      <ChatMenuButton
        label="Export Chat"
        icon={<FaFileDownload />}
        style="bg-gray-700"
        onClick={handleExportChat}
      />
      <ChatMenuButton
        label="Report User"
        icon={<FaFlag />}
        style="bg-gray-700"
        onClick={handleReportUser}
      />
      <ChatMenuButton
        label="Create Group Chat"
        icon={<FaUsers />}
        style="bg-gray-700"
        onClick={handleCreateGroupChat}
      />
      <ChatMenuButton
        label="Pin Important Messages"
        icon={<FaPaperclip />}
        style="bg-gray-700"
        onClick={handlePinMessages}
      />
      <ChatMenuButton
        label="Share File"
        icon={<FaImage />}
        style="bg-gray-700"
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
