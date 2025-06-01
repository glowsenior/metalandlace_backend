#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Initializing Git repository for Seramic Backend...\n');

try {
  // Check if git is installed
  execSync('git --version', { stdio: 'ignore' });
  console.log('✅ Git is installed');
} catch (error) {
  console.error('❌ Git is not installed. Please install Git first.');
  process.exit(1);
}

try {
  // Check if already a git repository
  if (fs.existsSync('.git')) {
    console.log('ℹ️  Git repository already exists');
  } else {
    // Initialize git repository
    execSync('git init', { stdio: 'inherit' });
    console.log('✅ Git repository initialized');
  }

  // Check if .gitignore exists
  if (fs.existsSync('.gitignore')) {
    console.log('✅ .gitignore file exists');
  } else {
    console.log('❌ .gitignore file not found');
  }

  // Check if .env.example exists
  if (fs.existsSync('.env.example')) {
    console.log('✅ .env.example file exists');
  } else {
    console.log('❌ .env.example file not found');
  }

  // Add all files
  console.log('\n📁 Adding files to git...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('✅ Files added to staging area');

  // Check git status
  console.log('\n📊 Git status:');
  execSync('git status --short', { stdio: 'inherit' });

  // Create initial commit
  console.log('\n💾 Creating initial commit...');
  const commitMessage = `🎉 Initial commit: Seramic Backend API

✅ Features included:
- Express.js server with security middleware
- MongoDB integration with Mongoose ODM
- Complete Product, User, Order models
- RESTful API endpoints with CRUD operations
- File upload system with Cloudinary integration
- JWT authentication structure
- Comprehensive error handling
- Database seeding with sample ceramic products
- Postman API collection for testing
- Production-ready configuration

🚀 Ready for development and deployment`;

  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  console.log('✅ Initial commit created');

  console.log('\n🎉 Git repository setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Create a repository on GitHub/GitLab/Bitbucket');
  console.log('2. Add remote origin:');
  console.log('   git remote add origin https://github.com/yourusername/seramic-backend.git');
  console.log('3. Push to remote:');
  console.log('   git branch -M main');
  console.log('   git push -u origin main');
  console.log('\n📖 See GIT_SETUP.md for detailed instructions');

} catch (error) {
  console.error('❌ Error during git setup:', error.message);
  process.exit(1);
}