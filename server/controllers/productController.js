// controllers/productController.js (REFACTORED WITH STOCK)

import db from "../config/db.js";
import imagekit from "../config/imagekit.js";

// --- Helper function for ImageKit upload ---
const uploadToImageKit = async (file) => {
  if (!file) return null;
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/products",
    });
    return response.url;
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    // MODIFIED: Added stockQuantity
    const { name, price, currency, description, stockQuantity } = req.body;

    if (!name || !price || stockQuantity === undefined) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock quantity are required" });
    }

    const image1Url = await uploadToImageKit(req.files?.image1?.[0]);
    const image2Url = await uploadToImageKit(req.files?.image2?.[0]);

    const stock = parseInt(stockQuantity, 10);
    const newProduct = {
      name,
      price,
      currency: currency || "BHD",
      // MODIFIED: inStock is derived
      inStock: stock > 0,
      description: description || "",
      image1: image1Url,
      image2: image2Url,
      // MODIFIED: Added stockQuantity
      stockQuantity: stock,
    };

    const [result] = await db.query("INSERT INTO products SET ?", newProduct);
    res.status(201).json({ id: result.insertId, ...newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // MODIFIED: Added stockQuantity
    const {
      name,
      price,
      currency,
      description,
      existingImage1,
      existingImage2,
      stockQuantity,
    } = req.body;

    const newImage1Url = await uploadToImageKit(req.files?.image1?.[0]);
    const newImage2Url = await uploadToImageKit(req.files?.image2?.[0]);

    const stock = parseInt(stockQuantity, 10);
    const updatedProduct = {
      name,
      price,
      currency,
      // MODIFIED: inStock is derived
      inStock: stock > 0,
      description: description || "",
      image1: newImage1Url || existingImage1,
      image2: newImage2Url || existingImage2,
      // MODIFIED: Added stockQuantity
      stockQuantity: stock,
    };

    const [result] = await db.query("UPDATE products SET ? WHERE id = ?", [
      updatedProduct,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ id, ...updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- OTHER UNCHANGED CONTROLLERS ---

export const getAllProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let sql = "SELECT * FROM products";
    const params = [];
    if (q) {
      sql += " WHERE name LIKE ?";
      params.push(`%${q}%`);
    }
    sql += " ORDER BY createdAt DESC";
    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: err.message });
  }
};
