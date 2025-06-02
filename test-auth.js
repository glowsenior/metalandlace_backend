const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

// Test user credentials
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Password123!',
  passwordConfirm: 'Password123!'
};

// Function to register a new user
async function register() {
  try {
    console.log('Registering a new user...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('Registration successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to login
async function login() {
  try {
    console.log('Logging in...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Function to get current user profile
async function getProfile(token) {
  try {
    console.log('Getting user profile...');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Profile retrieved successfully!');
    console.log('User:', response.data.data.user);
    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error.response?.data || error.message);
    return null;
  }
}

// Function to test protected routes
async function testProtectedRoute(token) {
  try {
    console.log('Testing protected route (get all users)...');
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Protected route accessed successfully!');
    return true;
  } catch (error) {
    console.error('Failed to access protected route:', error.response?.data || error.message);
    return false;
  }
}

// Main function to run all tests
async function runTests() {
  console.log('=== STARTING AUTH TESTS ===');
  
  // Try to register
  let token = await register();
  
  // If registration fails (maybe user already exists), try login
  if (!token) {
    token = await login();
  }
  
  if (token) {
    // Test getting user profile
    await getProfile(token);
    
    // Test accessing protected route
    await testProtectedRoute(token);
  }
  
  console.log('=== AUTH TESTS COMPLETED ===');
}

// Run the tests
runTests();