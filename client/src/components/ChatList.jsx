import React, { useEffect } from "react";
import ChatCard from "./ChatCard";
import { useDispatch, useSelector } from "react-redux";
import { SELECT_CHAT } from "../constants/actionTypes";
import SearchChats from "./SearchChats";

const ChatList = () => {


  const {  selectedChat } = useSelector(
    (state) => state.chat
  );

  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);


  const { chats, loading } = chatState;
  console.log(chats);

  useEffect(() => {
    if (chats.length && !selectedChat) {
      const latest = chats.sort((a, b) => {
        return a.updatedAt - b.updatedAt;
      })[0];
      console.log("this useEffect is selecting ", latest);
      dispatch({ type: SELECT_CHAT, payload: latest });
    }
  }, [loading, chats, dispatch, selectedChat]);

  const onClick = (chat) => {
    //dispatch SELECT_Chat action with a check if chat is not selected already
    if (chat._id !== selectedChat?._id) {
      // alert(chatId);
      console.log(chat, " chat to be selected");
      dispatch({ type: SELECT_CHAT, payload: chat });
    }
  };
  console.log(chatState.chats);
  return (
    <div className="cht-list flex w-3/12 overflow-y-auto flex-col justify-start border-2 bg-black border-black hide-scrollbar overflow-x-hidden">
      <SearchChats
        isNew={!chatState.chats.length && !chatState.error}
      />
      {chatState.chatsLoading && (
        <p className="text-center text-blue-500 text-xl">
          Fetching your chats...
        </p>
      )}
      {chatState.chats.map((chat) => (
        <ChatCard
          key={chat._id}
          id={chat._id}
          messageStatus={chat?.lastMessageStatus}
          avatar={chat.avatar}
          username={chat.username}
          isOutgoing={chat.isOutgoing}
          lastMessage={chat.lastMessage.substring(0, 20)}
          isRead={ (!chat.isOutgoing && chat.lastMessageStatus === 'read') ? true : chat.isOutgoing ? true : false }
          onClick={() => onClick(chat)}
        />
      ))}
    </div>
  );
};

export default ChatList;
