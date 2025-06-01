const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'United States'
  },
  phone: {
    type: String,
    trim: true
  }
});

const timelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  billingAddress: {
    type: addressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    last4: String,
    brand: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingNumber: String,
  carrier: String,
  notes: String,
  customerNotes: String,
  timeline: [timelineEventSchema],
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  refundReason: String,
  refundedAt: Date,
  refundedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for items count
orderSchema.virtual('itemsCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for can cancel
orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for can refund
orderSchema.virtual('canRefund').get(function() {
  return ['delivered'].includes(this.status) && this.paymentStatus === 'paid';
});

// Virtual for is completed
orderSchema.virtual('isCompleted').get(function() {
  return ['delivered', 'cancelled', 'refunded', 'returned'].includes(this.status);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to add timeline events
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('taxAmount') || this.isModified('shippingCost') || this.isModified('discountAmount')) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal + this.taxAmount + this.shippingCost - this.discountAmount;
  }
  next();
});

// Static methods
orderSchema.statics.findByUser = function(userId, options = {}) {
  return this.find({ user: userId })
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50)
    .populate('items.product', 'name slug images');
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name slug')
    .sort({ createdAt: -1 });
};

orderSchema.statics.findPending = function() {
  return this.findByStatus('pending');
};

orderSchema.statics.findProcessing = function() {
  return this.find({ status: { $in: ['confirmed', 'processing', 'shipped'] } })
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

orderSchema.statics.getOrderStats = async function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };
};

orderSchema.statics.getRevenueByMonth = function(year) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Instance methods
orderSchema.methods.addTimelineEvent = function(status, note, updatedBy) {
  this.timeline.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  return this.save();
};

orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add specific logic for status changes
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
    this.cancelledBy = updatedBy;
  } else if (newStatus === 'delivered') {
    this.actualDelivery = new Date();
  } else if (newStatus === 'shipped' && this.trackingNumber) {
    note = note || `Order shipped with tracking number: ${this.trackingNumber}`;
  }

  this.timeline.push({
    status: newStatus,
    note: note || `Status changed from ${oldStatus} to ${newStatus}`,
    updatedBy,
    timestamp: new Date()
  });

  return this.save();
};

orderSchema.methods.cancel = function(reason, cancelledBy) {
  if (!this.canCancel) {
    throw new Error('Order cannot be cancelled in current status');
  }

  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;

  this.timeline.push({
    status: 'cancelled',
    note: `Order cancelled. Reason: ${reason}`,
    updatedBy: cancelledBy,
    timestamp: new Date()
  });

  return this.save();
};

orderSchema.methods.refund = function(amount, reason, refundedBy) {
  if (!this.canRefund) {
    throw new Error('Order cannot be refunded in current status');
  }

  const refundAmount = amount || this.total;
  
  this.status = 'refunded';
  this.paymentStatus = refundAmount >= this.total ? 'refunded' : 'partially_refunded';
  this.refundReason = reason;
  this.refundedAt = new Date();
  this.refundedBy = refundedBy;
  
  if (!this.paymentDetails) {
    this.paymentDetails = {};
  }
  this.paymentDetails.refundAmount = refundAmount;
  this.paymentDetails.refundedAt = new Date();

  this.timeline.push({
    status: 'refunded',
    note: `Order refunded. Amount: $${refundAmount}. Reason: ${reason}`,
    updatedBy: refundedBy,
    timestamp: new Date()
  });

  return this.save();
};

orderSchema.methods.markAsPaid = function(paymentDetails) {
  this.paymentStatus = 'paid';
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentDetails,
    paidAt: new Date()
  };

  this.timeline.push({
    status: this.status,
    note: 'Payment confirmed',
    timestamp: new Date()
  });

  return this.save();
};

orderSchema.methods.setTracking = function(trackingNumber, carrier) {
  this.trackingNumber = trackingNumber;
  this.carrier = carrier;

  this.timeline.push({
    status: this.status,
    note: `Tracking number added: ${trackingNumber} (${carrier})`,
    timestamp: new Date()
  });

  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;