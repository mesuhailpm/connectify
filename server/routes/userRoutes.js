// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { searchUsers, fetchUserName, blockUser, unblockUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/search', authMiddleware.protect, searchUsers);
router.get('/name/:id', authMiddleware.protect, fetchUserName);

// Block a user
router.post('/block', authMiddleware.protect, blockUser);

// Unblock a user
router.post('/unblock', authMiddleware.protect, unblockUser);

module.exports = router;
