import React from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatPanel = () => {
  const messages = [
    {
      id: 1,
      messageText: "Hey!",
      isOutgoing: false,
      timestamp: "2024-09-29T14:30:00Z",
    },
    {
      id: 2,
      messageText: "How are you?",
      isOutgoing: true,
      messageStatus: "sent",
      timestamp: "2024-09-24T14:31:00Z",
    },
    {
      id: 3,
      messageText: "I am fine, thanks!",
      isOutgoing: false,
      timestamp: "2024-09-24T14:32:00Z",
    },
    {
      id: 4,
      messageText: "Glad to hear that!",
      isOutgoing: true,
      messageStatus: "read",
      timestamp: "2024-09-24T14:33:00Z",
    },
    {
      id: 5,
      messageText: "Glad to hear that!",
      isOutgoing: true,
      messageStatus: "read",
      timestamp: "2024-09-25T14:33:00Z",
    },
  ];

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.timestamp).toLocaleDateString(); // Format date
      if (!acc[date]) {
        acc[date] = []; // Create a new array for the date
      }
      acc[date].push(message); // Push the message into the correct date group
      return acc;
    }, {});
  };

  const sortMessagesByDate = (messages) => {
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };
  const sortedMessages = sortMessagesByDate(messages);


  const groupedMessages = groupMessagesByDate(sortedMessages);
  console.log(groupedMessages)

    const handleSendMessage = async (message) => {
      // Simulate message sending delay (e.g., sending message to server)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Message sent:', message);
          resolve();
        }, 2000); // Simulate 2-second delay for sending
      });
    }

  return (
    <div className="border-2 border-black p-4 relative" style={{ flexBasis: "60%" }}>


      {Object.keys(groupedMessages).sort((a, b)=> a - b ).map((date) => (
        <div key={date} className="date-group flex flex-col gap-1">
          <h3 className="date-header text-center text-gray-500 text-lg m-3">{date}</h3>{" "}
          {/* Date header */}
          {groupedMessages[date].map((msg) => (
            <ChatMessage
              key={msg.id}
              messageText={msg.messageText}
              isOutgoing={msg.isOutgoing}
              messageStatus={msg.messageStatus}
              timestamp={msg.timestamp} 
            />
          ))}

        </div>
      ))}
      <ChatInput onSend={handleSendMessage} />



      
    </div>
  );
};

export default ChatPanel;

