const Review = require('../models/Review');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all reviews for a product
const getProductReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const reviews = await Review.find({ product: productId, status: 'approved' })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Create new review
const createReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const newReview = await Review.create({
    ...req.body,
    product: productId,
    user: req.user?.id || '507f1f77bcf86cd799439011' // Mock user ID for testing
  });

  const populatedReview = await Review.findById(newReview._id)
    .populate('user', 'firstName lastName');

  res.status(201).json({
    status: 'success',
    data: {
      review: populatedReview
    }
  });
});

// Get all reviews
const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find()
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

// Get single review
const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'firstName lastName')
    .populate('product', 'name slug');

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Update review
const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('user', 'firstName lastName');

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

// Delete review
const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getProductReviews,
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview
};