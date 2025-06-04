const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all products
const getAllProducts = catchAsync(async (req, res, next) => {
  const {category, price, sort, limit, newProduct, bestseller, featured } = req.query;
  console.log(category, price)
  const products = await Product.find({ isActive: true });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

const getAllProductsAdmin = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get single product
const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  let product;
  
  // Check if the parameter is a valid ObjectId or a slug
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(id);
  } else {
    product = await Product.findOne({ slug: id, isActive: true });
  }

  if (!product) {
    return next(new AppError('No product found with that ID or slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Create new product (Admin only)
const createProduct = catchAsync(async (req, res, next) => {
  // Parse JSON strings from form data
  const formDataFields = ['colors', 'materials', 'tags', 'seoKeywords'];
  formDataFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        // If it's not valid JSON, keep it as is
        console.log(`Error parsing ${field}:`, err);
      }
    }
  });
  
  // Process HTML content if present
  if (req.body.description) {
    // Store HTML content as-is without encoding
    req.body.description = req.body.description
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  
  if (req.body.care) {
    // Store HTML content as-is without encoding
    req.body.care = req.body.care
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  
  // Check if images were uploaded
  if (!req.body.images || req.body.images.length === 0) {
    return next(new AppError('At least one product image is required', 400));
  }
  
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

// Update product (Admin only)
const updateProduct = catchAsync(async (req, res, next) => {
  // Parse JSON strings from form data
  const formDataFields = ['colors', 'materials', 'tags', 'seoKeywords'];
  formDataFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        // If it's not valid JSON, keep it as is
        console.log(`Error parsing ${field}:`, err);
      }
    }
  });
  
  // Process HTML content if present
  if (req.body.description) {
    // Store HTML content as-is without encoding
    req.body.description = req.body.description
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  
  if (req.body.care) {
    // Store HTML content as-is without encoding
    req.body.care = req.body.care
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  
  // Get the existing product
  const existingProduct = await Product.findById(req.params.id);
  
  if (!existingProduct) {
    return next(new AppError('No product found with that ID', 404));
  }
  
  // If new images were uploaded, they will be in req.body.images
  // If no new images were uploaded, keep the existing ones
  if (!req.body.images || req.body.images.length === 0) {
    req.body.images = existingProduct.images;
  }
  
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Delete product (Admin only)
const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllProducts,
  getAllProductsAdmin,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};