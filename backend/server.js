require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');

// Initialize database connection
const { sequelize } = require('./config/database');

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Database models synchronized');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// Import routes
const ministryRoutes = require('./routes/ministryRoutes');
const sermonRoutes = require('./routes/sermonRoutes');
const eventRoutes = require('./routes/eventRoutes');
const missionVisionRoutes = require('./routes/missionVisionRoutes');
const pastorInfoRoutes = require('./routes/pastorInfoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const churchHistoryRoutes = require('./routes/churchHistoryRoutes');
const churchInfoRoutes = require('./routes/churchInfoRoutes');
const beliefRoutes = require('./routes/beliefRoutes');
const coreValueRoutes = require('./routes/coreValueRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Initialize express app
const app = express();
let server; // Declare server at module scope

// Test database connection on startup
app.use(async (req, res, next) => {
  if (!app.get('dbConnected')) {
    const isConnected = await testConnection();
    app.set('dbConnected', isConnected);
    
    if (!isConnected) {
      return res.status(503).json({ 
        success: false, 
        message: 'Database connection failed. Please try again later.' 
      });
    }
  }
  next();
});

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      console.log(`Allowing CORS for origin: ${origin}`);
      return callback(null, true);
    }
    
    // In production, use the configured allowed origins
    const allowedOrigins = process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(url => url.trim())
      : [];
      
    if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
      console.warn('No CLIENT_URL environment variable set in production!');
      return callback(new Error('Server misconfiguration'), false);
    }
    
    if (origin && allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  optionsSuccessStatus: 204,
  maxAge: 600, // 10 minutes
  preflightContinue: false
};

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} [${req.ip}]`);
  console.log('Headers:', req.headers);
  next();
});

// Enable pre-flight across-the-board
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  responseOnLimit: 'File size is too large. Maximum size is 10MB.',
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Ensure uploads directories exist
const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
};

const uploadsBaseDir = path.join(__dirname, 'public', 'uploads');
const uploadDirs = [
  uploadsBaseDir,
  path.join(uploadsBaseDir, 'ministries'),
  path.join(uploadsBaseDir, 'blogs')
];

uploadDirs.forEach(dir => createDirIfNotExists(dir));

// Make uploads folder static
app.use('/uploads', express.static(uploadsBaseDir));

// API Routes
app.use('/api/ministries', ministryRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mission-vision', missionVisionRoutes);
app.use('/api/pastors', pastorInfoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/church-history', churchHistoryRoutes);
app.use('/api/church-info', churchInfoRoutes);
app.use('/api/beliefs', beliefRoutes);
app.use('/api/core-values', coreValueRoutes);
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Not Found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  // Default error handler
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

// Start the server after ensuring database connection
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to the database. Exiting...');
      process.exit(1);
    }
    
    const HOST = process.env.HOST || '0.0.0.0';
    server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 CORS allowed origin: ${corsOptions.origin}`);
      console.log('✅ Server is ready to handle requests');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  } else {
    console.log('💥 Process terminated (no server to close)!');
    process.exit(0);
  }
});

module.exports = { app, server };