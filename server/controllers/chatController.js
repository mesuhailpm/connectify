const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chat threads for the logged-in user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id }).populate('lastMessage');
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching chats', error });
  }
};

// Create a new chat thread
exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;

    // Check if the chat between the participants already exists
    let chat = await Chat.findOne({
      participants: { $all: participants },
    });

    if (!chat) {
      chat = await Chat.create({ participants });
    }

    res.status(201).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating chat', error });
  }
};

// Send a message in a specific chat
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { chatId } = req.params;

    // Create and save message
    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
    });

    // Update chat with the last message
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message', error });
  }
};

// Get all messages from a specific chat
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId }).populate('sender', 'username');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching messages', error });
  }
};
