const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Get all chat threads for the logged-in user
exports.getChats = async (req, res) => {
  // console.log("will fetch chats");
  try {
    console.log(req.user._id.toString(),' is user ID of request will search for the chats where this is participant')
    const chats = await Chat.find({ participants: req.user._id.toString() })
      .populate({
        path: "participants",
        select: "username avatar lastSeen isOnline",
      })
      .populate({
        path: "lastMessage",
        select: "content sender status readBy",
      })
      .exec();
    // console.log(chats, "chats");

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => !participant._id.equals(req.user._id)
      );

      // Check if lastMessage exists before accessing its properties
      const lastMessage = chat.lastMessage || {};

      const isOutgoing = lastMessage.sender
        ? lastMessage.sender.equals(req.user._id)
        : false;
      const isRead = lastMessage.readBy
        ? lastMessage.readBy.includes(req.user._id)
        : false;
      const messageStatus = isRead ? "read" : isOutgoing ? "sent" : "received";
      // console.log("i will return ", {
      //   _id: chat._id,
      //   recipient: otherParticipant._id,
      //   username: otherParticipant.username,
      //   avatar: otherParticipant.avatar,
      //   lastMessage: chat.lastMessage ? chat.lastMessage.content : "",
      //   isOutgoing,
      //   isRead,
      //   messageStatus,
      //   updatedAt: chat.updatedAt,
      // });
      // console.log({otherParticipant})
      return {
        _id: chat._id,
        username: otherParticipant.username,
        avatar: otherParticipant.avatar,
        recipient: otherParticipant._id,
        lastMessage: chat.lastMessage ? chat.lastMessage.content : "",
        isOutgoing,
        isRead,
        messageStatus,
        updatedAt: chat.updatedAt,
        isOnline: otherParticipant.isOnline,
        lastSeen: otherParticipant.lastSeen,
        dndUsers: chat.dndUsers
      };
    });

    res.status(200).json({ success: true, data: formattedChats });
  } catch (error) {
    console.log("error inside getChats", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching chats", error });
  }
};

// Create a new chat thread or fetch existing chats
exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;
    console.log(req.body, " req body inside createChat");
    console.log({ participants }, "chat participants inside createChat");

    //*********************************** */

    let chat = await Chat.findOne({
      participants: { $all: participants },
    })
      .populate({
        path: "participants",
        select: "username avatar lastSeen isOnline",
      })
      .populate({
        path: "lastMessage",
        select: "content sender status readBy",
      })
      .exec();
    console.log(chat, "is eixsting chat");

    // Check if the chat between the participants already exists
    // let chat = await Chat.findOne({
    //   participants: { $all: participants },
    // });

    if (!chat) {
      console.log(" will create a new chat now!");
      chat = await Chat.create({ participants });
      console.log({ chat }, " is new chat");
      
      const newChat = await chat.populate({
        path:'participants',
        select:'username avatar lastSeen isOnline',
      })
      chat = newChat
      console.log({ chat }, " is new chat with participant populated");

    }

    const formattedChat = (chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => !participant._id.equals(req.user._id)
      );

      // Check if lastMessage exists before accessing its properties
      const lastMessage = chat.lastMessage || {};

      const isOutgoing = lastMessage.sender
        ? lastMessage.sender.equals(req.user._id)
        : false;
      const isRead = lastMessage.readBy
        ? lastMessage.readBy.includes(req.user._id)
        : false;
      const messageStatus = isRead ? "read" : isOutgoing ? "sent" : "received";

      // console.log("i will return ", {
      //   _id: chat._id,
      //   username: otherParticipant.username,
      //   avatar: otherParticipant.avatar,
      //   lastMessage: chat.lastMessage ? chat.lastMessage.content : "",
      //   isOutgoing,
      //   isRead,
      //   messageStatus,
      //   updatedAt: chat.updatedAt,
      // });

      return {
        _id: chat._id,
        username: otherParticipant.username,
        avatar: otherParticipant.avatar,
        lastMessage: chat.lastMessage ? chat.lastMessage.content : "",
        isOutgoing,
        isRead,
        messageStatus,
        updatedAt: chat.updatedAt,
        isOnline: otherParticipant.isOnline,
        lastSeen: otherParticipant.lastSeen,

      };
    };
    const result = formattedChat(chat)
    console.log(result, " these formated chat will be returned");

    //add the other user to the contact list of the current user
    const otherParticipant = chat.participants.find(
      (participant) => !participant._id.equals(req.user._id)
    );

    console.log('will add the other participant to the contact list of the current user', otherParticipant._id)
    await User.findByIdAndUpdate(req.user._id, { $push: { contacts: otherParticipant._id } });
    console.log('will add this user to the contact list of the other user', req.user._id)
    await User.findByIdAndUpdate(otherParticipant._id, { $push: { contacts: req.user._id } });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)      
      .json({ success: false, message: "Error creating chat", error });
  }
};

// Send a message in a specific chat
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { chat } = req.params;

    // Create and save message
    const message = await Message.create({
      chat,
      sender: req.user._id,
      content,
    });

    // Update chat with the last message
    await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error sending message", error });
  }
};

// Get all messages from a specific chat
exports.getChatMessages = async (req, res) => {
  console.log("inside chatController.getChatMessages()");
  console.log(
    req.params,
    " request parameter inside chatController.getChatMessages()"
  );
  const { chatId } = req.params; // Get chatId from URL parameters
  const userId = req.user._id.toString(); // Get the ID of the logged-in user
  // console.log(req.user);
  try {
    // Check if the chat exists and if the user is a participant
    const chat = await Chat.findById(chatId).populate("participants");

    if (!chat) {
      console.log("chat not found!");
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // Check if the user is a participant in the chat
    // console.log(userId, " userId inside getChatMessages");
    if (
      !chat.participants.some(
        (participant) => participant._id.toString() === userId
      )
    ) {
      console.log("access denied as this chat doesn'nt belong to the userId");
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Fetch messages for the chat
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username")
      .exec();
    
    // If no messages, return an empty array
    if (!messages.length) {
      console.log("no messages for this chat");
      return res.status(202).json([]);
    }
    // Format the messages for the frontend

    const formattedMessages = messages.map((message) => ({
      _id: message._id,
      content: message.content,
      sender: message.sender.name,
      isOutgoing: message.sender._id.equals(userId),
      status: message.status,
      updatedAt: message.updatedAt,
      target: message.target, //araray of target user Ids
      readBy: message.readBy,
      //get read status if readBy includes all item in target array
      isReadByTarget: message.readBy.length === message.target.length ? true : false
    }));

    // console.log("formatted messages: ", { formattedMessages });

    res.status(200).json({
      success: true,
      formattedMessages,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages", error });
  }
};

exports.muteChat = async (req, res) => {
  try {
    const {userId, chatId} = req.params; 
    const updateadChat = await Chat.findByIdAndUpdate(chatId, { $addToSet: { dndUsers: userId }}, {new: true})

    if (!updateadChat.dndUsers.some(el => el.toString() === userId)){
      throw Error('Server Failed to Mute Notification!')
    }
    res.status(201).json({message: 'This chat is muted'})
  } catch (error) {
    console.log(error)
    res.status(403).json({message: error?.message || 'something went wrong'})
    
  }
}


exports.unmuteChat = async (req, res) => {
  try {
    const {userId, chatId} = req.params;
    const updateadChat = await Chat.findByIdAndUpdate(chatId, { $pull: { dndUsers: userId }}, {new: true})

    if (updateadChat.dndUsers.some(el => el.toString() === userId)){
      throw Error('Server Failed to unmute Notification!')
    }
    res.status(201).json({message: 'This chat is unmuted'})
  } catch (error) {
    console.log(error)
    res.status(403).json({message: error?.message || 'something went wrong'})
    
  }
}
