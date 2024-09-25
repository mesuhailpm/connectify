import React from 'react';

function ChatCard({ contactName, avatarUrl, lastMessage, isRead=true ,messageStatus='sent', isOutgoing='true', onClick }) {
  // Icons for message status (you can use icons, emojis, or SVGs)
  const statusIcons = {
    sent: '🕒', // Example icon for sent (e.g., clock)
    delivered: '✔️', // Example icon for delivered (e.g., single checkmark)
    read: '✔️✔️', // Example icon for read (e.g., double checkmarks)
  };

  return (
    <div
      className={`chat-card flex items-center p-4 border-b rounded-md m-1 border-gray-700  cursor-pointer 
        ${isRead ? 'bg-gray-800' : 'bg-gray-700'}`} // Different background for read/unread
      onClick={onClick} // Handle click event to switch the chat panel
    >
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt={`${contactName}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />

      {/* Chat details */}
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{contactName}</h2>
          {/* If the message is unread, show a dot indicator */}
          {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
        </div>

        {/* Last message */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm truncate">
            {lastMessage}
          </p>
          {/* Show status icon only if the message is outgoing */}
          {isOutgoing && messageStatus && (
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
