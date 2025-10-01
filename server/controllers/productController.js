// controllers/productController.js (REFACTORED WITH ASYNC/AWAIT)

import db from '../config/db.js';
import imagekit from '../config/imagekit.js';

// --- Helper function for ImageKit upload ---
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


// @desc    Get all products (with search functionality)
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
    try {
        const { q } = req.query;

        let sql = 'SELECT * FROM products';
        const params = [];

        if (q) {
            sql += ' WHERE name LIKE ?';
            params.push(`%${q}%`);
        }

        sql += ' ORDER BY createdAt DESC';

        const [results] = await db.query(sql, params);
        res.json(results);

    } catch (err) {
        console.error('Error fetching all products:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(results[0]);

    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const { name, price, currency, inStock, description } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        // Upload images and get URLs
        const image1Url = await uploadToImageKit(req.files?.image1?.[0]);
        const image2Url = await uploadToImageKit(req.files?.image2?.[0]);

        const newProduct = {
            name,
            price,
            currency: currency || 'BHD',
            inStock: inStock === 'true',
            description: description || '',
            image1: image1Url,
            image2: image2Url,
        };

        // Insert into database using await
        const [result] = await db.query('INSERT INTO products SET ?', newProduct);
        
        res.status(201).json({ id: result.insertId, ...newProduct });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all products with category info
// @route   GET /api/shop/products (Assuming this is the route)
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
        console.error('Error fetching shop products:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, currency, inStock, description, existingImage1, existingImage2 } = req.body;
        
        const newImage1Url = await uploadToImageKit(req.files?.image1?.[0]);
        const newImage2Url = await uploadToImageKit(req.files?.image2?.[0]);
        
        const updatedProduct = {
            name,
            price,
            currency,
            inStock: inStock === 'true',
            description: description || '',
            image1: newImage1Url || existingImage1,
            image2: newImage2Url || existingImage2,
        };

        // Update database using await
        const [result] = await db.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ id, ...updatedProduct });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });

    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: err.message });
    }
};