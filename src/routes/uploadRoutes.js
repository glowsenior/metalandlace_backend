const express = require('express');
const authController = require('../middleware/auth');
const { 
  uploadSingleImage, 
  uploadProductImages, 
  processSingleImage, 
  processProductImages,
  generateImageVariants 
} = require('../middleware/upload');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// Protected routes (require authentication)
router.use(authController.protect);

// Upload single image
router.post('/single', uploadSingleImage, processSingleImage('seramic-shop/uploads'), catchAsync(async (req, res, next) => {
  if (!req.body.image) {
    return res.status(400).json({
      status: 'fail',
      message: 'No image uploaded'
    });
  }

  // Generate image variants
  const variants = await generateImageVariants(req.body.image.publicId);

  res.status(200).json({
    status: 'success',
    data: {
      image: req.body.image,
      variants
    }
  });
}));

// Upload multiple product images
router.post('/products', uploadProductImages, processProductImages, catchAsync(async (req, res, next) => {
  if (!req.body.images || req.body.images.length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'No images uploaded'
    });
  }

  // Generate variants for each image
  const imagesWithVariants = await Promise.all(
    req.body.images.map(async (image) => {
      const variants = await generateImageVariants(image.publicId);
      return {
        ...image,
        variants
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      images: imagesWithVariants
    }
  });
}));

module.exports = router;