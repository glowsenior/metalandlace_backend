const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Routes accessible to all authenticated users
router.post('/', orderController.createOrder);

// Customer can only view their own orders
router.get('/my-orders', orderController.getMyOrders);

// Admin only routes
router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), orderController.getAllOrders);

router
  .route('/:id')
  .get(orderController.getOrder) // Will be restricted in controller based on user role
  .patch(authMiddleware.restrictTo('admin'), orderController.updateOrder)
  .delete(authMiddleware.restrictTo('admin'), orderController.deleteOrder);

module.exports = router;