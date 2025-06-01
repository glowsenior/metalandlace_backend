const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage (for processing before upload)
const multerStorage = multer.memoryStorage();

// Multer configuration for direct Cloudinary upload
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'seramic-shop',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// For processing images before upload
const uploadMemory = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// For direct upload to Cloudinary
const uploadCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware for uploading product images
const uploadProductImages = uploadMemory.fields([
  { name: 'images', maxCount: 10 },
  { name: 'primaryImage', maxCount: 1 }
]);

// Middleware for uploading single image
const uploadSingleImage = uploadMemory.single('image');

// Middleware for uploading user avatar
const uploadUserAvatar = uploadMemory.single('avatar');

// Process and upload product images to Cloudinary
const processProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  const uploadPromises = [];
  req.body.images = [];

  // Process primary image
  if (req.files.primaryImage) {
    const file = req.files.primaryImage[0];
    const processedBuffer = await sharp(file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'seramic-shop/products',
          public_id: `product-${Date.now()}-primary`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else {
            req.body.images.unshift({
              url: result.secure_url,
              publicId: result.public_id,
              isPrimary: true,
              alt: req.body.name || 'Product image'
            });
            resolve(result);
          }
        }
      ).end(processedBuffer);
    });

    uploadPromises.push(uploadPromise);
  }

  // Process additional images
  if (req.files.images) {
    req.files.images.forEach((file, index) => {
      const uploadPromise = sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 90 })
        .toBuffer()
        .then(processedBuffer => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'seramic-shop/products',
                public_id: `product-${Date.now()}-${index}`,
                transformation: [
                  { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else {
                  req.body.images.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    isPrimary: false,
                    alt: req.body.name || 'Product image'
                  });
                  resolve(result);
                }
              }
            ).end(processedBuffer);
          });
        });

      uploadPromises.push(uploadPromise);
    });
  }

  try {
    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    return next(new AppError('Error uploading images. Please try again.', 500));
  }
});

// Process and upload single image
const processSingleImage = (folder = 'seramic-shop/general') => {
  return catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const processedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: `image-${Date.now()}`,
            transformation: [
              { width: 800, height: 800, crop: 'limit', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(processedBuffer);
      });

      req.body.image = {
        url: result.secure_url,
        publicId: result.public_id
      };

      next();
    } catch (error) {
      return next(new AppError('Error uploading image. Please try again.', 500));
    }
  });
};

// Process and upload user avatar
const processUserAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const processedBuffer = await sharp(req.file.buffer)
    .resize(300, 300)
    .jpeg({ quality: 90 })
    .toBuffer();

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'seramic-shop/avatars',
          public_id: `avatar-${req.user.id}-${Date.now()}`,
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(processedBuffer);
    });

    req.body.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };

    next();
  } catch (error) {
    return next(new AppError('Error uploading avatar. Please try again.', 500));
  }
});

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Delete multiple images from Cloudinary
const deleteImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
};

// Generate image variants (thumbnails, etc.)
const generateImageVariants = async (publicId) => {
  const variants = {
    thumbnail: cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: 'fill',
      quality: 'auto'
    }),
    medium: cloudinary.url(publicId, {
      width: 400,
      height: 400,
      crop: 'limit',
      quality: 'auto'
    }),
    large: cloudinary.url(publicId, {
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto'
    }),
    original: cloudinary.url(publicId, {
      quality: 'auto'
    })
  };

  return variants;
};

module.exports = {
  uploadProductImages,
  uploadSingleImage,
  uploadUserAvatar,
  uploadCloudinary,
  processProductImages,
  processSingleImage,
  processUserAvatar,
  deleteImage,
  deleteImages,
  generateImageVariants,
  cloudinary
};