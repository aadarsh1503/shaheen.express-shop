import db from '../config/db.js';

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const [addresses] = await db.query(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    res.json({ success: true, addresses });
  } catch (error) {
    console.error('❌ getUserAddresses ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      addressType,
      firstName,
      lastName,
      company,
      streetAddress,
      apartment,
      city,
      state,
      postalCode,
      country,
      phone,
      email,
      isDefault
    } = req.body;

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      await db.query(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }

    const [result] = await db.query(
      `INSERT INTO user_addresses (
        user_id, address_type, first_name, last_name, company, 
        street_address, apartment, city, state, postal_code, 
        country, phone, email, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, addressType || 'both', firstName, lastName, company || null,
        streetAddress, apartment || null, city, state || null, postalCode || null,
        country, phone, email, isDefault || false
      ]
    );

    const [newAddress] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Address added successfully',
      address: newAddress[0]
    });
  } catch (error) {
    console.error('❌ addAddress ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const {
      addressType,
      firstName,
      lastName,
      company,
      streetAddress,
      apartment,
      city,
      state,
      postalCode,
      country,
      phone,
      email,
      isDefault
    } = req.body;

    // Check if address belongs to user
    const [existingAddress] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    if (!existingAddress.length) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      await db.query(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [userId, addressId]
      );
    }

    await db.query(
      `UPDATE user_addresses SET 
        address_type = ?, first_name = ?, last_name = ?, company = ?, 
        street_address = ?, apartment = ?, city = ?, state = ?, postal_code = ?, 
        country = ?, phone = ?, email = ?, is_default = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?`,
      [
        addressType || 'both', firstName, lastName, company || null,
        streetAddress, apartment || null, city, state || null, postalCode || null,
        country, phone, email, isDefault || false, addressId, userId
      ]
    );

    const [updatedAddress] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ?',
      [addressId]
    );

    res.json({ 
      success: true, 
      message: 'Address updated successfully',
      address: updatedAddress[0]
    });
  } catch (error) {
    console.error('❌ updateAddress ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // Check if address belongs to user
    const [existingAddress] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    if (!existingAddress.length) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await db.query(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('❌ deleteAddress ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    // Check if address belongs to user
    const [existingAddress] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    if (!existingAddress.length) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Remove default from all addresses
    await db.query(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [userId]
    );

    // Set this address as default
    await db.query(
      'UPDATE user_addresses SET is_default = TRUE WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );

    res.json({ success: true, message: 'Default address updated successfully' });
  } catch (error) {
    console.error('❌ setDefaultAddress ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to set default address' });
  }
};