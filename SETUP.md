# Seramic Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Make sure your `.env` file has the basic configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/seramic_shop
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Test the Setup
```bash
npm run test-api
```

### 4. Seed Sample Data (Optional)
```bash
npm run seed
```

### 5. Start the Server
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Products
```
GET    /api/v1/products     - Get all products
GET    /api/v1/products/:id - Get single product
POST   /api/v1/products     - Create product
PATCH  /api/v1/products/:id - Update product
DELETE /api/v1/products/:id - Delete product
```

### Users
```
GET    /api/v1/users     - Get all users
GET    /api/v1/users/:id - Get single user
POST   /api/v1/users     - Create user
PATCH  /api/v1/users/:id - Update user
DELETE /api/v1/users/:id - Delete user
```

### Orders
```
GET    /api/v1/orders     - Get all orders
GET    /api/v1/orders/:id - Get single order
POST   /api/v1/orders     - Create order
PATCH  /api/v1/orders/:id - Update order
DELETE /api/v1/orders/:id - Delete order
```

## Testing with curl

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test Products Endpoint
```bash
curl http://localhost:5000/api/v1/products
```

### Create a Test Product
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beautiful Ceramic Vase",
    "description": "A stunning handcrafted vase",
    "price": 89.99,
    "category": "vases",
    "stock": 10,
    "dimensions": "12 inches tall",
    "weight": "2 lbs",
    "colors": ["Blue", "White"],
    "materials": ["Ceramic"],
    "care": "Hand wash only",
    "tags": ["handcrafted", "decorative"]
  }'
```

## Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── productController.js
│   ├── userController.js
│   └── orderController.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── upload.js
│   └── validation.js
├── models/             # Mongoose models
│   ├── Product.js
│   ├── User.js
│   └── Order.js
├── routes/             # Express routes
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   └── uploadRoutes.js
├── scripts/            # Utility scripts
│   └── seedDatabase.js
├── utils/              # Helper utilities
│   ├── appError.js
│   └── catchAsync.js
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## Database Models

### Product
- name, description, price, category
- stock, dimensions, weight
- colors, materials, care instructions
- images, tags, ratings
- featured, new, bestseller flags

### User
- firstName, lastName, email, password
- role (customer, admin, moderator)
- addresses, phone, preferences
- cart, wishlist
- order history and statistics

### Order
- user, items, addresses
- payment and shipping details
- status tracking, timeline
- totals and calculations

## Features Implemented

✅ **Core API Structure**
- Express.js server with middleware
- MongoDB connection with Mongoose
- Error handling and validation
- Security middleware (CORS, Helmet, Rate limiting)

✅ **Product Management**
- CRUD operations for products
- Image upload support (Cloudinary ready)
- Category and filtering support
- Stock management

✅ **User Management**
- User registration and authentication
- Role-based access control
- Profile management
- Cart and wishlist functionality

✅ **Order Management**
- Order creation and tracking
- Status management
- Address handling
- Payment integration ready

✅ **File Upload**
- Cloudinary integration
- Image processing with Sharp
- Multiple file upload support

✅ **Security**
- JWT authentication
- Password hashing with bcrypt
- Data sanitization
- Rate limiting
- Security headers

## Next Steps

1. **Authentication**: Implement full JWT auth flow
2. **Reviews**: Add review and rating system
3. **Categories**: Implement category hierarchy
4. **Search**: Add advanced search and filtering
5. **Payment**: Integrate Stripe payment processing
6. **Email**: Set up email notifications
7. **Testing**: Add comprehensive test suite
8. **Documentation**: Generate API documentation

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running locally
- Check the MONGODB_URI in your .env file
- Verify network connectivity

### Port Already in Use
- Change the PORT in .env file
- Kill existing processes: `npx kill-port 5000`

### Missing Dependencies
- Run `npm install` to install all dependencies
- Check for any peer dependency warnings

### File Upload Issues
- Verify Cloudinary credentials in .env
- Check file size limits
- Ensure proper middleware order

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment variables
3. Test with the provided curl examples
4. Review the README.md for detailed documentation