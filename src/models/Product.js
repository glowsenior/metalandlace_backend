const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(val) {
        return !val || val < this.price;
      },
      message: 'Discount price should be below regular price'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['Tumblers', 'Ceramics'],
      message: 'Category must be one of: Tumblers, Ceramics'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  dimensions: {
    type: String,
    required: [true, 'Product dimensions are required'],
    trim: true
  },
  weight: {
    type: String,
    required: [true, 'Product weight is required'],
    trim: true
  },
  colors: [{
    type: String,
    trim: true
  }],
  materials: [{
    type: String,
    required: [true, 'At least one material is required'],
    trim: true
  }],
  care: {
    type: String,
    required: [true, 'Care instructions are required'],
    trim: true
  },
  images: [{
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      alt: {
        type: String,
        default: 'Product image'
      },
      variants: {
        thumbnail: String,
        medium: String,
        large: String,
        original: String
      }
    }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  new: {
    type: Boolean,
    default: true
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ new: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  return this.discountPrice || this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Pre-save middleware to ensure only one primary image
productSchema.pre('save', function(next) {
  if (this.isModified('images')) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    } else if (primaryImages.length === 0 && this.images.length > 0) {
      // Set first image as primary if none is set
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Static methods
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ featured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

productSchema.statics.findNew = function(limit = 10) {
  return this.find({ new: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

productSchema.statics.findBestsellers = function(limit = 10) {
  return this.find({ bestseller: true, isActive: true })
    .sort({ soldCount: -1 })
    .limit(limit);
};

productSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20);
};

productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true
  }, {
    score: { $meta: 'textScore' }
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20);
};

// Instance methods
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

productSchema.methods.updateStock = function(quantity) {
  this.stock += quantity;
  if (this.stock < 0) this.stock = 0;
  return this.save({ validateBeforeSave: false });
};

productSchema.methods.incrementSoldCount = function(quantity = 1) {
  this.soldCount += quantity;
  return this.save({ validateBeforeSave: false });
};

productSchema.methods.isInStock = function(quantity = 1) {
  return this.stock >= quantity;
};

productSchema.methods.getRelatedProducts = function(limit = 4) {
  return this.constructor.find({
    _id: { $ne: this._id },
    category: this.category,
    isActive: true
  })
    .sort({ averageRating: -1, soldCount: -1 })
    .limit(limit);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;