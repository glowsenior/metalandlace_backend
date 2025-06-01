const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: 'Vases',
    description: 'Beautiful ceramic vases for your home decoration',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Plates',
    description: 'Elegant ceramic plates for dining',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Bowls',
    description: 'Handcrafted ceramic bowls',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Cups',
    description: 'Ceramic cups and mugs',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Gifts',
    description: 'Perfect ceramic gifts for special occasions',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Decor',
    description: 'Decorative ceramic pieces',
    isActive: true,
    sortOrder: 6
  },
  {
    name: 'Sets',
    description: 'Complete ceramic sets',
    isActive: true,
    sortOrder: 7
  }
];

const products = [
  {
    name: 'Elegant Blue Ceramic Vase',
    description: 'A stunning handcrafted ceramic vase with beautiful blue glazing. Perfect for displaying fresh flowers or as a standalone decorative piece. Each piece is unique due to the artisanal crafting process.',
    price: 89.99,
    category: 'vases',
    stock: 15,
    dimensions: '12" H x 6" W',
    weight: '2.5 lbs',
    colors: ['Blue', 'Navy'],
    materials: ['Ceramic', 'Glaze'],
    care: 'Hand wash with mild soap. Not dishwasher safe.',
    tags: ['handcrafted', 'decorative', 'blue', 'elegant'],
    featured: true,
    new: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        alt: 'Elegant Blue Ceramic Vase',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Rustic Dinner Plate Set',
    description: 'Set of 4 rustic ceramic dinner plates with a beautiful matte finish. These plates bring warmth and character to any dining table. Microwave and dishwasher safe.',
    price: 124.99,
    category: 'plates',
    stock: 8,
    dimensions: '10.5" diameter',
    weight: '3.2 lbs per set',
    colors: ['Cream', 'Beige', 'Brown'],
    materials: ['Ceramic'],
    care: 'Dishwasher and microwave safe',
    tags: ['rustic', 'dinner', 'set', 'matte'],
    bestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800',
        alt: 'Rustic Dinner Plate Set',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Artisan Mixing Bowl',
    description: 'Large ceramic mixing bowl perfect for baking and cooking. Features a comfortable rim for easy handling and a non-slip base. The beautiful speckled glaze adds character to your kitchen.',
    price: 45.99,
    category: 'bowls',
    stock: 22,
    dimensions: '11" diameter x 5" H',
    weight: '2.8 lbs',
    colors: ['Speckled White', 'Gray'],
    materials: ['Ceramic', 'Speckled Glaze'],
    care: 'Dishwasher safe. Oven safe up to 350°F.',
    tags: ['mixing', 'baking', 'kitchen', 'artisan'],
    new: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586627001815-b8c8c7e8b3b3?w=800',
        alt: 'Artisan Mixing Bowl',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Handmade Coffee Mug',
    description: 'Cozy ceramic coffee mug with a comfortable handle and perfect size for your morning coffee. Each mug is individually crafted, making every piece unique.',
    price: 28.99,
    category: 'cups',
    stock: 35,
    dimensions: '4" H x 3.5" W',
    weight: '0.8 lbs',
    colors: ['Sage Green', 'Terracotta', 'Cream'],
    materials: ['Ceramic'],
    care: 'Microwave and dishwasher safe',
    tags: ['coffee', 'handmade', 'cozy', 'morning'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        alt: 'Handmade Coffee Mug',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Decorative Ceramic Sculpture',
    description: 'Modern abstract ceramic sculpture that adds artistic flair to any space. This unique piece showcases contemporary ceramic artistry with its flowing lines and organic form.',
    price: 156.99,
    discountPrice: 129.99,
    category: 'decor',
    stock: 5,
    dimensions: '8" H x 6" W x 4" D',
    weight: '3.5 lbs',
    colors: ['White', 'Cream'],
    materials: ['Ceramic'],
    care: 'Dust with soft cloth. Handle with care.',
    tags: ['sculpture', 'modern', 'abstract', 'art'],
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        alt: 'Decorative Ceramic Sculpture',
        isPrimary: true
      }
    ]
  },
  {
    name: 'Wedding Gift Tea Set',
    description: 'Elegant 6-piece ceramic tea set perfect for weddings or special occasions. Includes teapot, 4 cups, and serving tray. Beautifully packaged in a gift box.',
    price: 189.99,
    category: 'gifts',
    stock: 12,
    dimensions: 'Teapot: 6" H, Cups: 3" H',
    weight: '4.2 lbs',
    colors: ['White', 'Gold Trim'],
    materials: ['Fine Ceramic', 'Gold Accent'],
    care: 'Hand wash recommended for gold trim',
    tags: ['wedding', 'tea set', 'elegant', 'gift'],
    bestseller: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563822249366-6b5d2e9c0c6e?w=800',
        alt: 'Wedding Gift Tea Set',
        isPrimary: true
      }
    ]
  }
];

const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@seramicshop.com',
  password: 'Admin123!',
  passwordConfirm: 'Admin123!',
  role: 'admin',
  isEmailVerified: true,
  phone: '+1234567890'
};

const sampleCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'customer@example.com',
  password: 'Customer123!',
  passwordConfirm: 'Customer123!',
  role: 'customer',
  isEmailVerified: true,
  phone: '+1987654321'
};

// Seed functions
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.create(categories);
    console.log(`✅ ${createdCategories.length} categories created`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.create(products);
    console.log(`✅ ${createdProducts.length} products created`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    const users = await User.create([adminUser, sampleCustomer]);
    console.log(`✅ ${users.length} users created`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedReviews = async (products, users) => {
  try {
    await Review.deleteMany({});
    
    const sampleReviews = [
      {
        review: 'Absolutely beautiful vase! The blue color is stunning and the quality is excellent. Highly recommend!',
        rating: 5,
        title: 'Beautiful and high quality',
        product: products[0]._id,
        user: users[1]._id,
        verified: true,
        status: 'approved'
      },
      {
        review: 'Great plates for everyday use. Love the rustic look and they are very durable.',
        rating: 4,
        title: 'Perfect for daily use',
        product: products[1]._id,
        user: users[1]._id,
        verified: true,
        status: 'approved'
      },
      {
        review: 'This mixing bowl is perfect for all my baking needs. The size is just right and it looks great in my kitchen.',
        rating: 5,
        title: 'Perfect for baking',
        product: products[2]._id,
        user: users[1]._id,
        verified: true,
        status: 'approved'
      }
    ];

    const reviews = await Review.create(sampleReviews);
    console.log(`✅ ${reviews.length} reviews created`);
    return reviews;
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const categories = await seedCategories();
    const products = await seedProducts();
    const users = await seedUsers();
    const reviews = await seedReviews(products, users);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`Categories: ${categories?.length || 0}`);
    console.log(`Products: ${products?.length || 0}`);
    console.log(`Users: ${users?.length || 0}`);
    console.log(`Reviews: ${reviews?.length || 0}`);
    console.log('\n👤 Admin credentials:');
    console.log('Email: admin@seramicshop.com');
    console.log('Password: Admin123!');
    console.log('\n👤 Customer credentials:');
    console.log('Email: customer@example.com');
    console.log('Password: Customer123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };