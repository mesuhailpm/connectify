import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatMessages } from "../actions/chatActions";
import { markNotificationForChatAsReadInDb } from "../actions/messageNotificationActions";
import { FaCircle } from "react-icons/fa";
import { MESSAGE_READ_BY_SELF  } from "../constants/actionTypes";

import socket from "../sockets/socket";

const ChatPanel = () => {
  const chatState = useSelector((state) => state.chat);
  const {user} = useSelector((state) => state.auth)
  
  const chatContainerRef = useRef(null)
  const { getChatMessagesError, loading, messages, selectedChat } = chatState;
  const dispatch = useDispatch();

  const seenMessages = useRef(new Set());
  console.log(seenMessages.current)

  //useEffect to mark messages as read/seen

  useEffect(() => {
    if (!socket || !selectedChat?._id || !messages || !user) return; // Guard clause for missing dependencies
    const alreadySeen = messages
    .filter((message)=> !message.isOutgoing)
    .filter((message)=> message.readBy.some( readerId => readerId === user._id ))
    .map( message => message._id);

    seenMessages.current = new Set(alreadySeen)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-id');
            if (messageId && !seenMessages.current.has(messageId)) { // Check if the message is not already seen
              seenMessages.current.add(messageId); // Mark the message as seen
              socket.emit('messageSeenByMe', { messageId, chatId: selectedChat._id, readerId: user._id });
              await markNotificationForChatAsReadInDb({userId: user._id, chatId: selectedChat._id})
              dispatch({ type: MESSAGE_READ_BY_SELF , payload: { messageId, chatId: selectedChat._id, readerId: user._id }  });
            }
          }
        });
      },
      { threshold: 1.0 }
    );
  
    const messageElements = document.querySelectorAll('.chat-message-incoming');
    messageElements.forEach((el) => observer.observe(el));

    // alert("3")
  
    return () => {
      observer.disconnect(); // Ensures all observed elements are unobserved
    };
  }, [selectedChat, dispatch, user._id, messages]);
  

  useEffect(()=>{
    if(chatContainerRef ){
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

  },[messages])

  useEffect(() => {
    const fetchMessagesByChat = (chatId) => dispatch(fetchChatMessages(chatId));
    if (selectedChat) {
      fetchMessagesByChat(selectedChat._id);
      console.log("useEffect to fetch messsages for chats");
    }
  }, [selectedChat?._id, selectedChat, dispatch]);

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
                    isReadByTarget={msg.isReadByTarget}
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
