// controllers/cartController.js (REFACTORED WITH ASYNC/AWAIT)

import pool from '../config/db.js';

// --- HELPER FUNCTION to get stock quantity ---
const getProductStock = async (conn, productId, productTable) => {
    const table = productTable === 'products' ? 'products' : 'shop_products';
    const stockQuery = `SELECT stockQuantity, inStock FROM ${table} WHERE id = ?`;
    const [productRows] = await conn.query(stockQuery, [productId]);
    if (productRows.length === 0) {
        throw new Error('Product not found');
    }
    return productRows[0];
};

// @desc    Add an item to the cart (NOW WITH STOCK VALIDATION)
// @route   POST /api/cart
export const addItemToCart = async (req, res) => {
    const { productId, quantity, productTable } = req.body;
    const userId = req.userId;
    let connection;

    try {
        if (!productId || !quantity || !productTable || !['products', 'shop_products'].includes(productTable)) {
            return res.status(400).json({ message: 'Invalid request parameters.' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Get Product Stock
        const productInfo = await getProductStock(connection, productId, productTable);
        if (!productInfo.inStock || productInfo.stockQuantity <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Product is out of stock.' });
        }

        // 2. Check if item already in cart
        const [existingCartItem] = await connection.query(
            'SELECT quantity FROM cart WHERE user_id = ? AND product_id = ? AND product_table = ?',
            [userId, productId, productTable]
        );
        
        const currentQuantityInCart = existingCartItem.length > 0 ? existingCartItem[0].quantity : 0;
        const newTotalQuantity = currentQuantityInCart + quantity;

        // 3. Validate against stock
        if (newTotalQuantity > productInfo.stockQuantity) {
            await connection.rollback();
            return res.status(400).json({ message: 'Cannot add more than available stock' });
        }

        // 4. Insert or Update cart
        const upsertQuery = `
            INSERT INTO cart (user_id, product_id, product_table, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
        `;
        await connection.query(upsertQuery, [userId, productId, productTable, quantity]);

        await connection.commit();
        res.status(201).json({ message: 'Item added to cart successfully.' });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error adding item to cart:', err);
        res.status(500).json({ message: 'Server error while adding to cart.' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get all items from the user's cart (NOW INCLUDES stockQuantity)
// @route   GET /api/cart
export const getCartItems = async (req, res) => {
    try {
        const userId = req.userId;

        const query = `
            SELECT
                c.id AS cart_item_id, c.quantity, c.product_table,
                p.id, p.name, p.price, p.currency, p.inStock, p.description, p.image1, p.image2,
                p.stockQuantity  -- Added stockQuantity
            FROM cart c JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ? AND c.product_table = 'products'
            UNION ALL
            SELECT
                c.id AS cart_item_id, c.quantity, c.product_table,
                sp.id, sp.name, sp.price, 'BHD' as currency, sp.inStock, sp.description,
                sp.image AS image1, NULL AS image2,
                sp.stockQuantity -- Added stockQuantity
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

// @desc    Update quantity of a specific cart item (NOW WITH STOCK VALIDATION)
// @route   PUT /api/cart/:cartItemId
export const updateCartItemQuantity = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;
    let connection;

    try {
        const requestedQuantity = parseInt(quantity, 10);
        if (isNaN(requestedQuantity) || requestedQuantity < 1) {
            return res.status(400).json({ message: 'A valid quantity is required.' });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Get the cart item's product info
        const [cartRows] = await connection.query(
            'SELECT product_id, product_table FROM cart WHERE id = ? AND user_id = ?',
            [cartItemId, userId]
        );

        if (cartRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Cart item not found.' });
        }
        const { product_id, product_table } = cartRows[0];

        // 2. Get the product's stock
        const productInfo = await getProductStock(connection, product_id, product_table);
        
        // 3. Validate requested quantity against stock
        if (requestedQuantity > productInfo.stockQuantity) {
            await connection.rollback();
            return res.status(400).json({ 
                message: `Only ${productInfo.stockQuantity} items are available in stock.` 
            });
        }
        
        // 4. If validation passes, update the cart
        const updateQuery = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';
        await connection.query(updateQuery, [requestedQuantity, cartItemId, userId]);

        await connection.commit();
        res.status(200).json({ message: 'Cart updated.' });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('Error updating cart item:', err);
        res.status(500).json({ message: 'Server error while updating cart.' });
    } finally {
        if (connection) connection.release();
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