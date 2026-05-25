const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');
const initDb = require('./config/initDb');

const app = express();

// Set CORS headers manually as middleware before anything else
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// CORS Configuration as fallback
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log("Current DB_HOST:", process.env.DB_HOST);
  console.log("Current DB_USER:", process.env.DB_USER);
  console.log("Current DB_NAME:", process.env.DB_NAME);
  console.log("Current DB_PORT:", process.env.DB_PORT);
  console.log("Current DB_PASSWORD Length:", process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

  res.json({ 
    status: 'ok', 
    db: process.env.DB_HOST ? 'configured' : 'not configured',
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_name: process.env.DB_NAME,
    db_port: process.env.DB_PORT,
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured'
  });
});

// API Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// Database Initialization and Server Startup
const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    console.log("Database schema check and seeding completed successfully.");
  })
  .catch((err) => {
    console.error("Database initialization failed but proceeding to start server:", err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });