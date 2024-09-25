import React from "react";
import ChatCard from "./ChatCard";

const ChatList = () => {
  const chats = [
    {
      id: 1,
      contactName: "John Doe",
      avatarUrl:
        "https://gravatar.com/avatar/eb39b2bea731f88396134a0241bc19e8?s=400&d=robohash&r=x",

      lastMessage: "Hey, how are you?",
      isRead: false,
      isOutgoing: true, // Last message was sent by the user
      messageStatus: "delivered",
    },
    {
      id: 2,
      contactName: "Jane Smith",
      avatarUrl:
        "https://gravatar.com/avatar/eb39b2bea731f88396134a0241bc19e8?s=400&d=identicon&r=x",
      lastMessage: "See you later!",
      isRead: true,
      isOutgoing: false, // Last message was received from the other person
    },
  ];

  return (
    <div className="border-2 border-black h-full flex-grow">
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          avatarUrl={chat.avatarUrl}
          contactName={chat.contactName}
          isOutgoing={chat.isOutgoing}
          lastMessage={chat.lastMessage}
          isRead={false}
          onClick={() => alert("clicked")}
          messageStatus={chat.messageStatus}
          isO
        />
      ))}
      <ChatCard
        contactName={"name"}
        avatarUrl={
          "https://gravatar.com/avatar/eb39b2bea731f88396134a0241bc19e8?s=400&d=robohash&r=x"
        }
        lastMessage="last Message"
        isRead={false}
        onClick={() => alert("clicked")}
        messageStatus="delivered"
        isOutgoing={true}
      />
    </div>
  );
};

export default ChatList;
