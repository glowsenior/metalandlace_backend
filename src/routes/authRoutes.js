const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Authentication routes
router.post('/register', authMiddleware.signup);
router.post('/login', authMiddleware.login);
router.get('/logout', authMiddleware.logout);
router.post('/forgot-password', authMiddleware.forgotPassword);
router.patch('/reset-password/:token', authMiddleware.resetPassword);
router.get('/verify-email/:token', authMiddleware.verifyEmail);

// Protected routes that require authentication
router.use(authMiddleware.protect);

router.patch('/update-password', authMiddleware.updatePassword);
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;