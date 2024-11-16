import React from 'react';
import { BsCheck2All, BsCheck2} from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";



function ChatMessage({ messageText, isOutgoing, messageStatus, updatedAt }) {
  console.log({messageText, isOutgoing, messageStatus, updatedAt})
  const statusIcons = {
    sent: <BsCheck2  className='text-black text-l'/>, 
    delivered: <BsCheck2All className='text-gray-800 text-xl'/>, 
    read: <BsCheck2All className='text-blue-600'/>,
    sending: <ImSpinner9 className='text-gray-800 text-xl'/>
  };

  const formattedTime = new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


  return (
    <div className={`message ${isOutgoing ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block p-2 rounded-lg ${isOutgoing ? 'bg-blue-500' : 'bg-gray-700'} text-white`}>
        <p>{messageText}</p>
        <span className={`text-xs ${isOutgoing ? 'text-black' : 'text-white/75'} text-gray-400`}>{formattedTime}</span> {/* Display updatedAt */}
        

      </div>
      {isOutgoing && messageStatus && (
        <div className="text-sm flex justify-end text-gray-400 mt-1">
          {statusIcons[messageStatus]}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
