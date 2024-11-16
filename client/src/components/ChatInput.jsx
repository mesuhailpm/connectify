import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid4 } from "uuid";
import { GrSend } from "react-icons/gr";
import { toast } from "react-toastify";
import {
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
} from "../constants/actionTypes";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

function ChatInput() {
  const { chats, error, loading, messages, selectedChat, sendingMessage } =
    useSelector((state) => state.chat);
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();
  const chatInputRef = useRef(null);

  useEffect(() => {
    chatInputRef.current.focus();
  }, [isSending]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receiveMessage", (message) => {
      console.log("Received a new message from server:", message);

      const convertMessage = () => {
        try {
          return {
            chat: selectedChat._id,
            content: newMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            readBy: [],
            sender: user._id.toString(),
            status: "sent",
            _id: message._id,
          };
        } catch (error) {
          console.log("unable to convert message to state", error);
          return {};
        }
      };
      const messageForState = convertMessage();
      // You can update the message state here, e.g., push to messages
      dispatch({ type: SEND_MESSAGE_SUCCESS, payload: messageForState });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    // Listen for messages failure from the server
    socket.on("sendMessageFailure", (messageId) => {
      console.log("message is not sent:", messageId);

      // You can update the message state here, e.g., push to messages
      dispatch({ type: SEND_MESSAGE_FAILURE, payload: messageId });
    });

    return () => {
      socket.off("sendMessageFailure");
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      return;
    }

    setIsSending(true);

    try {
      const newMessagaeObj = {
        _id: uuid4(),
        chatId: selectedChat._id,
        messageText: newMessage,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
        chat: selectedChat._id,
        content: newMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        sender: user._id.toString(),
        status: "sending",
      };

      // Emit the new message to the server
      console.log("will emit", {
        _id: uuid4(),
        chatId: selectedChat._id,
        messageText: newMessage,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
      });
      socket.emit("sendMessage", {
        _id: uuid4(),
        chatId: selectedChat._id,
        messageText: newMessage,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
      });

      const messageForState = () => {
        const {
          createdAt,
          updatedAt,
          content,
          chatId,
          chat,
          readBy,
          sender,
          _id,
        } = newMessagaeObj;
        try {
          return {
            _id,
            content: newMessage,
            createdAt,
            updatedAt,
            sender,
            status: "sending",
            isOutgoing: true,
          };
        } catch (error) {
          console.log("unable to convert message to state", error);
        }
      };

      dispatch({ type: SEND_MESSAGE_REQUEST, payload: messageForState() });

      // Optionally handle sending state/loading
      console.log("Sending message:", newMessage);

      // Listen for the response from the server
      socket.on("sendMessageSuccess", (message) => {
        console.log("New message sent successfully:", message);
        const {
          createdAt,
          updatedAt,
          content,
          chatId,
          chat,
          readBy,
          sender,
          _id,
        } = message;

        const messageForState = () => {
          try {
            return {
              chat,
              content,
              createdAt,
              updatedAt,
              readBy,
              sender,
              status: "sent",
              _id,
              isOutgoing: true,
            };
          } catch (error) {
            console.log("unable to convert message to state", error);
          }
        };

        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: messageForState() });
        setNewMessage(""); // Clear the input after sending
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message | "sending failed", { autoClose: 500 });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input flex items-center h-16 p-2 bg-gray-800 border-t border-gray-600">
      <input
        ref={chatInputRef}
        autoFocus
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-grow p-2 rounded-md bg-gray-700 text-white"
        disabled={isSending} // Disable input while sending
      />
      <button
        onClick={handleSendMessage}
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
