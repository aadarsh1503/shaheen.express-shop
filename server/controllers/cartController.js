// controllers/cartController.js (REFACTORED WITH ASYNC/AWAIT)

import pool from '../config/db.js';

// @desc    Add an item to the cart
// @route   POST /api/cart
export const addItemToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity, productTable } = req.body;

        if (!productId || !quantity || !productTable) {
            return res.status(400).json({ message: 'Product ID, quantity, and product table are required.' });
        }

        if (productTable !== 'products' && productTable !== 'shop_products') {
            return res.status(400).json({ message: 'Invalid product table specified.' });
        }

        const query = `
            INSERT INTO cart (user_id, product_id, product_table, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
        `;

        await pool.query(query, [userId, productId, productTable, quantity]);
        
        res.status(201).json({ message: 'Item added to cart successfully.' });

    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ message: 'Server error while adding to cart.' });
    }
};

// @desc    Get all items from the user's cart
// @route   GET /api/cart
export const getCartItems = async (req, res) => {
    try {
        const userId = req.userId;

        const query = `
            SELECT
                c.id AS cart_item_id, c.quantity, c.product_table,
                p.id, p.name, p.price, p.currency, p.inStock, p.description, p.image1, p.image2
            FROM cart c JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ? AND c.product_table = 'products'
            UNION ALL
            SELECT
                c.id AS cart_item_id, c.quantity, c.product_table,
                sp.id, sp.name, sp.price, 'BHD' as currency, sp.inStock, sp.description,
                sp.image AS image1, NULL AS image2
            FROM cart c JOIN shop_products sp ON c.product_id = sp.id
            WHERE c.user_id = ? AND c.product_table = 'shop_products';
        `;

        const [results] = await pool.query(query, [userId, userId]);
        res.status(200).json(results);

    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).json({ message: 'Server error while fetching cart.' });
    }
};

// @desc    Update quantity of a specific cart item
// @route   PUT /api/cart/:cartItemId
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        const userId = req.userId;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'A valid quantity is required.' });
        }

        const query = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';
        const [result] = await pool.query(query, [quantity, cartItemId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found for this user.' });
        }

        res.status(200).json({ message: 'Cart updated.' });

    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ message: 'Server error while updating cart.' });
    }
};

// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/:cartItemId
export const removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.userId;

        const query = 'DELETE FROM cart WHERE id = ? AND user_id = ?';
        const [result] = await pool.query(query, [cartItemId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found for this user.' });
        }

        res.status(200).json({ message: 'Item removed from cart.' });

    } catch (err) {
        console.error('Error removing cart item:', err);
        res.status(500).json({ message: 'Server error while removing item.' });
    }
};

// @desc    Clear the entire cart for a user
// @route   DELETE /api/cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.userId;
        const query = 'DELETE FROM cart WHERE user_id = ?';
        await pool.query(query, [userId]);
        
        res.status(200).json({ message: 'Cart cleared.' });

    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ message: 'Error clearing cart.' });
    }
};