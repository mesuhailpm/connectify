import React from "react";
import { BsCheck2All, BsCheck2 } from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";

function ChatMessage({ messageText, isOutgoing, messageStatus, updatedAt }) {
  console.log({ messageText, isOutgoing, messageStatus, updatedAt });
  const statusIcons = {
    sent: <BsCheck2 className="text-lime-100 text-xl font-bold" />,
    delivered: <BsCheck2All className="text-gray-800 text-xl" />,
    read: <BsCheck2All className="text-blue-600" />,
    sending: <ImSpinner9 className="text-gray-800 text-xl" />,
  };

  const formattedTime = new Date(updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`message ${
        isOutgoing
          ? "text-rightd place-self-end"
          : "text-leftd place-self-start"
      }  `}
    >
      <div
        className={`flex w-fit justify-between p-2 rounded-lg ${
          isOutgoing ? "bg-teal-900" : "bg-cyan-800"
        } text-white`}
      >
        <div className="left flex flex-col">
          <p className="">{messageText}</p>
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
          <div className="text-sm flex items-end text-gray-400 ml-2">
            {statusIcons[messageStatus]}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
