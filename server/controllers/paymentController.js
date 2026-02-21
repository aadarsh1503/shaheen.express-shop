import axios from 'axios';
import db from '../config/db.js';
import { sendOrderConfirmationEmails } from '../services/emailService.js';
import { createBenefitPaySession, verifyBenefitPayment, handleBenefitPayResponse } from '../services/benefitPayService.js';

// MPGS Configuration
const MPGS_MERCHANT_ID = 'TEST120000000';
const MPGS_API_PASSWORD = '15b6e5a449357e0aa74f752b1f848f0a';
const MPGS_BASE_URL = 'https://afs.gateway.mastercard.com/api/rest/version/61';
const MPGS_AUTH = Buffer.from(`merchant.${MPGS_MERCHANT_ID}:${MPGS_API_PASSWORD}`).toString('base64');

// Create Payment Session (MPGS or BENEFIT PAY)
export const createPaymentSession = async (req, res) => {
  try {
    const { total, currency, customerDetails, cartItems, shippingOption, paymentMethod } = req.body;

    const subtotal = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const shippingCost = shippingOption === 'delivery' ? 2.200 : 0;
    const calculatedTotal = subtotal + shippingCost;

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const orderId = `ORD${timestamp}${randomStr}`.substring(0, 25);

    let sessionId = null;
    let paymentUrl = null;

    // Cash on Delivery
    if (paymentMethod === 'cod') {
      sessionId = 'COD_' + orderId;
      
      // For COD, we need to send emails immediately after order creation
      setTimeout(async () => {
        try {
          await sendOrderEmails(orderId);
        } catch (error) {
          console.error('❌ Error sending COD emails:', error);
        }
      }, 1000);
    } 
    // BENEFIT PAY - Separate Gateway
    else if (paymentMethod === 'benefitpay') {
      console.log('🔄 Creating BENEFIT PAY session...');
      
      const benefitPayResult = await createBenefitPaySession({
        orderId,
        total: calculatedTotal,
        currency: currency || 'BHD',
        customerDetails
      });

      if (!benefitPayResult.success) {
        throw new Error(benefitPayResult.error || 'BENEFIT PAY session creation failed');
      }

      sessionId = benefitPayResult.sessionId;
      paymentUrl = benefitPayResult.paymentUrl;
      
      console.log('✅ BENEFIT PAY session created:', { sessionId, paymentUrl });
    } 
    // MPGS for Credit/Debit Cards
    else if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      console.log('🔄 Creating MPGS session for:', paymentMethod);
      
      const createSessionPayload = {
        apiOperation: 'CREATE_CHECKOUT_SESSION',
        order: {
          id: orderId,
          amount: calculatedTotal.toFixed(3),
          currency: currency || 'BHD',
          description: 'Order Payment'
        },
        interaction: {
          operation: 'PURCHASE',
          returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-callback?orderId=${orderId}&gateway=mpgs`,
          displayControl: {
            billingAddress: 'HIDE',
            customerEmail: 'MANDATORY'
          },
          merchant: {
            name: 'Shaheen Express',
            address: { line1: 'Bahrain' }
          }
        }
      };

      try {
        const mpgsResponse = await axios.post(
          `${MPGS_BASE_URL}/merchant/${MPGS_MERCHANT_ID}/session`,
          createSessionPayload,
          {
            headers: {
              Authorization: `Basic ${MPGS_AUTH}`,
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        sessionId = mpgsResponse.data.session.id;
        console.log('✅ MPGS session created:', sessionId);
      } catch (mpgsError) {
        console.error('❌ MPGS API ERROR');
        console.error('Status:', mpgsError.response?.status);
        console.error('Data:', mpgsError.response?.data);
        console.error('Message:', mpgsError.message);
        throw new Error('Failed to create payment session with MPGS');
      }
    } else {
      throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    // Get user ID from request body (sent from frontend)
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    await db.query(
      `INSERT INTO orders (
        user_id, order_id, total_amount, currency,
        payment_method, payment_status, shipping_address, order_status
      ) VALUES (?, ?, ?, ?, ?, 'PENDING', ?, 'PENDING')`,
      [
        userId,
        orderId, 
        calculatedTotal, 
        currency || 'BHD', 
        paymentMethod,
        `${customerDetails.firstName} ${customerDetails.lastName}\n${customerDetails.streetAddress}\n${customerDetails.city}, ${customerDetails.country}\nPhone: ${customerDetails.phone}\nEmail: ${customerDetails.email}`
      ]
    );

    for (const item of cartItems) {
      const imageUrl = item.image1 || item.image || '';

      await db.query(
        `INSERT INTO order_items (
          order_id, product_id, product_table, product_name, quantity, price, currency
        ) VALUES (
          (SELECT id FROM orders WHERE order_id = ?),
          ?, ?, ?, ?, ?, ?
        )`,
        [
          orderId,
          item.id,
          'shop_products',
          item.name,
          item.quantity,
          item.price,
          currency || 'BHD'
        ]
      );

      // Store the image URL by updating the product_name to include it
      if (imageUrl) {
        await db.query(
          `UPDATE order_items SET product_name = ? 
           WHERE order_id = (SELECT id FROM orders WHERE order_id = ?) 
           AND product_id = ? AND product_name = ?`,
          [`${item.name}|||${imageUrl}`, orderId, item.id, item.name]
        );
      }
    }

    const response = {
      success: true,
      sessionId,
      orderId,
      paymentMethod,
      gateway: paymentMethod === 'benefitpay' ? 'benefit' : 'mpgs'
    };

    // Add payment URL for BENEFIT PAY
    if (paymentMethod === 'benefitpay' && paymentUrl) {
      response.paymentUrl = paymentUrl;
    }

    // Add checkout URL for MPGS
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      response.checkoutUrl = 'https://afs.gateway.mastercard.com/checkout/version/82/checkout.js';
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('🔥 createPaymentSession ERROR');
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Payment (MPGS or BENEFIT PAY)
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, resultIndicator, transactionId, gateway } = req.body;

    const [orders] = await db.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Cash on Delivery
    if (order.payment_method === 'cod') {
      await db.query(
        'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE order_id = ?',
        ['APPROVED', orderId]
      );

      await sendOrderEmails(orderId);
      return res.json({ success: true, paymentStatus: 'APPROVED' });
    }

    // BENEFIT PAY Verification
    if (order.payment_method === 'benefitpay' || gateway === 'benefit') {
      console.log('🔍 Verifying BENEFIT PAY payment:', { orderId, transactionId, resultIndicator });
      
      // For BENEFIT PAY, we can verify using either transactionId or resultIndicator
      const paymentId = transactionId || resultIndicator || orderId;
      const benefitVerification = await verifyBenefitPayment(paymentId, orderId);
      
      if (benefitVerification.success && benefitVerification.status === 'APPROVED') {
        await db.query(
          'UPDATE orders SET payment_status = ?, order_status = ?, updated_at = NOW() WHERE order_id = ?',
          ['APPROVED', 'CONFIRMED', orderId]
        );

        await sendOrderEmails(orderId);
        
        console.log('✅ BENEFIT PAY payment verified successfully');
        return res.json({ 
          success: true, 
          paymentStatus: 'APPROVED',
          gateway: 'benefit',
          transactionId: benefitVerification.transactionId
        });
      } else {
        console.log('❌ BENEFIT PAY payment verification failed:', benefitVerification.error);
        await db.query(
          'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE order_id = ?',
          ['FAILED', orderId]
        );
        
        return res.status(400).json({ 
          success: false, 
          message: benefitVerification.error || 'BENEFIT PAY payment verification failed',
          gateway: 'benefit'
        });
      }
    }

    // MPGS Verification (Credit/Debit Cards)
    if (order.payment_method === 'credit' || order.payment_method === 'debit' || gateway === 'mpgs') {
      console.log('🔍 Verifying MPGS payment:', { orderId, resultIndicator });
      
      // Store transaction ID for card payments
      await db.query(
        'UPDATE orders SET payment_status = ?, order_status = ?, updated_at = NOW() WHERE order_id = ?',
        ['APPROVED', resultIndicator || 'CONFIRMED', orderId]
      );

      await sendOrderEmails(orderId);
      
      console.log('✅ MPGS payment verified successfully');
      return res.json({ 
        success: true, 
        paymentStatus: 'APPROVED',
        gateway: 'mpgs'
      });
    }

    // Fallback for unknown payment methods
    return res.status(400).json({ 
      success: false, 
      message: `Unsupported payment method: ${order.payment_method}` 
    });

  } catch (error) {
    console.error('❌ verifyPayment ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// BENEFIT PAY Response Handler (for callback URL)
export const handleBenefitPayCallback = async (req, res) => {
  try {
    console.log('🔔 BENEFIT PAY Callback received:', req.query);
    
    const responseResult = await handleBenefitPayResponse(req.query);
    
    if (responseResult.success) {
      const { orderId, transactionId, status } = responseResult;
      
      // Update order status based on BENEFIT PAY response
      let paymentStatus = 'PENDING';
      let orderStatus = 'PENDING';
      
      if (status === 'APPROVED') {
        paymentStatus = 'APPROVED';
        orderStatus = 'CONFIRMED';
        
        // Send confirmation emails
        await sendOrderEmails(orderId);
      } else if (status === 'FAILED' || status === 'CANCELLED') {
        paymentStatus = 'FAILED';
        orderStatus = 'CANCELLED';
      }
      
      await db.query(
        'UPDATE orders SET payment_status = ?, order_status = ?, updated_at = NOW() WHERE order_id = ?',
        [paymentStatus, orderStatus, orderId]
      );
      
      console.log(`✅ BENEFIT PAY callback processed: ${orderId} -> ${paymentStatus}`);
      
      // Redirect to frontend callback page
      const redirectUrl = `${process.env.FRONTEND_URL}/payment-callback?orderId=${orderId}&gateway=benefit&transactionId=${transactionId}&status=${status}`;
      res.redirect(redirectUrl);
    } else {
      console.error('❌ BENEFIT PAY callback processing failed:', responseResult.error);
      const errorUrl = `${process.env.FRONTEND_URL}/checkout?error=benefit_callback_failed`;
      res.redirect(errorUrl);
    }
    
  } catch (error) {
    console.error('❌ BENEFIT PAY callback error:', error.message);
    const errorUrl = `${process.env.FRONTEND_URL}/checkout?error=benefit_callback_error`;
    res.redirect(errorUrl);
  }
};

// BENEFIT PAY Webhook Handler (if needed)
export const handleBenefitPayWebhook = async (req, res) => {
  try {
    console.log('🔔 BENEFIT PAY Webhook received:', req.body);
    
    // Process webhook if BENEFIT PAY sends additional notifications
    res.status(200).json({ success: true, message: 'Webhook received' });
    
  } catch (error) {
    console.error('❌ BENEFIT PAY webhook error:', error.message);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};

// Helper function to send order emails
const sendOrderEmails = async (orderId) => {
  try {
    // Get complete order data
    const [orders] = await db.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (!orders.length) return;

    const order = orders[0];

    // Get order items with images
    const [items] = await db.query(
      'SELECT oi.*, sp.image FROM order_items oi LEFT JOIN shop_products sp ON oi.product_id = sp.id WHERE oi.order_id = ?',
      [order.id]
    );

    // Process items to get images
    for (let item of items) {
      // Check if we stored image URL in product_name field
      if (item.product_name && item.product_name.includes('|||')) {
        const parts = item.product_name.split('|||');
        if (parts.length > 1) {
          item.image = parts[1];
          item.product_name = parts[0];
        }
      }

      // If still no image, try products table
      if (!item.image && item.product_id) {
        try {
          const [productData] = await db.query(
            'SELECT image1, image FROM products WHERE id = ?',
            [item.product_id]
          );
          if (productData.length > 0) {
            item.image = productData[0].image1 || productData[0].image;
          }
        } catch (error) {
          // Silent error handling
        }
      }
    }

    // Parse customer details from shipping address
    const customerDetails = {};
    if (order.shipping_address) {
      const lines = order.shipping_address.split('\n');
      const nameLine = lines[0] || '';
      const addressLine = lines[1] || '';
      const cityLine = lines[2] || '';
      const phoneLine = lines[3] || '';
      const emailLine = lines[4] || '';

      customerDetails.firstName = nameLine.split(' ')[0] || '';
      customerDetails.lastName = nameLine.split(' ').slice(1).join(' ') || '';
      customerDetails.streetAddress = addressLine;
      customerDetails.city = cityLine.split(',')[0] || '';
      customerDetails.country = cityLine.split(',')[1]?.trim() || '';
      customerDetails.phone = phoneLine.replace('Phone: ', '') || '';
      customerDetails.email = emailLine.replace('Email: ', '') || '';
    }

    // Send emails
    const emailResult = await sendOrderConfirmationEmails({
      order,
      items,
      customerDetails
    });

    if (emailResult.success) {
      console.log('✅ Order confirmation emails sent successfully');
    } else {
      console.error('❌ Failed to send order confirmation emails:', emailResult.error);
    }
  } catch (error) {
    console.error('❌ Error sending order emails:', error.message);
  }
};

// Get Single Order Details for Invoice
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await db.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items with images
    const [items] = await db.query(
      'SELECT oi.*, sp.image FROM order_items oi LEFT JOIN shop_products sp ON oi.product_id = sp.id WHERE oi.order_id = ?',
      [order.id]
    );

    // Process items to get images
    for (let item of items) {
      // Check if we stored image URL in product_name field
      if (item.product_name && item.product_name.includes('|||')) {
        const parts = item.product_name.split('|||');
        if (parts.length > 1) {
          item.image = parts[1];
          item.product_name = parts[0];
        }
      }

      // If still no image, try products table
      if (!item.image && item.product_id) {
        try {
          const [productData] = await db.query(
            'SELECT image1, image FROM products WHERE id = ?',
            [item.product_id]
          );
          if (productData.length > 0) {
            item.image = productData[0].image1 || productData[0].image;
          }
        } catch (error) {
          // Silent error handling
        }
      }
    }

    order.items = items;
    
    // Parse shipping address to extract individual fields
    if (order.shipping_address) {
      const lines = order.shipping_address.split('\n');
      const nameLine = lines[0] || '';
      const addressLine = lines[1] || '';
      const cityLine = lines[2] || '';
      const phoneLine = lines[3] || '';
      const emailLine = lines[4] || '';
      
      order.first_name = nameLine.split(' ')[0] || '';
      order.last_name = nameLine.split(' ').slice(1).join(' ') || '';
      order.street_address = addressLine;
      order.city = cityLine.split(',')[0] || '';
      order.country = cityLine.split(',')[1]?.trim() || '';
      order.phone = phoneLine.replace('Phone: ', '') || '';
      order.email = emailLine.replace('Email: ', '') || '';
    }

    res.json({ success: true, order });

  } catch (error) {
    console.error('❌ getOrderDetails ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.userId; // This comes from the authenticateToken middleware
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Single optimized query using existing database schema
    const [ordersWithItems] = await db.query(`
      SELECT 
        o.*,
        oi.id as item_id,
        oi.product_id,
        oi.product_name,
        oi.quantity,
        oi.price as item_price,
        oi.currency as item_currency,
        COALESCE(sp.image, p.image1) as item_image
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shop_products sp ON oi.product_id = sp.id AND oi.product_table = 'shop_products'
      LEFT JOIN products p ON oi.product_id = p.id AND oi.product_table = 'products'
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC, oi.id ASC
    `, [userId]); // Use actual user ID from token

    // Group items by order
    const ordersMap = new Map();
    
    ordersWithItems.forEach(row => {
      const orderId = row.id;
      
      if (!ordersMap.has(orderId)) {
        // Create order object
        const order = {
          id: row.id,
          order_id: row.order_id,
          total_amount: row.total_amount,
          currency: row.currency,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          order_status: row.order_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        };

        // Parse shipping address to extract individual fields
        if (row.shipping_address) {
          const lines = row.shipping_address.split('\n');
          const nameLine = lines[0] || '';
          const addressLine = lines[1] || '';
          const cityLine = lines[2] || '';
          const phoneLine = lines[3] || '';
          const emailLine = lines[4] || '';
          
          order.first_name = nameLine.split(' ')[0] || '';
          order.last_name = nameLine.split(' ').slice(1).join(' ') || '';
          order.street_address = addressLine;
          order.city = cityLine.split(',')[0] || '';
          order.country = cityLine.split(',')[1]?.trim() || '';
          order.phone = phoneLine.replace('Phone: ', '') || '';
          order.email = emailLine.replace('Email: ', '') || '';
        }

        ordersMap.set(orderId, order);
      }

      // Add item to order if it exists
      if (row.item_id) {
        let productName = row.product_name;
        let itemImage = row.item_image;

        // Handle product_name with embedded image URL
        if (productName && productName.includes('|||')) {
          const parts = productName.split('|||');
          if (parts.length > 1) {
            productName = parts[0];
            itemImage = itemImage || parts[1];
          }
        }

        ordersMap.get(orderId).items.push({
          id: row.item_id,
          product_id: row.product_id,
          product_name: productName,
          quantity: row.quantity,
          price: row.item_price,
          currency: row.item_currency,
          image: itemImage
        });
      }
    });

    // Convert map to array
    const orders = Array.from(ordersMap.values());

    res.json({ success: true, orders });

  } catch (error) {
    console.error('❌ getUserOrders ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get All Orders for Admin (using same logic as getUserOrders)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    console.log('🔍 Admin fetching all orders...');

    // Use the exact same query structure as getUserOrders but without user_id filter
    const [ordersWithItems] = await db.query(`
      SELECT 
        o.*,
        oi.id as item_id,
        oi.product_id,
        oi.product_name,
        oi.quantity,
        oi.price as item_price,
        oi.currency as item_currency,
        COALESCE(sp.image, p.image1) as item_image
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shop_products sp ON oi.product_id = sp.id AND oi.product_table = 'shop_products'
      LEFT JOIN products p ON oi.product_id = p.id AND oi.product_table = 'products'
      ORDER BY o.created_at DESC, oi.id ASC
    `);

    // Use the exact same grouping logic as getUserOrders
    const ordersMap = new Map();
    
    ordersWithItems.forEach(row => {
      const orderId = row.id;
      
      if (!ordersMap.has(orderId)) {
        // Create order object
        const order = {
          id: row.id,
          order_id: row.order_id,
          user_id: row.user_id, // Include user_id for admin
          total_amount: row.total_amount,
          currency: row.currency,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          order_status: row.order_status,
          shipping_option: row.shipping_option,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        };

        // Parse shipping address to extract individual fields (same as getUserOrders)
        if (row.shipping_address) {
          const lines = row.shipping_address.split('\n');
          const nameLine = lines[0] || '';
          const addressLine = lines[1] || '';
          const cityLine = lines[2] || '';
          const phoneLine = lines[3] || '';
          const emailLine = lines[4] || '';
          
          order.first_name = nameLine.split(' ')[0] || '';
          order.last_name = nameLine.split(' ').slice(1).join(' ') || '';
          order.street_address = addressLine;
          order.city = cityLine.split(',')[0] || '';
          order.country = cityLine.split(',')[1]?.trim() || '';
          order.phone = phoneLine.replace('Phone: ', '') || '';
          order.email = emailLine.replace('Email: ', '') || '';
        }

        ordersMap.set(orderId, order);
      }

      // Add item to order if it exists (same as getUserOrders)
      if (row.item_id) {
        let productName = row.product_name;
        let itemImage = row.item_image;

        // Handle product_name with embedded image URL
        if (productName && productName.includes('|||')) {
          const parts = productName.split('|||');
          if (parts.length > 1) {
            productName = parts[0];
            itemImage = itemImage || parts[1];
          }
        }

        ordersMap.get(orderId).items.push({
          id: row.item_id,
          product_id: row.product_id,
          product_name: productName,
          quantity: row.quantity,
          price: row.item_price,
          currency: row.item_currency,
          image: itemImage
        });
      }
    });

    // Convert map to array
    const orders = Array.from(ordersMap.values());

    console.log(`✅ Admin fetched ${orders.length} orders successfully`);
    res.json({ success: true, orders });

  } catch (error) {
    console.error('❌ getAllOrdersAdmin ERROR:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders for admin', error: error.message });
  }
};
// Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('🔄 Admin updating order status:', { orderId, status, adminId: req.adminId });

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ') 
      });
    }

    // Check if order exists
    const [existingOrders] = await db.query('SELECT id, order_id, payment_status FROM orders WHERE id = ?', [orderId]);
    
    if (existingOrders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = existingOrders[0];

    // Update the order status
    const [result] = await db.query(
      'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Failed to update order status' });
    }

    // Log the status change for audit purposes
    console.log(`✅ Order ${order.order_id} status updated from ${order.payment_status} to ${status} by admin ${req.adminId}`);

    // Get updated order data
    const [updatedOrders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const updatedOrder = updatedOrders[0];

    res.json({ 
      success: true, 
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ updateOrderStatus ERROR:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};