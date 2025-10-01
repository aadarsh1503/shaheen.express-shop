// controllers/shopProductController.js
import db from '../config/db.js';
import imagekit from '../config/imagekit.js';

// Helper function to upload to ImageKit
const uploadToImageKit = async (file) => {
  if (!file) return null;
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/shop_products', // Using a different folder for organization
    });
    return response.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error('Failed to upload image');
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
// @desc    Get shop products by category
// @route   GET /api/shop/products/category/:categoryId
export const getShopProductsByCategory = (req, res) => {
  const { categoryId } = req.params;
  const query = 'SELECT * FROM shop_products WHERE categoryId = ? ORDER BY createdAt DESC';
  
  db.query(query, [categoryId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// @desc    Create a new shop product
// @route   POST /api/shop/products
export const createShopProduct = async (req, res) => {
    try {
      // MODIFIED: Destructure description
      const { name, price, inStock, categoryId, description } = req.body;
      if (!name || !price || !categoryId) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
      }
      const imageUrl = await uploadToImageKit(req.files?.image?.[0]);
  
      // MODIFIED: Add description to the new product object
      const newProduct = { 
          name, 
          price, 
          inStock: inStock === 'true', 
          categoryId, 
          description: description || '', // Add description
          image: imageUrl 
      };
  
      db.query('INSERT INTO shop_products SET ?', newProduct, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ...newProduct });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
export const searchShopProducts = (req, res) => {
    const { q } = req.query;
  
    // If the query is missing or empty, return an empty array
    if (!q) {
      return res.json([]);
    }
  
    const sql = `
      SELECT sp.*, sc.name AS categoryName 
      FROM shop_products AS sp 
      LEFT JOIN shop_categories AS sc ON sp.categoryId = sc.id 
      WHERE sp.name LIKE ? 
      ORDER BY sp.createdAt DESC
    `;
  
    const params = [`%${q}%`];
  
    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  };
  export const getShopProductById = (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT sp.*, sc.name AS categoryName 
      FROM shop_products AS sp 
      LEFT JOIN shop_categories AS sc ON sp.categoryId = sc.id 
      WHERE sp.id = ?
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Shop product not found' });
      }
      res.json(results[0]);
    });
  };
// @desc    Update a shop product
// @route   PUT /api/shop/products/:id
export const updateShopProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // MODIFIED: Destructure description
        const { name, price, inStock, categoryId, description, existingImage } = req.body;
        
        const newImageUrl = await uploadToImageKit(req.files?.image?.[0]);
        
        // MODIFIED: Add description to the updated product object
        const updatedProduct = { 
            name, 
            price, 
            inStock: inStock === 'true', 
            categoryId, 
            description: description || '', // Add description
            image: newImageUrl || existingImage 
        };

        db.query('UPDATE shop_products SET ? WHERE id = ?', [updatedProduct, id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
            res.json({ id, ...updatedProduct });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductsByCategory = (req, res) => {
    const { categoryId } = req.params; // Get categoryId from the URL
  
    const query = 'SELECT * FROM shop_products WHERE categoryId = ?';
  
    db.query(query, [categoryId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // It's okay if results are empty, it just means no products are in that category yet
      res.json(results);
    });
  };
// @desc    Delete a shop product
// @route   DELETE /api/shop/products/:id
export const deleteShopProduct = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM shop_products WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  });
};