import axios from 'axios';
import crypto from 'crypto';

// BENEFIT PAY REST API Configuration
const BENEFIT_PAY_MERCHANT_ID = process.env.BENEFIT_PAY_MERCHANT_ID || '00003245';
const BENEFIT_PAY_APP_ID = process.env.BENEFIT_PAY_APP_ID || '5226529309';
const BENEFIT_PAY_SECRET_KEY = process.env.BENEFIT_PAY_SECRET_KEY || 'pxolhn8ewvlg4hy5dwc193hbism4m33ldw330q5apqftk';
const BENEFIT_PAY_BASE_URL = process.env.BENEFIT_PAY_BASE_URL || 'https://api.test-benefitpay.bh/web/v1';
const BENEFIT_PAY_CHECK_STATUS_URL = process.env.BENEFIT_PAY_CHECK_STATUS_URL || 'https://api.test-benefitpay.bh/web/v1/merchant/transaction/check-status';

// Generate HMAC signature for BENEFIT PAY REST API
const generateSignature = (payload, secretKey) => {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
};

// Create BENEFIT PAY REST API Session
export const createBenefitPaySession = async (orderData) => {
  try {
    const { orderId, total, currency, customerDetails } = orderData;

    const paymentAmount = parseFloat(total).toFixed(3);
    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/benefit-callback`;
    
    // Prepare payment request payload
    const payload = {
      merchantId: BENEFIT_PAY_MERCHANT_ID,
      appId: BENEFIT_PAY_APP_ID,
      orderId: orderId,
      amount: paymentAmount,
      currency: currency || 'BHD',
      description: 'Shaheen Express Order Payment',
      callbackUrl: callbackUrl,
      customer: {
        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        phone: customerDetails.phone
      },
      billingAddress: {
        street: customerDetails.streetAddress,
        city: customerDetails.city,
        country: customerDetails.country
      }
    };

    // Generate signature
    const signature = generateSignature(payload, BENEFIT_PAY_SECRET_KEY);

    console.log('🔐 BENEFIT PAY REST API Request:', {
      merchantId: BENEFIT_PAY_MERCHANT_ID,
      orderId: orderId,
      amount: paymentAmount
    });

    // Make API request to BENEFIT PAY
    const response = await axios.post(
      `${BENEFIT_PAY_BASE_URL}/merchant/transaction/create`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-Id': BENEFIT_PAY_MERCHANT_ID,
          'X-App-Id': BENEFIT_PAY_APP_ID,
          'X-Signature': signature,
          'Accept': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log('✅ BENEFIT PAY REST API Response:', response.data);

    if (response.data && response.data.success) {
      return {
        success: true,
        sessionId: response.data.transactionId || orderId,
        paymentUrl: response.data.paymentUrl,
        transactionId: response.data.transactionId,
        reference: response.data.reference
      };
    } else {
      throw new Error(response.data?.message || 'BENEFIT PAY session creation failed');
    }

  } catch (error) {
    console.error('❌ BENEFIT PAY REST API Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create BENEFIT PAY session'
    };
  }
};

// Verify BENEFIT PAY Payment using REST API
export const verifyBenefitPayment = async (transactionId, orderId) => {
  try {
    console.log('🔍 BENEFIT PAY REST API Verification:', { transactionId, orderId });

    const payload = {
      merchantId: BENEFIT_PAY_MERCHANT_ID,
      appId: BENEFIT_PAY_APP_ID,
      transactionId: transactionId || orderId
    };

    const signature = generateSignature(payload, BENEFIT_PAY_SECRET_KEY);

    const response = await axios.post(
      BENEFIT_PAY_CHECK_STATUS_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Merchant-Id': BENEFIT_PAY_MERCHANT_ID,
          'X-App-Id': BENEFIT_PAY_APP_ID,
          'X-Signature': signature,
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ BENEFIT PAY Status Response:', response.data);

    if (response.data && response.data.success) {
      const status = response.data.status;
      
      if (status === 'COMPLETED' || status === 'SUCCESS' || status === 'CAPTURED') {
        return {
          success: true,
          status: 'APPROVED',
          transactionId: response.data.transactionId,
          amount: response.data.amount,
          currency: response.data.currency
        };
      } else if (status === 'FAILED' || status === 'DECLINED') {
        return {
          success: false,
          status: 'FAILED',
          error: response.data.message || 'Payment failed'
        };
      } else {
        return {
          success: false,
          status: 'PENDING',
          error: 'Payment is still pending'
        };
      }
    } else {
      return {
        success: false,
        status: 'ERROR',
        error: response.data?.message || 'Verification failed'
      };
    }

  } catch (error) {
    console.error('❌ BENEFIT PAY Verification Error:', error.message);
    return {
      success: false,
      status: 'ERROR',
      error: error.response?.data?.message || error.message || 'Failed to verify BENEFIT PAY payment'
    };
  }
};

// Handle BENEFIT PAY REST API Callback
export const handleBenefitPayResponse = async (responseData) => {
  try {
    console.log('🔔 BENEFIT PAY REST API Callback received:', responseData);
    
    const { transactionId, orderId, status, amount, currency, signature } = responseData;
    
    // Verify signature
    const expectedSignature = generateSignature({
      transactionId,
      orderId,
      status,
      amount
    }, BENEFIT_PAY_SECRET_KEY);
    
    if (signature && signature !== expectedSignature) {
      console.warn('⚠️ BENEFIT PAY signature mismatch');
    }
    
    // Determine payment status
    let paymentStatus = 'PENDING';
    if (status === 'COMPLETED' || status === 'SUCCESS' || status === 'CAPTURED') {
      paymentStatus = 'APPROVED';
    } else if (status === 'FAILED' || status === 'DECLINED') {
      paymentStatus = 'FAILED';
    } else if (status === 'CANCELED' || status === 'CANCELLED') {
      paymentStatus = 'CANCELLED';
    }
    
    return {
      success: true,
      orderId: orderId,
      transactionId: transactionId,
      status: paymentStatus,
      amount: amount,
      currency: currency
    };

  } catch (error) {
    console.error('❌ BENEFIT PAY Callback Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Handle BENEFIT PAY Webhook
export const handleBenefitPayWebhook = async (webhookData) => {
  try {
    console.log('🔔 BENEFIT PAY Webhook received:', webhookData);
    
    // Verify webhook signature
    const { signature, ...data } = webhookData;
    const expectedSignature = generateSignature(data, BENEFIT_PAY_SECRET_KEY);
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }
    
    return {
      success: true,
      data: webhookData
    };

  } catch (error) {
    console.error('❌ BENEFIT PAY Webhook Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};
