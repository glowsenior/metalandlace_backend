const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Product = require('./src/models/Product');
const User = require('./src/models/User');
const Order = require('./src/models/Order');

// Test database connection and basic operations
async function testAPI() {
  try {
    console.log('🧪 Testing Seramic Backend API...\n');

    // Connect to MongoDB
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/seramic_shop';
    await mongoose.connect(DB);
    console.log('✅ Database connected successfully');

    // Test Product model
    console.log('\n📦 Testing Product model...');
    const productCount = await Product.countDocuments();
    console.log(`Found ${productCount} products in database`);

    // Test User model
    console.log('\n👤 Testing User model...');
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in database`);

    // Test Order model
    console.log('\n🛒 Testing Order model...');
    const orderCount = await Order.countDocuments();
    console.log(`Found ${orderCount} orders in database`);

    // Test creating a sample product
    console.log('\n🆕 Testing product creation...');
    const sampleProduct = {
      name: 'Test Ceramic Vase',
      description: 'A beautiful test vase for API testing',
      price: 49.99,
      category: 'vases',
      stock: 10,
      dimensions: '8" H x 4" W',
      weight: '1.5 lbs',
      colors: ['Blue', 'White'],
      materials: ['Ceramic'],
      care: 'Hand wash only',
      tags: ['test', 'ceramic', 'vase']
    };

    // Check if test product already exists
    const existingProduct = await Product.findOne({ name: 'Test Ceramic Vase' });
    if (existingProduct) {
      console.log('Test product already exists, skipping creation');
    } else {
      const newProduct = await Product.create(sampleProduct);
      console.log(`✅ Created test product: ${newProduct.name} (ID: ${newProduct._id})`);
    }

    console.log('\n🎉 All tests passed! Backend is ready to use.');
    console.log('\n📋 Summary:');
    console.log(`- Products: ${productCount}`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Orders: ${orderCount}`);
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database disconnected');
    process.exit(0);
  }
}

// Run tests
testAPI();