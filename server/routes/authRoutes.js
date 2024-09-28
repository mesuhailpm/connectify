const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require ('../middleware/authMiddleware')

// POST: /api/auth/signup - Register a new user
router.post('/signup', authController.signUp);

// POST: /api/auth/login - Log in an existing user
router.post('/login', authController.login);

// POST: /api/auth/logout - Log out a user
router.post('/logout', authController.logout);

// GET: /api/auth/me - Get current logged-in user details
router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;
