// controllers/shopCategoryController.js (REFACTORED WITH ASYNC/AWAIT)

import db from '../config/db.js'; // Note: We're using 'db' as the variable name since that's what you used. It refers to the pool.

// @desc    Get all shop categories
// @route   GET /api/shop/categories
export const getAllShopCategories = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM shop_categories ORDER BY name ASC'); // <-- Use await
        res.json(results);
    } catch (err) { // <-- Catch any errors
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a new shop category
// @route   POST /api/shop/categories
export const createShopCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const [result] = await db.query('INSERT INTO shop_categories SET ?', { name });
        res.status(201).json({ id: result.insertId, name });

    } catch (err) {
        // Handle specific DB errors like duplicate entries
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Category name already exists.' });
        }
        console.error('Error creating category:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a shop category
// @route   PUT /api/shop/categories/:id
export const updateShopCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const [result] = await db.query('UPDATE shop_categories SET name = ? WHERE id = ?', [name, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json({ id, name });

    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a shop category (WITH TRANSACTION)
// @route   DELETE /api/shop/categories/:id
export const deleteShopCategory = async (req, res) => {
    const { id } = req.params;
    let connection; // Declare connection here so it's accessible in finally block

    try {
        // 1. Get a single connection from the pool for the transaction
        connection = await db.getConnection(); 

        // 2. Start the transaction on that specific connection
        await connection.beginTransaction();

        // 3. Delete all products associated with this category ID
        await connection.query('DELETE FROM shop_products WHERE categoryId = ?', [id]);
        
        // 4. Delete the category itself
        const [categoryResult] = await connection.query('DELETE FROM shop_categories WHERE id = ?', [id]);

        if (categoryResult.affectedRows === 0) {
            // If the category didn't exist, nothing was changed. Roll back and send a 404.
            await connection.rollback();
            return res.status(404).json({ message: 'Category not found' });
        }

        // 5. If both queries were successful, commit the transaction
        await connection.commit();
        
        res.json({ message: 'Category and all its products deleted successfully' });

    } catch (err) {
        // If any error occurred, roll back the transaction
        if (connection) {
            await connection.rollback();
        }
        console.error("Transaction Error:", err);
        res.status(500).json({ error: 'Failed to complete delete operation.' });

    } finally {
        // 6. VERY IMPORTANT: Always release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};