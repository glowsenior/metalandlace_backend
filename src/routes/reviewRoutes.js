const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes (require authentication)
router.use(authController.protect);

// Customer routes
router.get('/my-reviews', reviewController.getUserReviews);
router.post('/product/:productId', reviewController.createReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.post('/:id/helpful', reviewController.markReviewHelpful);
router.post('/:id/report', reviewController.reportReview);

// Admin only routes
router.use(authController.restrictTo('admin', 'moderator'));

router.get('/', reviewController.getAllReviews);
router.get('/pending', reviewController.getPendingReviews);
router.get('/stats', reviewController.getReviewStats);
router.patch('/:id/approve', reviewController.approveReview);
router.patch('/:id/reject', reviewController.rejectReview);
router.post('/:id/response', reviewController.addReviewResponse);

module.exports = router;