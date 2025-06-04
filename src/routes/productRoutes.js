const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const { uploadProductImages, processProductImages } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/all', productController.getAllProductsAdmin);
router.get('/:id', productController.getProduct);

// Admin routes - protected
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', uploadProductImages, processProductImages, productController.createProduct);
router.patch('/:id', uploadProductImages, processProductImages, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;