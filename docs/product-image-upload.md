# Product Image Upload Documentation

## Overview

This document explains how to upload product images using the Metal and Lace API. The system now supports file uploads for product images instead of just URLs.

## API Endpoints

### Create Product with Images

**Endpoint:** `POST /api/products`

**Authentication:** Required (Admin only)

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field | Type | Description |
|-------|------|-------------|
| name | String | Product name |
| description | String | Product description |
| price | Number | Product price |
| category | String | Product category (Tumblers, Ceramics) |
| stock | Number | Stock quantity |
| dimensions | String | Product dimensions |
| weight | String | Product weight |
| colors | Array | Product colors |
| materials | Array | Product materials |
| care | String | Care instructions |
| productImages | Files | Product images (up to 10) - recommended field name |
| images | Files | Product images (up to 10) - alternative field name |
| primaryImage | File | Primary product image (optional) |
| tags | Array | Product tags |
| featured | Boolean | Whether the product is featured |
| new | Boolean | Whether the product is new |
| bestseller | Boolean | Whether the product is a bestseller |
| isActive | Boolean | Whether the product is active |
| seoTitle | String | SEO title |
| seoDescription | String | SEO description |
| seoKeywords | Array | SEO keywords |

**Example Request:**

```
curl -X POST \
  https://api.metalandlace.com/api/products \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'name=Ceramic Mug' \
  -F 'description=A beautiful handcrafted ceramic mug' \
  -F 'price=25.99' \
  -F 'category=Ceramics' \
  -F 'stock=10' \
  -F 'dimensions=4x3x5 inches' \
  -F 'weight=12 oz' \
  -F 'colors[]=Blue' \
  -F 'colors[]=White' \
  -F 'materials[]=Ceramic' \
  -F 'care=Hand wash only' \
  -F 'productImages=@/path/to/image1.jpg' \
  -F 'productImages=@/path/to/image2.jpg' \
  -F 'primaryImage=@/path/to/primary.jpg' \
  -F 'tags[]=mug' \
  -F 'tags[]=ceramic' \
  -F 'featured=true' \
  -F 'new=true'
```

### Update Product with Images

**Endpoint:** `PATCH /api/products/:id`

**Authentication:** Required (Admin only)

**Content-Type:** `multipart/form-data`

**Request Body:**

Same fields as the create endpoint. You only need to include the fields you want to update.

**Example Request:**

```
curl -X PATCH \
  https://api.metalandlace.com/api/products/123456789 \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'name=Updated Ceramic Mug' \
  -F 'price=29.99' \
  -F 'productImages=@/path/to/new_image.jpg'
```

## Image Processing

When you upload images, the system will:

1. Resize the images to optimize them for web display
2. Upload them to Cloudinary for storage and CDN delivery
3. Generate multiple variants of each image (thumbnail, medium, large, original)
4. Associate the images with the product

## Response Format

The API will return the created or updated product with the processed images:

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "123456789",
      "name": "Ceramic Mug",
      "description": "A beautiful handcrafted ceramic mug",
      "price": 25.99,
      "images": [
        {
          "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/seramic-shop/products/product-1234567890-primary.jpg",
          "publicId": "seramic-shop/products/product-1234567890-primary",
          "isPrimary": true,
          "alt": "Ceramic Mug",
          "variants": {
            "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/w_150,h_150,c_fill,q_auto/seramic-shop/products/product-1234567890-primary.jpg",
            "medium": "https://res.cloudinary.com/your-cloud/image/upload/w_400,h_400,c_limit,q_auto/seramic-shop/products/product-1234567890-primary.jpg",
            "large": "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_800,c_limit,q_auto/seramic-shop/products/product-1234567890-primary.jpg",
            "original": "https://res.cloudinary.com/your-cloud/image/upload/q_auto/seramic-shop/products/product-1234567890-primary.jpg"
          }
        },
        {
          "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/seramic-shop/products/product-1234567890-0.jpg",
          "publicId": "seramic-shop/products/product-1234567890-0",
          "isPrimary": false,
          "alt": "Ceramic Mug",
          "variants": {
            "thumbnail": "https://res.cloudinary.com/your-cloud/image/upload/w_150,h_150,c_fill,q_auto/seramic-shop/products/product-1234567890-0.jpg",
            "medium": "https://res.cloudinary.com/your-cloud/image/upload/w_400,h_400,c_limit,q_auto/seramic-shop/products/product-1234567890-0.jpg",
            "large": "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_800,c_limit,q_auto/seramic-shop/products/product-1234567890-0.jpg",
            "original": "https://res.cloudinary.com/your-cloud/image/upload/q_auto/seramic-shop/products/product-1234567890-0.jpg"
          }
        }
      ],
      // Other product fields...
    }
  }
}
```

## Notes

- Maximum file size: 10MB per image
- Supported formats: JPG, JPEG, PNG, WebP
- Maximum number of images per product: 10