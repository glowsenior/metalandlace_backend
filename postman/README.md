# Seramic Backend API - Postman Collection

This folder contains comprehensive Postman collection files for testing the Seramic Backend API.

## Files Included

### 1. `Seramic_Backend_API.postman_collection.json`
Complete API collection with all endpoints organized into folders:

- **Health Check** - Server status verification
- **Products** - Complete product CRUD operations
- **Users** - User management endpoints
- **Orders** - Order management and tracking
- **Sample Data Tests** - Pre-configured requests with sample ceramic products
- **Advanced Queries** - Complex filtering and search examples

### 2. `Seramic_Environment.postman_environment.json`
Environment variables for easy configuration:

- `base_url` - Server URL (default: http://localhost:5000)
- `product_id`, `user_id`, `order_id` - Dynamic IDs for testing
- `auth_token` - JWT token for authenticated requests
- Admin and customer credentials for testing

## How to Import

### Step 1: Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Seramic_Backend_API.postman_collection.json`
4. Click "Import"

### Step 2: Import Environment
1. Click "Import" button again
2. Select `Seramic_Environment.postman_environment.json`
3. Click "Import"
4. Select "Seramic Environment" from the environment dropdown

## Quick Start Testing

### 1. Health Check
```
GET {{base_url}}/health
```
Verify the server is running.

### 2. Create Sample Products
Use the "Sample Data Tests" folder to create:
- Ceramic vases
- Dinner plate sets
- Customer accounts

### 3. Test Product Operations
- Get all products
- Filter by category, price, features
- Create, update, delete products

### 4. Test User Management
- Create user accounts
- Update user profiles
- Manage addresses and preferences

### 5. Test Order Flow
- Create orders with multiple items
- Update order status
- Track order timeline

## Sample Requests Included

### Products
- **Artisan Ceramic Vase** - Complete product with images, SEO, pricing
- **Dinner Plate Set** - Multi-item product with variations
- **Advanced Filtering** - Category, price range, featured items

### Users
- **Customer Account** - Full profile with addresses and preferences
- **Admin Account** - Administrative user with elevated permissions

### Orders
- **Complete Order** - Multi-item order with shipping/billing addresses
- **Order Updates** - Status changes, tracking, payments

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API server URL | `http://localhost:5000` |
| `product_id` | Dynamic product ID | Auto-populated from responses |
| `user_id` | Dynamic user ID | Auto-populated from responses |
| `order_id` | Dynamic order ID | Auto-populated from responses |
| `auth_token` | JWT authentication token | Bearer token |

## Advanced Features

### 1. Dynamic Variables
The collection uses Postman's dynamic variables to:
- Auto-populate IDs from creation responses
- Chain requests together
- Maintain state across tests

### 2. Pre-request Scripts
Some requests include scripts to:
- Generate test data
- Set authentication headers
- Validate prerequisites

### 3. Test Scripts
Response validation scripts check:
- Status codes
- Response structure
- Data integrity
- Business logic

## Testing Scenarios

### E-commerce Flow
1. Create customer account
2. Browse products by category
3. Add items to cart (simulated)
4. Create order
5. Update order status
6. Track delivery

### Admin Operations
1. Create products
2. Manage inventory
3. Process orders
4. Update order status
5. Generate reports

### Product Management
1. Create product with full details
2. Upload images (simulated)
3. Set pricing and discounts
4. Manage stock levels
5. Update product information

## Error Testing

The collection includes requests to test:
- Invalid data validation
- Missing required fields
- Authentication failures
- Permission errors
- Not found scenarios

## Performance Testing

Use Postman's Collection Runner to:
- Run multiple requests in sequence
- Test with different data sets
- Measure response times
- Validate under load

## Tips for Usage

### 1. Start with Health Check
Always verify the server is running before testing other endpoints.

### 2. Use Sample Data
The "Sample Data Tests" folder provides realistic test data for ceramic products.

### 3. Check Response Variables
Many requests automatically set variables from responses for use in subsequent requests.

### 4. Environment Switching
Create multiple environments for:
- Local development (`http://localhost:5000`)
- Staging server
- Production server

### 5. Authentication
When authentication is implemented, the `auth_token` variable will be automatically set from login responses.

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure server is running: `npm run dev`
   - Check port configuration in environment

2. **404 Not Found**
   - Verify API endpoints match server routes
   - Check base_url in environment

3. **Validation Errors**
   - Review request body format
   - Check required fields in sample requests

4. **Database Errors**
   - Ensure MongoDB is running
   - Check database connection in server logs

### Server Logs
Monitor server console for detailed error information when requests fail.

## Collection Structure

```
Seramic Backend API/
├── Health Check/
│   └── Server Health Check
├── Products/
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Create Product
│   ├── Update Product
│   └── Delete Product
├── Users/
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Create User
│   ├── Update User
│   └── Delete User
├── Orders/
│   ├── Get All Orders
│   ├── Get Order by ID
│   ├── Create Order
│   ├── Update Order Status
│   └── Cancel Order
├── Sample Data Tests/
│   ├── Create Sample Ceramic Vase
│   ├── Create Sample Dinner Plate Set
│   └── Create Sample Customer User
└── Advanced Queries/
    ├── Get Featured Products
    ├── Get Products by Category
    ├── Get Products with Price Range
    ├── Get New Products
    └── Get Bestseller Products
```

## Support

For questions or issues with the Postman collection:
1. Check server logs for errors
2. Verify environment variables
3. Review request/response in Postman console
4. Test with curl commands as backup

Happy testing! 🧪✨