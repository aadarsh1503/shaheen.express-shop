// config/db.js (FIXED - Removed deprecated options)

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create the connection POOL with only supported options
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  connectionLimit: 10,      
  queueLimit: 0,
  // Keep-alive settings (supported)
  keepAliveInitialDelay: 0,
  enableKeepAlive: true,
  // Connection timeout (supported)
  connectTimeout: 30000,      // 30 seconds to establish connection
  // Query timeout (supported)
  queryTimeout: 60000,        // 60 seconds for queries
});

// Test the pool connection
pool.getConnection()
  .then(connection => {
    console.log("✅ Connected to MySQL database via connection pool");
    connection.release();
  })
  .catch(err => {
    console.error("❌ MySQL Pool Connection Error:", err.message);
  });

export default pool;