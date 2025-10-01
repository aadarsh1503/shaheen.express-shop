const axios = require('axios');

// This is the main function that will be called by our route
exports.createPaymentSession = async (req, res) => {
  try {
    // 1. Get order data from the frontend request body
    const { total, currency, customerDetails, cartItems, orderId } = req.body;

    // --- IMPORTANT SECURITY NOTE ---
    // In a real application, you should NOT trust the 'total' from the frontend.
    // You should recalculate the total on the backend based on the cartItems and prices from your database
    // to prevent users from manipulating the price in the browser.
    // For this example, we'll use the frontend total for simplicity.

    // 2. Prepare the payload for the CredMax API
    // NOTE: The structure of this payload is HYPOTHETICAL.
    // You MUST refer to the official CredMax API documentation for the correct fields.
    const credmaxPayload = {
      amount: Math.round(total * 1000), // CredMax likely requires the amount in the smallest currency unit (e.g., fils for BHD)
      currency: currency,
      merchantOrderId: orderId || `order_${Date.now()}`, // A unique ID for the order
      customer: {
        email: customerDetails.email,
        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        phone: customerDetails.phone,
      },
      // URLs CredMax will redirect to after payment
      returnUrls: {
        success: 'http://localhost:3000/order-success', // Your frontend success page
        cancel: 'http://localhost:3000/cart',           // Your frontend cart/cancel page
        failure: 'http://localhost:3000/order-failure', // Your frontend failure page
      },
      // You can pass extra data that you'll get back in webhooks
      metadata: {
        cartItemCount: cartItems.length,
      },
    };

    
    const response = await axios.post(
      `${process.env.CREADMAX_API_URL}/sessions`, 
      credmaxPayload,
      {
        headers: {
         
          'Authorization': `Bearer ${process.env.CREADMAX_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { url: paymentUrl } = response.data;

    if (!paymentUrl) {
      throw new Error('Payment URL not received from CredMax');
    }

    res.status(200).json({ url: paymentUrl });

  } catch (error) {
    console.error("❌ Error creating payment session:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Failed to create payment session." });
  }
};