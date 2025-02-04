const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');

// GET: /api/chats - Get all chat threads for the logged-in user
router.get('/', authMiddleware.protect, chatController.getChats);

// Get all chats for a user
router.get("/chats/:userId", async (req, res) => {
    try {
      const chats = await Chat.find({ participants: req.params.userId })
        .populate("lastMessage")
        .exec();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Error fetching chats" });
    }
  });

// api/chats/muteChat/${userId}/${chatId}
router.put('/muteChat/:userId/:chatId', authMiddleware.protect, chatController.muteChat)

// api/chats/unmuteChat/${userId}/${chatId}
router.put('/unmuteChat/:userId/:chatId', authMiddleware.protect, chatController.unmuteChat)
  
  


// POST: /api/chats/new - Create a new chat thread
router.post('/new', authMiddleware.protect, chatController.createChat);

// POST: /api/chats/:chatId/message - Send a message in a chat thread
router.post('/:chatId/message', authMiddleware.protect, chatController.sendMessage);

// GET: /api/chats/:chatId/messages - Get all messages from a specific chat thread
router.get('/:chatId/messages', authMiddleware.protect, chatController.getChatMessages);
//GET: /api/search

module.exports = router;
