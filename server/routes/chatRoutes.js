const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// GET: /api/chats - Get all chat threads for the logged-in user
router.get('/', authMiddleware.protect, chatController.getChats);

// POST: /api/chats/new - Create a new chat thread
router.post('/new', authMiddleware.protect, chatController.createChat);

// POST: /api/chats/:chatId/message - Send a message in a chat thread
router.post('/:chatId/message', authMiddleware.protect, chatController.sendMessage);

// GET: /api/chats/:chatId/messages - Get all messages from a specific chat thread
router.get('/:chatId/messages', authMiddleware.protect, chatController.getMessages);

module.exports = router;
