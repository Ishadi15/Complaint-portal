const mysql = require("mysql2");
require("dotenv").config();

// Determine SSL config: Railway public connections typically don't need SSL
// Set DB_SSL=false in your Vercel env vars to disable SSL entirely
const sslConfig = process.env.DB_SSL === 'false'
  ? false
  : { rejectUnauthorized: false };

// Using a pool is better for handling multiple connections
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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