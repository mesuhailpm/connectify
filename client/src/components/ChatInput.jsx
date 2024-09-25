import React, { useState } from "react";
import { GrSend } from "react-icons/gr";

function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (message.trim()) {
      setIsSending(true);
      await onSend(message); // Wait for the message to be sent
      setMessage(""); // Clear the input after sending
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input flex items-center p-2 bg-gray-800 border-t border-gray-600 absolute bottom-0 left-0 w-full">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-grow p-2 rounded-md bg-gray-700 text-white"
        disabled={isSending} // Disable input while sending
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        disabled={isSending} // Disable button while sending
      >
        {isSending ? (
          <div className="loader border-t-transparent border-4 border-white rounded-full w-5 h-5 animate-spin"></div>
        ) : (
          <GrSend className="" />
        )}
      </button>
    </div>
  );
}

export default ChatInput;
