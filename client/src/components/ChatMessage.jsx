import React, { useState } from "react";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { MdSmsFailed as BsStopBtn } from "react-icons/md";
import { ImSpinner9 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS, RE_SEND_MESSAGE_REQUEST } from "../constants/actionTypes";
import socket from "../sockets/socket";


function ChatMessage({_id, content, isOutgoing, messageStatus, updatedAt, isReadByTarget }) {
  // console.log({_id, content, isOutgoing, messageStatus, updatedAt,isReadByTarget,0:0 })

  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch();

  const { chats, error, loading, messages, selectedChat, sendingMessage } =
  useSelector((state) => state.chat);
const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  const statusIcons = {
    sent: <BsCheck2 className="text-lime-100 text-xl font-bold" />,
    delivered: <BsCheck2All className="text-gray-800 text-xl" />,
    read: <BsCheck2All className="text-xl text-blue-400" />,
    sending: <ImSpinner9 className="text-gray-800 animate-spin text-xl" />,
    notSent: <BsStopBtn className="text-lime anima text-xl font-bold" />,
  };

  const handleReSendMessage = async () => {
    // if (!newMessage.trim() || !selectedChat) {
    //   return;
    // }


    setIsSending(true);

    try {
      const newMessagaeObj = {
        _id,
        content,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
        chat: selectedChat._id,
        createdAt: updatedAt,
        updatedAt,
        readBy: [],
        sender: user._id.toString(),
        status: "sending",
        target: selectedChat.recipient
      };

      // Emit the new message to the server
      console.log("will emit", {
        _id,
        chat: selectedChat._id,
        content:content,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
      });
      await socket.emit("sendMessage", {
        _id,
        chat: selectedChat._id,
        content,
        userId: localStorage.getItem("userId"), // Ensure you pass the correct user ID
        status: "sending",
        target: selectedChat.recipient
      });

      const messageForState = () => {
        const {
          createdAt,
          updatedAt,
          content,
          chat,
          readBy,
          sender,
          _id,
          target
        } = newMessagaeObj;
        try {
          return {
            _id,
            chat,
            content,
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
        type: RE_SEND_MESSAGE_REQUEST,
        payload: messageForState(),
      });

      // Optionally handle sending state/loading
      console.log("Sending message:", content);
      if (!navigator.onLine) {
        toast.error("No internet connection. Please check your network.", {
          autoClose: 500,
        });

        // setTimeout(async()=>{

        //   await dispatch({
        //     type: SEND_MESSAGE_FAILURE,
        //     payload: { message: _id, error: "No internet connection" },
        //   });
        // },200)
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
            chat,
            readBy,
            sender,
            _id,
            status
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
                status,
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
        });
      } catch (error) {
        console.log(error);
        await dispatch({
          type: SEND_MESSAGE_FAILURE,
          payload: { message: _id, error: error },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message | "sending failed", { autoClose: 500 });
      await dispatch({
        type: SEND_MESSAGE_FAILURE,
        payload: { message: _id, error: error },
      });
    } finally {
      setIsSending(false);
    }
  };
  const formattedTime = new Date(updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      data-id={_id}
      className={`chat-message${isOutgoing ?'-outgoing':'-incoming'} message  flex flex-col ${
        isOutgoing ? "place-self-end" : "place-self-start"
      }  `}
    >
      <div
        className={`flex w-fit justify-between p-2 rounded-lg ${
          isOutgoing ? "bg-teal-900 place-self-end" : "bg-cyan-800"
        } text-white`}
      >
        <div className="left flex flex-col">
          <p className="">{content}</p>
          {/* Display updatedAt */}
          <span
            className={`text-xs text-right ${
              isOutgoing ? "text-yellow-200" : "text-fuchsia-300"
            }`}
          >
            {formattedTime}
          </span>
        </div>
        {isOutgoing && messageStatus && (
          <div className="right text-sm flex items-end text-gray-400 ml-2">
            {isReadByTarget ? statusIcons['read']: statusIcons[messageStatus]}
          </div>
        )}
      </div>
      {isOutgoing && messageStatus === "notSent" && (
        <div onClick={handleReSendMessage} className="text-sm flex items-end w-fit text-danger/50 font-semibold cursor-pointer rounded-md px-1 ml-2">
          Retry
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
