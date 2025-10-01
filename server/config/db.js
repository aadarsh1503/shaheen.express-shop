// config/db.js (NEW AND IMPROVED)

import mysql from "mysql2/promise"; // <-- IMPORTANT: Use 'mysql2/promise' for async/await
import dotenv from "dotenv";

dotenv.config();

// Create the connection POOL. The pool manages multiple connections and handles timeouts automatically.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  
  connectionLimit: 10,      
  queueLimit: 0,             
});

// A simple check to see if the pool is able to get a connection
pool.getConnection()
  .then(connection => {
    console.log("✅ Connected to MySQL database via connection pool");
    connection.release(); // IMPORTANT: release the connection back to the pool
  })
  .catch(err => {
    console.error("❌ MySQL Pool Connection Error:", err.message);
  });

export default pool;