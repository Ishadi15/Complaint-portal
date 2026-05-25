const mysql = require("mysql2");
require("dotenv").config();

// Using a pool is better for handling multiple connections
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 🎯 This bypasses the self-signed certificate error on Vercel/Railway
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: false
  },
  // Prevent timeout issues
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("Database Connection Failed ❌");
    console.log(err);
  } else {
    console.log("MySQL Connected ✅");
    connection.release();
  }
});

module.exports = db;