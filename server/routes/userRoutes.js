// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { searchUsers, fetchUserName } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/search', authMiddleware.protect, searchUsers);
router.get('/name/:id', authMiddleware.protect, fetchUserName);

module.exports = router;
