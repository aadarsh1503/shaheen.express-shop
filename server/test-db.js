import db from './config/db.js';

async function checkDatabase() {
  try {
    console.log('🔍 Checking orders table structure...\n');
    
    // Check if orders table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'orders'");
    
    if (tables.length === 0) {
      console.log('❌ Orders table does not exist!');
      console.log('📝 Please run the SQL schema file: server/database/orders_schema.sql\n');
      process.exit(1);
    }
    
    console.log('✅ Orders table exists\n');
    
    // Get table structure
    const [columns] = await db.query('SHOW COLUMNS FROM orders');
    
    console.log('📋 Orders table columns:');
    console.log('========================');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('\n🔍 Checking order_items table structure...\n');
    
    // Check order_items table
    const [itemTables] = await db.query("SHOW TABLES LIKE 'order_items'");
    
    if (itemTables.length === 0) {
      console.log('❌ Order_items table does not exist!');
      console.log('📝 Please run the SQL schema file: server/database/orders_schema.sql\n');
      process.exit(1);
    }
    
    console.log('✅ Order_items table exists\n');
    
    const [itemColumns] = await db.query('SHOW COLUMNS FROM order_items');
    
    console.log('📋 Order_items table columns:');
    console.log('==============================');
    itemColumns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('\n✅ Database structure check complete!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    process.exit(1);
  }
}

checkDatabase();
