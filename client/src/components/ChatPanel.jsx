import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages } from "../actions/chatActions";
import { FaCircle } from "react-icons/fa";

const ChatPanel = () => {
  const chatState = useSelector((state) => state.chat);
  
  const chatContainerRef = useRef(null)
  const { getChatMessagesError, loading, messages, selectedChat } = chatState;
  console.log(chatState, " messages from chatState");
  const dispatch = useDispatch();
  useEffect(()=>{
    if(chatContainerRef ){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

  },[messages])

  useEffect(() => {
    const fetchMessagesByChat = (chatId) => dispatch(fetchChatMessages(chatId));
    if (selectedChat) {
      fetchMessagesByChat(selectedChat._id);
      console.log("useEffect to fetch chats by message");
    }
  }, [selectedChat?._id]);

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.updatedAt).toLocaleDateString(); // Format date
      if (!acc[date]) {
        acc[date] = []; // Create a new array for the date
      }
      acc[date].push(message); // Push the message into the correct date group
      return acc;
    }, {});
  };

  const sortMessagesByDate = (messages) => {
    if (!messages?.length) return []; // Return an empty array if no messages
    return messages.sort(
      (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
    );
  };

  const sortedMessages = sortMessagesByDate(messages);
  const groupedMessages = groupMessagesByDate(sortedMessages);
  console.log(groupedMessages);
  console.log(Object.keys(groupedMessages).length);

  return (
    <div className="chat-panel flex flex-col min-h-full flex-grow"  style={{ flexBasis: "60%" }}>
      <div
        ref={chatContainerRef}
        className="chat-message-container grow bg-chat_background  overflow-y-auto hide-scrollbar border-black p-4 "
        
      >
        {Object.keys(groupedMessages).length ? (
          Object.keys(groupedMessages)
            .sort((a, b) => a - b)
            .map((date) => (
              <div key={date} className="date-group flex flex-col gap-1">
                <h3 className="date-header text-center text-gray-200 text-lg m-3">
                  {date}
                </h3>{" "}
                {/* Date header */}
                {groupedMessages[date].map((msg) => (
                  <ChatMessage
                    key={msg._id}
                    _id ={msg._id}
                    content={msg.content}
                    isOutgoing={msg.isOutgoing}
                    messageStatus={msg.status}
                    updatedAt={msg.updatedAt}
                  />
                ))}
              </div>
            ))
        ) : loading ? (
          <div className="absolute text-lime-600 flex items-center justify-center top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <FaCircle className="text-orange-500 animate-ping" />
          </div>
        ) : getChatMessagesError ? (
          <>{getChatMessagesError}</>
        ) : selectedChat ? (
          <div className="text-center flex items-center h-full justify-center font-bold">
            No Messages{" "}
          </div>
        ) : (
          <div className="text-center flex items-center h-full justify-center font-bold">
            No Chat Selected
          </div>
        )}
      </div>
      {selectedChat ? <ChatInput /> : null}
    </div>
  );
};

export default ChatPanel;
