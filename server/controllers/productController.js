import db from '../config/db.js';

// @desc    Get all products
// @route   GET /api/products
export const getAllProducts = (req, res) => {
  // Get the search query 'q' from the URL (e.g., /api/products?q=shirt)
  const { q } = req.query;

  let sql = 'SELECT * FROM products';
  const params = []; // Use params to prevent SQL injection

  // If a search query is provided, add a WHERE clause
  if (q) {
    sql += ' WHERE name LIKE ?';
    params.push(`%${q}%`); // The '%' are wildcards for partial matching
  }

  sql += ' ORDER BY createdAt DESC';

  // Execute the final query (which is now dynamic)
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};


export const getProductById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(results[0]);
  });
};



import imagekit from '../config/imagekit.js';


const uploadToImageKit = async (file) => {
  if (!file) return null;
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/products', 
    });
    return response.url; 
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error('Failed to upload image');
  }
};


export const createProduct = async (req, res) => {
  try {
    // MODIFIED: Destructure description from the body
    const { name, price, currency, inStock, description } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const image1Url = await uploadToImageKit(req.files?.image1?.[0]);
    const image2Url = await uploadToImageKit(req.files?.image2?.[0]);

    // MODIFIED: Add description to the new product object
    const newProduct = {
      name,
      price,
      currency: currency || 'BHD',
      inStock: inStock === 'true', 
      description: description || '', // Add description, default to empty string
      image1: image1Url,
      image2: image2Url,
    };

    db.query('INSERT INTO products SET ?', newProduct, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...newProduct });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllShopProducts = (req, res) => {
  
  const query = `
    SELECT sp.*, sc.name AS categoryName 
    FROM shop_products AS sp 
    LEFT JOIN shop_categories AS sc ON sp.categoryId = sc.id 
    ORDER BY sp.createdAt DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // MODIFIED: Destructure description from the body
    const { name, price, currency, inStock, description, existingImage1, existingImage2 } = req.body;
    
    const newImage1Url = await uploadToImageKit(req.files?.image1?.[0]);
    const newImage2Url = await uploadToImageKit(req.files?.image2?.[0]);
    
    // MODIFIED: Add description to the updated product object
    const updatedProduct = {
      name,
      price,
      currency,
      inStock: inStock === 'true',
      description: description || '', // Add description
      image1: newImage1Url || existingImage1,
      image2: newImage2Url || existingImage2,
    };

    db.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ id, ...updatedProduct });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
};