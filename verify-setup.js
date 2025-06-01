const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Seramic Backend Setup...\n');

// Check required files
const requiredFiles = [
  'src/server.js',
  'src/app.js',
  'src/models/Product.js',
  'src/models/User.js',
  'src/models/Order.js',
  'src/controllers/productController.js',
  'src/controllers/userController.js',
  'src/controllers/orderController.js',
  'src/routes/productRoutes.js',
  'src/routes/userRoutes.js',
  'src/routes/orderRoutes.js',
  'src/middleware/auth.js',
  'src/middleware/errorHandler.js',
  'src/utils/appError.js',
  'src/utils/catchAsync.js',
  'package.json',
  '.env'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'dev', 'seed', 'test-api'];

requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`${exists ? '✅' : '❌'} ${script}: ${exists || 'missing'}`);
});

console.log('\n🔧 Checking environment variables:');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET'];
  
  requiredEnvVars.forEach(envVar => {
    const exists = envContent.includes(`${envVar}=`);
    console.log(`${exists ? '✅' : '❌'} ${envVar}`);
  });
} else {
  console.log('❌ .env file not found');
}

console.log('\n📊 Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Backend structure is complete');
  console.log('\n🚀 Ready to start! Run these commands:');
  console.log('   npm run test-api  # Test the setup');
  console.log('   npm run seed      # Add sample data');
  console.log('   npm run dev       # Start development server');
} else {
  console.log('❌ Some required files are missing');
  console.log('❌ Please check the missing files above');
}

console.log('\n📋 Available API endpoints:');
console.log('   GET  /health                    - Health check');
console.log('   GET  /api/v1/products          - Get all products');
console.log('   GET  /api/v1/products/:id      - Get single product');
console.log('   POST /api/v1/products          - Create product');
console.log('   GET  /api/v1/users             - Get all users');
console.log('   GET  /api/v1/orders            - Get all orders');
console.log('\n🌐 Server will run on: http://localhost:5000');