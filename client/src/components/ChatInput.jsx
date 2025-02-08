import React, { useEffect, useRef, useState } from "react";
import mongoose, { Types } from "mongoose";
import { GrSend } from "react-icons/gr";
import { toast } from "react-toastify";
import outgoingTone from  '../assets/media/ping.mp3'
import {
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
  RECEIVE_MESSAGE,
  MESSAGE_READ_CONFIRMATION ,
} from "../constants/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import socket from "../sockets/socket";
function ChatInput() {
  const { chats, error, loading, messages, selectedChat, sendingMessage } =
    useSelector((state) => state.chat);
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const [randomId, setRandomId] = useState(new Types.ObjectId().toString());

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();
  const chatInputRef = useRef(null);

  useEffect(() => {
    setRandomId(new Types.ObjectId().toString());
    chatInputRef.current.focus();
  }, [isSending]);

  // 7
  useEffect(() => {
    // Listen for messages failure from the server
    socket.on("sendMessageFailure", (messageId) => {
      console.log("message is not sent:", messageId);

      // You can update the message state here, e.g., push to messages
      dispatch({ type: SEND_MESSAGE_FAILURE, payload: {message: messageId, error: 'Message not sent'} });
    });

    return () => {
      socket.off("sendMessageFailure");
    };
  }, []);

  useEffect(()=>{
    //Listen for message being read by the recipient

    socket.on("messageSeenByTarget", async(messageId, readerId)=>{
      await dispatch({type: MESSAGE_READ_CONFIRMATION , payload: {messageId, readerId} })
    })
  },[messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      return;
    }

    setIsSending(true);

    try {
      const newMessagaeObj = {
        _id: randomId,
        chatId: selectedChat._id,
        content: newMessage,
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
      console.log(mongoose.Types.ObjectId.isValid(randomId), ' from valid'); // Check if the ID is valid
      console.log(randomId)
      console.log("will emit", {
        _id: randomId,
        chat: selectedChat._id,
        content: newMessage,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
        readBy:[],
        target: selectedChat.recipient
      });
      await socket.emit("sendMessage", {
        _id: randomId,
        chat: selectedChat._id,
        content: newMessage,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
        target: selectedChat.recipient
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
          target
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
            readBy,
            target
          };
        } catch (error) {
          console.log("unable to convert message to state", error);
        }
      };

      await dispatch({
        type: SEND_MESSAGE_REQUEST,
        payload: messageForState(),
      });

      // Optionally handle sending state/loading
      console.log("Sending message:", newMessage);
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.", {
          autoClose: 500,
        });
        setNewMessage("");
        return;
      }
      try {
        // Listen for the response from the server
        socket.once("sendMessageSuccess", async (message) => {
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

          await dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: messageForState(),
          });
          const audio = new Audio(outgoingTone);
          audio.play();
          setNewMessage(""); // Clear the input after sending
        });
      } catch (error) {
        console.log(error);
        await dispatch({
          type: SEND_MESSAGE_FAILURE,
          payload: { message: randomId, error: error },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message | "sending failed", { autoClose: 500 });
      await dispatch({
        type: SEND_MESSAGE_FAILURE,
        payload: { message: randomId, error: error },
      });
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
    <div className="chat-input flex items-center h-16 p-2 bg-black/80 border-t border-gray-600">
      <input
        ref={chatInputRef}
        autoFocus
        type="text"
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-grow p-2 rounded-md bg-primary text-white placeholder:text-white/50"
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
