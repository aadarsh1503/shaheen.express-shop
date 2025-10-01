import pool from '../config/db.js';

// @desc    Add an item to the cart (from any product table)
// @route   POST /api/cart
export const addItemToCart = (req, res) => {
    const userId = req.userId;
    // We now require productTable from the frontend
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

    pool.query(query, [userId, productId, productTable, quantity], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            return res.status(500).json({ message: 'Server error while adding to cart.' });
        }
        res.status(201).json({ message: 'Item added to cart successfully.' });
    });
};

// @desc    Get all items from the user's cart
// @route   GET /api/cart
export const getCartItems = (req, res) => {
    const userId = req.userId;

    // This powerful query uses UNION ALL to combine results from both product tables
    // into a single, clean list for the frontend.
    const query = `
        -- Query 1: Get cart items that are in the 'products' table
        SELECT
            c.id AS cart_item_id,
            c.quantity,
            c.product_table,
            p.id, p.name, p.price, p.currency, p.inStock, p.description, p.image1, p.image2
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND c.product_table = 'products'

        UNION ALL

        -- Query 2: Get cart items that are in the 'shop_products' table
        SELECT
            c.id AS cart_item_id,
            c.quantity,
            c.product_table,
            sp.id, sp.name, sp.price, 'BHD' as currency, sp.inStock, sp.description,
            sp.image AS image1, -- Aliasing 'image' to 'image1' for consistency
            NULL AS image2      -- Providing NULL for image2 for consistency
        FROM cart c
        JOIN shop_products sp ON c.product_id = sp.id
        WHERE c.user_id = ? AND c.product_table = 'shop_products';
    `;

    pool.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).json({ message: 'Server error while fetching cart.' });
        }
        res.status(200).json(results);
    });
};

// @desc    Update quantity of a specific cart item
// @route   PUT /api/cart/:cartItemId
export const updateCartItemQuantity = (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'A valid quantity is required.' });
    }

    const query = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';

    pool.query(query, [quantity, cartItemId, userId], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found or error updating.' });
        }
        res.status(200).json({ message: 'Cart updated.' });
    });
};


// @desc    Remove a single item from the cart
// @route   DELETE /api/cart/:cartItemId
export const removeCartItem = (req, res) => {
    const { cartItemId } = req.params;
    const userId = req.userId;

    const query = 'DELETE FROM cart WHERE id = ? AND user_id = ?';

    pool.query(query, [cartItemId, userId], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found or error removing.' });
        }
        res.status(200).json({ message: 'Item removed from cart.' });
    });
};

// @desc    Clear the entire cart for a user
// @route   DELETE /api/cart
export const clearCart = (req, res) => {
    const userId = req.userId;
    const query = 'DELETE FROM cart WHERE user_id = ?';
    pool.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error clearing cart.' });
        }
        res.status(200).json({ message: 'Cart cleared.' });
    });
};