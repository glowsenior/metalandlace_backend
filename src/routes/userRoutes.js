const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Restrict to admin only
router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), userController.getAllUsers)
  .post(authMiddleware.restrictTo('admin'), userController.createUser);

router
  .route('/:id')
  .get(authMiddleware.restrictTo('admin'), userController.getUser)
  .patch(authMiddleware.restrictTo('admin'), userController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

module.exports = router;