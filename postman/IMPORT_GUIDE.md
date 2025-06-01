# 📥 Postman Import Guide - Seramic Backend API

## Quick Import Instructions

### 🚀 Method 1: Direct Import (Recommended)

1. **Open Postman**
2. **Click "Import" button** (top left)
3. **Drag and drop both files** or click "Upload Files":
   - `Seramic_Backend_API.postman_collection.json`
   - `Seramic_Environment.postman_environment.json`
4. **Click "Import"**
5. **Select Environment**: Choose "Seramic Environment" from dropdown (top right)

### 🔧 Method 2: Manual Import

#### Import Collection:
1. File → Import → Choose Files
2. Select `Seramic_Backend_API.postman_collection.json`
3. Click "Import"

#### Import Environment:
1. Manage Environments (gear icon) → Import
2. Select `Seramic_Environment.postman_environment.json`
3. Click "Import"
4. Close settings and select "Seramic Environment"

## ✅ Verification Steps

### 1. Check Collection Import
- Look for "Seramic Backend API" in your collections
- Should contain 6 main folders:
  - Health Check
  - Products
  - Users
  - Orders
  - Sample Data Tests
  - Advanced Queries

### 2. Check Environment Import
- Environment dropdown should show "Seramic Environment"
- Variables should include:
  - `base_url`: http://localhost:5000
  - `product_id`, `user_id`, `order_id`: (empty, will be populated)
  - Admin/customer credentials

### 3. Test Setup
1. **Start your server**: `npm run dev`
2. **Run Health Check**: 
   ```
   GET {{base_url}}/health
   ```
3. **Expected Response**:
   ```json
   {
     "status": "success",
     "message": "Server is running!",
     "timestamp": "2024-01-15T10:00:00.000Z",
     "environment": "development"
   }
   ```

## 🎯 First Test Sequence

### Step 1: Health Check
```
GET {{base_url}}/health
```

### Step 2: Create Sample Product
Use: `Sample Data Tests → Create Sample Ceramic Vase`

### Step 3: Get All Products
```
GET {{base_url}}/api/v1/products
```

### Step 4: Create Sample User
Use: `Sample Data Tests → Create Sample Customer User`

### Step 5: Create Sample Order
Use: `Orders → Create Order` (update user_id and product_id from previous responses)

## 🔄 Environment Variables Explained

| Variable | Purpose | Auto-Updated |
|----------|---------|--------------|
| `base_url` | Server URL | No |
| `product_id` | Current product ID | Yes* |
| `user_id` | Current user ID | Yes* |
| `order_id` | Current order ID | Yes* |
| `auth_token` | JWT token | Yes* |

*Will be auto-updated when authentication is implemented

## 🛠️ Customization

### Change Server URL
1. Go to Environments
2. Select "Seramic Environment"
3. Update `base_url` value
4. Save

### Add New Variables
1. Environments → Seramic Environment
2. Add new variable
3. Set initial value
4. Save

## 📋 Collection Overview

### Health Check (1 request)
- Server status verification

### Products (5 requests)
- Get All Products
- Get Product by ID
- Create Product
- Update Product
- Delete Product

### Users (5 requests)
- Get All Users
- Get User by ID
- Create User
- Update User
- Delete User

### Orders (5 requests)
- Get All Orders
- Get Order by ID
- Create Order
- Update Order Status
- Cancel Order

### Sample Data Tests (3 requests)
- Create Sample Ceramic Vase
- Create Sample Dinner Plate Set
- Create Sample Customer User

### Advanced Queries (5 requests)
- Get Featured Products
- Get Products by Category
- Get Products with Price Range
- Get New Products
- Get Bestseller Products

## 🚨 Troubleshooting

### Collection Not Visible
- Check if import was successful
- Refresh Postman
- Try importing again

### Environment Not Working
- Ensure "Seramic Environment" is selected
- Check variable values in environment settings
- Verify no typos in variable names

### Server Connection Issues
- Ensure server is running: `npm run dev`
- Check `base_url` in environment
- Verify port 5000 is not blocked

### Request Failures
- Check server logs for errors
- Verify request body format
- Ensure required fields are included

## 💡 Pro Tips

### 1. Use Collection Runner
- Select collection → Run
- Test multiple requests in sequence
- Great for regression testing

### 2. Save Responses
- Use "Save Response" to keep examples
- Helpful for documentation
- Compare different test runs

### 3. Organize Tests
- Create folders for different test scenarios
- Duplicate requests for different test cases
- Use descriptive names

### 4. Monitor Variables
- Watch variable updates in real-time
- Use console to debug variable issues
- Set breakpoints in pre-request scripts

## 📞 Support

If you encounter issues:

1. **Check Server Status**:
   ```bash
   npm run verify
   npm run dev
   ```

2. **Verify Files**:
   - Ensure both JSON files are valid
   - Check file permissions
   - Try re-downloading files

3. **Postman Issues**:
   - Update Postman to latest version
   - Clear Postman cache
   - Restart Postman

4. **Test with cURL**:
   ```bash
   curl http://localhost:5000/health
   ```

## 🎉 You're Ready!

Once imported successfully, you have:
- ✅ Complete API collection
- ✅ Pre-configured environment
- ✅ Sample data requests
- ✅ Advanced query examples
- ✅ Ready-to-use test scenarios

**Happy testing with your Seramic Backend API!** 🧪✨