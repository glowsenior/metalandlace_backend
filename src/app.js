const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Global Middlewares

// Implement CORS - more permissive for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add custom headers to allow CDN resources
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Set security HTTP headers with configurations that won't block static resources
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://cdn.gpteng.co", "data:", "ws:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.gpteng.co"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.gpteng.co"],
        imgSrc: ["'self'", "data:", "blob:", "https://lovable.dev", "https://cdn.gpteng.co"],
        fontSrc: ["'self'", "data:", "https://cdn.gpteng.co"],
        connectSrc: ["'self'", "https://cdn.gpteng.co", "ws:", "wss:"],
        frameSrc: ["'self'", "https://cdn.gpteng.co"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'price', 'rating']
}));

// Compression middleware
app.use(compression());

// Create a middleware to disable Helmet for static files
const disableHelmet = (req, res, next) => {
  res.removeHeader('Content-Security-Policy');
  next();
};

// Serve static files from the public directory at root URL path ('/')
// Apply the disableHelmet middleware to static files
app.use('/', disableHelmet, express.static(path.join(__dirname, '../public')));

// Explicitly handle the root route to serve index.html
app.get('/', disableHelmet, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);

// For any other routes that don't start with /api, serve the index.html (for client-side routing)
app.get(/^(?!\/api).*/, disableHelmet, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle undefined API routes
app.all('/api/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;