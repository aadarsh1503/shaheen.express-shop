// controllers/shopCategoryController.js
import db from '../config/db.js';

// @desc    Get all shop categories
// @route   GET /api/shop/categories
export const getAllShopCategories = (req, res) => {
  db.query('SELECT * FROM shop_categories ORDER BY name ASC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// @desc    Create a new shop category
// @route   POST /api/shop/categories
export const createShopCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  db.query('INSERT INTO shop_categories SET ?', { name }, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Category name already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, name });
  });
};

// @desc    Update a shop category
// @route   PUT /api/shop/categories/:id
export const updateShopCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  db.query('UPDATE shop_categories SET name = ? WHERE id = ?', [name, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ id, name });
  });
};

// @desc    Delete a shop category
// @route   DELETE /api/shop/categories/:id
export const deleteShopCategory = (req, res) => {
  const { id } = req.params;

  // Start a database transaction
  db.beginTransaction(err => {
    if (err) {
      console.error("Transaction Start Error:", err);
      return res.status(500).json({ error: 'Failed to start database transaction.' });
    }

    // Step 1: Delete all products associated with this category ID
    const deleteProductsQuery = 'DELETE FROM shop_products WHERE categoryId = ?';
    db.query(deleteProductsQuery, [id], (err, result) => {
      if (err) {
        // If this step fails, roll back the transaction
        return db.rollback(() => {
          console.error("Error deleting products in category:", err);
          res.status(500).json({ error: 'Failed to delete products in the category.' });
        });
      }

      // Step 2: Delete the category itself
      const deleteCategoryQuery = 'DELETE FROM shop_categories WHERE id = ?';
      db.query(deleteCategoryQuery, [id], (err, result) => {
        if (err) {
          // If this step fails, roll back the transaction
          return db.rollback(() => {
            console.error("Error deleting category:", err);
            res.status(500).json({ error: 'Failed to delete the category.' });
          });
        }
        
        if (result.affectedRows === 0) {
            // If the category didn't exist, we can still consider it a "success"
            // but we should roll back to be safe, as nothing was actually done.
            return db.rollback(() => {
                res.status(404).json({ message: 'Category not found' });
            });
        }

        // Step 3: If both steps were successful, commit the transaction
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error("Transaction Commit Error:", err);
              res.status(500).json({ error: 'Failed to commit the transaction.' });
            });
          }

          // Success!
          res.json({ message: 'Category and all its products deleted successfully' });
        });
      });
    });
  });
};