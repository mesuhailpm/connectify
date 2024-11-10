// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search', authMiddleware.protect, searchUsers);

module.exports = router;
