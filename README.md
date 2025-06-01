# Seramic Shop Backend

A professional e-commerce backend for a ceramic shopping website built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🛍️ **Product Management** - Full CRUD operations with image upload
- 📦 **Order Management** - Complete order lifecycle with status tracking
- ⭐ **Review System** - Customer reviews with moderation
- 🛒 **Shopping Cart** - Persistent cart functionality
- ❤️ **Wishlist** - Save favorite products
- 📁 **Category Management** - Hierarchical product categories
- 🖼️ **Image Upload** - Cloudinary integration with image processing
- 📊 **Analytics** - Comprehensive statistics and reporting
- 🔒 **Security** - Rate limiting, data sanitization, and security headers
- 📧 **Email Integration** - Order confirmations and notifications
- 💳 **Payment Ready** - Stripe integration structure

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer + Cloudinary
- **Image Processing**: Sharp
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator
- **Email**: Nodemailer
- **Payment**: Stripe (structure ready)

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd seramic_backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/seramic_shop
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/signup` | Register new user |
| POST | `/users/login` | User login |
| GET | `/users/logout` | User logout |
| POST | `/users/forgotPassword` | Request password reset |
| PATCH | `/users/resetPassword/:token` | Reset password |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products with filtering |
| GET | `/products/:id` | Get single product |
| GET | `/products/featured` | Get featured products |
| GET | `/products/new` | Get new products |
| GET | `/products/bestsellers` | Get bestseller products |
| GET | `/products/category/:category` | Get products by category |
| POST | `/products` | Create product (Admin) |
| PATCH | `/products/:id/admin` | Update product (Admin) |
| DELETE | `/products/:id/admin` | Delete product (Admin) |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/updateMe` | Update current user |
| GET | `/users/cart` | Get user's cart |
| POST | `/users/cart` | Add item to cart |
| GET | `/users/wishlist` | Get user's wishlist |
| POST | `/users/wishlist` | Add item to wishlist |

### Order Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/my-orders` | Get user's orders |
| GET | `/orders/:id` | Get single order |
| PATCH | `/orders/:id/cancel` | Cancel order |
| GET | `/orders` | Get all orders (Admin) |
| PATCH | `/orders/:id/status` | Update order status (Admin) |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories |
| GET | `/categories/tree` | Get category tree |
| GET | `/categories/:id` | Get single category |
| POST | `/categories` | Create category (Admin) |
| PATCH | `/categories/:id` | Update category (Admin) |
| DELETE | `/categories/:id` | Delete category (Admin) |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/product/:productId` | Get product reviews |
| POST | `/reviews/product/:productId` | Create review |
| GET | `/reviews/my-reviews` | Get user's reviews |
| PATCH | `/reviews/:id` | Update review |
| DELETE | `/reviews/:id` | Delete review |

## Query Parameters

### Product Filtering
```
GET /api/v1/products?category=vases&minPrice=50&maxPrice=200&sort=price&page=1&limit=10
```

Available filters:
- `category` - Filter by category
- `minPrice`, `maxPrice` - Price range
- `minRating` - Minimum rating
- `colors` - Filter by colors
- `materials` - Filter by materials
- `featured`, `new`, `bestseller` - Boolean filters
- `search` - Text search
- `sort` - Sort by: `price`, `-price`, `rating`, `-rating`, `createdAt`, `-createdAt`
- `page`, `limit` - Pagination

## Sample Data

After running `npm run seed`, you'll have:

**Admin User:**
- Email: `admin@seramicshop.com`
- Password: `Admin123!`

**Customer User:**
- Email: `customer@example.com`
- Password: `Customer123!`

**Sample Products:**
- Elegant Blue Ceramic Vase
- Rustic Dinner Plate Set
- Artisan Mixing Bowl
- Handmade Coffee Mug
- Decorative Ceramic Sculpture
- Wedding Gift Tea Set

## Project Structure

```
src/
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose models
├── routes/             # Express routes
├── scripts/            # Utility scripts
├── utils/              # Helper utilities
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## Security Features

- **Rate Limiting** - Prevents abuse
- **Data Sanitization** - NoSQL injection protection
- **XSS Protection** - Cross-site scripting prevention
- **Security Headers** - Helmet.js integration
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Input Validation** - express-validator integration

## Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm test           # Run tests (when implemented)
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Environment Variables

See `.env.example` for all available environment variables.

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use strong JWT secret (32+ characters)
3. Configure MongoDB Atlas or production database
4. Set up Cloudinary for image storage
5. Configure email service (SendGrid, etc.)
6. Set up Stripe for payments
7. Configure CORS for your frontend domain
8. Set up SSL/HTTPS
9. Configure rate limiting for production
10. Set up monitoring and logging

### Docker Support (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@seramicshop.com or create an issue in the repository.