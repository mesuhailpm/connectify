const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");


const formatChat = (chat, userId) => {
  const otherParticipant = chat.participants.find(
    (participant) => !participant._id.equals(userId)
  );
  const isBlocked = otherParticipant.blockedUsers.includes(userId);

  // Check if lastMessage exists before accessing its properties
  const lastMessage = isBlocked ? {} : chat.lastMessage || {};

  const isOutgoing = lastMessage?.sender
    ? lastMessage.sender.equals(userId)
    : false;

    const getLastMessage = () => {
      if (!chat.lastMessage || isBlocked) return '';
      return chat.lastMessage.status === 'blocked' ? '' : chat.lastMessage.content;
    };

  const getLastMessageStatus = () => {
    if (!chat.lastMessage || isBlocked) return 'read';
    return chat.lastMessage.status === 'blocked' ? 'read' : chat.lastMessage.status;
  } // If the message isn't blocked, use its actual status; 
  // otherwise default to 'read' because pending statuses don't apply when blocked.
  

  console.log(getLastMessageStatus(), 'last message from formatChat')

  const getRandomLastSeen = () => {
    const now = new Date();
    const randomOffset = Math.floor(Math.random() * 604800000); // Up to 7 days ago
    return new Date(now - randomOffset);
  };

    return {
    _id: chat._id,
    username: otherParticipant.username,
    avatar: otherParticipant.avatar,
    recipient: otherParticipant._id,
    lastMessage: getLastMessage(),
    lastMessageStatus: getLastMessageStatus(),
    isOutgoing,
    updatedAt: chat.updatedAt,
    isOnline: !isBlocked && otherParticipant.isOnline,
    lastSeen: !isBlocked ? otherParticipant.lastSeen : getRandomLastSeen(),
    dndUsers: chat.dndUsers
  };
}



// Get all chat threads for the logged-in user
exports.getChats = async (req, res) => {
  // console.log("will fetch chats");
  try {
    console.log(req.user._id.toString(),' is user ID of request will search for the chats where this is participant')
    const chats = await Chat.find({ participants: req.user._id.toString() })
      .populate({
        path: "participants",
        select: "username avatar lastSeen isOnline blockedUsers",
      })
      .populate({
        path: "lastMessage",
        select: "content sender status readBy",
      })
      .exec();

    const formattedChats = () => {
      return chats.map((chat)=>formatChat(chat, req.user._id)) 
    }

    res.status(200).json({ success: true, data: formattedChats() });
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
        select: "username avatar lastSeen isOnline blockedUsers",
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

    const result = formatChat(chat, req.user._id);
    console.log(result, " these formated chat will be returned");

    //add the other user to the contact list of the current user
    const otherParticipant = chat.participants.find(
      (participant) => !participant._id.equals(req.user._id)
    );

    console.log('will add the other participant to the contact list of the current user', otherParticipant._id)
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { contacts: otherParticipant._id } });
    console.log('will add this user to the contact list of the other user', req.user._id)
    await User.findByIdAndUpdate(otherParticipant._id, { $addToSet: { contacts: req.user._id } });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)      
      .json({ success: false, message: "Error creating chat", error });
  }
};

// Send a message in a specific chat
// exports.sendMessage = async (req, res) => {
//   try {
//     const { content } = req.body;
//     const { chat } = req.params;

//     // Check if the sender is blocked by the receiver
//     const chatInDb = await Chat.findById(chat).populate('participants');
//     const receiver = chat.participants.find(participant => !participant._id.equals(req.user._id));

//     let status = 'sent';
//     if (receiver.blockedUsers.includes(req.user._id)) {
//       status = 'blocked';
//       console.log('Message blocked: User is blocked');
//     }

//     // Create and save message
//     const message = await Message.create({
//       chat,
//       sender: req.user._id,
//       content,
//       status
//     });

//     // Update chat with the last message if the message is not blocked
//     if (status === 'sent') {
//       await Chat.findByIdAndUpdate(chat, { lastMessage: message._id });
//     }

//     res.status(201).json({ success: true, data: message });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error sending message", error });
//   }
// };

// Get all messages from a specific chat
exports.getChatMessages = async (req, res) => {
  
  const { chatId } = req.params; // Get chatId from URL parameters
  const userId = req.user._id.toString(); // Get the ID of the logged-in user
  
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
    })).filter(message => !(message.status === 'blocked' && !message.isOutgoing));


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
