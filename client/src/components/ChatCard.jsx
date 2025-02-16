import React from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { useSelector } from "react-redux";

function ChatCard({
  id,
  username,
  avatar,
  lastMessage,
  isRead = true,
  messageStatus = "read",
  isOutgoing = "true",
  onClick,
}) {
  const { selectedChat } = useSelector((state) => state.chat);
  // Icons for message status (you can use icons, emojis, or SVGs)
  const statusIcons = {
    sent: <BsCheck2 className="text-lime-100 text-xl font-bold" />,
    delivered: <BsCheck2All className="text-gray-800 text-xl" />,
    read: <BsCheck2All className="text-xl text-blue-400" />
  };

  return (
    <div
      className={`chat-card w-full flex items-center p-4 border-b overflow-x-hidden text-wrap rounded-md m-1 border-gray-700  cursor-pointer 
        bg-gradient-to-r from-secondary to-primary/50  ${
          selectedChat?._id.toString() === id.toString()
            ? "border-yellow-400 font-semibold"
            : ""
        }`} // Different background for read/unread
      onClick={onClick} // Handle click event to switch the chat panel
    >
      {/* Avatar */}
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />

      {/* Chat details */}
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{username}</h2>
          {/* If the message is unread, show a dot indicator */}
          {!isRead && (
            <span className="w-3 h-3  bg-blue-500 rounded-full"></span>
          )}
        </div>

        {/* Last message */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm truncate">{lastMessage}</p>
          {/* Show status icon only if the message is outgoing */}
          {isOutgoing && (
            <span className="ml-2 text-gray-400 text-sm">
              {statusIcons[messageStatus]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
