// controllers/shopProductController.js (COMPLETE AND REFACTORED)

import db from '../config/db.js';
import imagekit from '../config/imagekit.js';

// Helper function to upload to ImageKit (this was already correct)
const uploadToImageKit = async (file) => {
  if (!file) return null;
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: '/shop_products',
    });
    return response.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error('Failed to upload image');
  }
};

// --- CONTROLLERS ---

export const getAllShopProducts = async (req, res) => {
    try {
        const query = `
            SELECT sp.*, sc.name AS categoryName 
            FROM shop_products AS sp 
            LEFT JOIN shop_categories AS sc ON sp.categoryId = sc.id 
            ORDER BY sp.createdAt DESC
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching all shop products:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getShopProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const query = 'SELECT * FROM shop_products WHERE categoryId = ? ORDER BY createdAt DESC';
        const [results] = await db.query(query, [categoryId]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching shop products by category:", err);
        res.status(500).json({ error: err.message });
    }
};

export const createShopProduct = async (req, res) => {
    try {
        const { name, price, inStock, categoryId, description } = req.body;
        if (!name || !price || !categoryId) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }
        
        const imageUrl = await uploadToImageKit(req.files?.image?.[0]);

        const newProduct = { 
            name, 
            price, 
            inStock: inStock === 'true', 
            categoryId, 
            description: description || '',
            image: imageUrl 
        };

        const [result] = await db.query('INSERT INTO shop_products SET ?', newProduct);
        res.status(201).json({ id: result.insertId, ...newProduct });

    } catch (error) {
        console.error("Error creating shop product:", error);
        res.status(500).json({ error: error.message });
    }
};

export const searchShopProducts = async (req, res) => {
    try {
        const { q } = req.query;
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

        const [results] = await db.query(sql, params);
        res.json(results);

    } catch (err) {
        console.error("Error searching shop products:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getShopProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT sp.*, sc.name AS categoryName 
            FROM shop_products AS sp 
            LEFT JOIN shop_categories AS sc ON sp.categoryId = sc.id 
            WHERE sp.id = ?
        `;
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Shop product not found' });
        }
        res.json(results[0]);

    } catch (err) {
        console.error("Error fetching shop product by ID:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateShopProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, inStock, categoryId, description, existingImage } = req.body;
        
        const newImageUrl = await uploadToImageKit(req.files?.image?.[0]);
        
        const updatedProduct = { 
            name, 
            price, 
            inStock: inStock === 'true', 
            categoryId, 
            description: description || '',
            image: newImageUrl || existingImage 
        };

        const [result] = await db.query('UPDATE shop_products SET ? WHERE id = ?', [updatedProduct, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id, ...updatedProduct });

    } catch (error) {
        console.error("Error updating shop product:", error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get products by category ID
// @route   GET /api/products/category/:categoryId (Example route)
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const query = 'SELECT * FROM shop_products WHERE categoryId = ?';
        const [results] = await db.query(query, [categoryId]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching products by category:", err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteShopProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM shop_products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });

    } catch (err) {
        console.error("Error deleting shop product:", err);
        res.status(500).json({ error: err.message });
    }
};