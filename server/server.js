// server.js
import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import productRoutes from './routes/productRoutes.js';

// Our new shop routes
import shopCategoryRoutes from './routes/shopCategoryRoutes.js';
import shopProductRoutes from './routes/shopProductRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import addressRoutes from './routes/addressRoutes.js';

dotenv.config();
const app = express();

// CORS removed - using Vite proxy instead

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/shop/categories', shopCategoryRoutes);
app.use('/api/shop/products', shopProductRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/addresses', addressRoutes);

// --- Test & Fallback Routes ---
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [results] = await db.query("SELECT NOW() AS currentTime");
    res.json({ message: "✅ Database connected!", time: results[0].currentTime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});