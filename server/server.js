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
app.get("/", (_req, res) => {
  res.send("Backend server is running 🚀");
});

// DB Health & Diagnostics endpoint
app.get("/api/test-db", async (_req, res) => {
  const results = {};
  let hasError = false;

  console.log('\n🔍 ========== DB DIAGNOSTICS START ==========');

  // 1. Basic connectivity + server time
  try {
    const [[row]] = await db.query("SELECT NOW() AS currentTime, VERSION() AS version, DATABASE() AS dbName");
    results.connection = { ok: true, time: row.currentTime, version: row.version, database: row.dbName };
    console.log('✅ Connection OK | Time:', row.currentTime, '| Version:', row.version, '| DB:', row.dbName);
  } catch (err) {
    results.connection = { ok: false, error: err.message };
    console.error('❌ Connection FAILED:', err.message);
    hasError = true;
  }

  // 2. Pool status
  try {
    const pool = db.pool || db;
    results.pool = {
      connectionLimit: pool.config?.connectionLimit ?? pool.pool?.config?.connectionLimit ?? 'N/A',
      queueLimit: pool.config?.queueLimit ?? pool.pool?.config?.queueLimit ?? 'N/A',
    };
    console.log('📊 Pool config:', results.pool);
  } catch (err) {
    results.pool = { error: err.message };
  }

  // 3. Check key tables exist
  const tables = ['orders', 'order_items', 'users', 'shop_products', 'shop_categories', 'cart'];
  results.tables = {};
  for (const table of tables) {
    try {
      const [[{ count }]] = await db.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
      results.tables[table] = { ok: true, rows: count };
      console.log(`✅ Table '${table}': ${count} rows`);
    } catch (err) {
      results.tables[table] = { ok: false, error: err.message };
      console.error(`❌ Table '${table}' ERROR:`, err.message);
      hasError = true;
    }
  }

  // 4. MySQL process list (active queries)
  try {
    const [processes] = await db.query("SHOW PROCESSLIST");
    results.processlist = processes.map(p => ({
      id: p.Id, user: p.User, db: p.db,
      command: p.Command, time: p.Time, state: p.State,
      info: p.Info ? p.Info.substring(0, 100) : null
    }));
    console.log('📋 Active processes:', results.processlist.length);
    results.processlist.forEach(p => console.log(`   [${p.id}] ${p.command} | ${p.time}s | ${p.state || '-'} | ${p.info || '-'}`));
  } catch (err) {
    results.processlist = { error: err.message };
    console.warn('⚠️ PROCESSLIST not available:', err.message);
  }

  // 5. MySQL error log variables (shows log file path)
  try {
    const [vars] = await db.query("SHOW VARIABLES LIKE 'log_error'");
    results.errorLogPath = vars[0]?.Value || 'not set';
    console.log('📁 MySQL error log path:', results.errorLogPath);
  } catch (err) {
    results.errorLogPath = { error: err.message };
  }

  // 6. InnoDB status (crash/recovery info)
  try {
    const [[innoRow]] = await db.query("SHOW ENGINE INNODB STATUS");
    const status = innoRow?.Status || '';
    // Extract just the key sections to avoid huge output
    const sections = ['TRANSACTIONS', 'FILE I/O', 'BUFFER POOL', 'LOG', 'LATEST DETECTED DEADLOCK'];
    results.innodb = {};
    sections.forEach(section => {
      const idx = status.indexOf(section);
      if (idx !== -1) {
        results.innodb[section] = status.substring(idx, idx + 300).split('\n').slice(0, 5).join(' | ');
      }
    });
    console.log('🔧 InnoDB status sections captured:', Object.keys(results.innodb));
  } catch (err) {
    results.innodb = { error: err.message };
    console.warn('⚠️ InnoDB status not available:', err.message);
  }

  // 7. Recent orders (quick sanity check)
  try {
    const [recentOrders] = await db.query(
      "SELECT order_id, payment_status, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5"
    );
    results.recentOrders = recentOrders;
    console.log('🛒 Recent orders:', recentOrders.length);
    recentOrders.forEach(o => console.log(`   ${o.order_id} | ${o.payment_status} | ${o.order_status} | ${o.created_at}`));
  } catch (err) {
    results.recentOrders = { error: err.message };
    console.error('❌ Recent orders query failed:', err.message);
    hasError = true;
  }

  console.log('🔍 ========== DB DIAGNOSTICS END ==========\n');

  res.status(hasError ? 500 : 200).json({
    status: hasError ? '⚠️ Issues detected' : '✅ All checks passed',
    ...results
  });
});

// Global error handler — must return plain text for benefit-callback routes
// to prevent Express's default HTML error page from breaking the payment gateway
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Express error:', err.message);
  if (req.path.includes('benefit-callback')) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.set('Content-Type', 'text/plain');
    return res.status(200).send(`REDIRECT=${frontendUrl}/payment-callback?error=server_error&gateway=benefit`);
  }
  res.status(500).json({ success: false, message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});