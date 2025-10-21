// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import productRoutes from './routes/productRoutes.js';

// Our new shop routes
import shopCategoryRoutes from './routes/shopCategoryRoutes.js';
import shopProductRoutes from './routes/shopProductRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();
const app = express();


// const allowedOrigins = [
 
//   'https://shaheen-express-shop.vercel.app',
// 'https://shaheen.express/',
//   'http://localhost:5173',
//   'https://shaheen.express/'
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// };

// ✅ Allow your frontend domain
app.use(cors({
  origin: ["https://shaheen.express",
    "https://shaheen-express-shop.vercel.app",
"https://shaheen.express/",
  "http://localhost:5173",
  "https://shaheen.express/"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Optional: handle preflight (OPTIONS)
//app.options('*', cors());


//app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/shop/categories', shopCategoryRoutes);
app.use('/api/shop/products', shopProductRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes); 
app.use('/api/cart', cartRoutes);

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