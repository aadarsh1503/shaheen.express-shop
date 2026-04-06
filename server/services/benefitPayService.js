import axios from 'axios';
import crypto from 'crypto';

// BENEFIT PAY Hosted Payment Page Configuration
const BENEFIT_PAY_TRANPORTAL_ID = process.env.BENEFIT_PAY_TRANPORTAL_ID || '30021825';
const BENEFIT_PAY_TRANPORTAL_PASSWORD = process.env.BENEFIT_PAY_TRANPORTAL_PASSWORD || '30021825';
const BENEFIT_PAY_TERMINAL_RESOURCE_KEY = process.env.BENEFIT_PAY_TERMINAL_RESOURCE_KEY || '60285538144660285538144660285538';
const BENEFIT_PAY_BASE_URL = process.env.BENEFIT_PAY_BASE_URL || 'https://test.benefit-gateway.bh/payment/API/hosted.htm';
const BENEFIT_PAY_QR_URL = process.env.BENEFIT_PAY_QR_URL || 'https://test.benefit-gateway.bh/payment/API/qr.htm';

// BENEFIT PAY specific IV
const BENEFIT_PAY_IV = 'PGKEYENCDECIVSPC';

console.log('🔧 BENEFIT PAY Configuration Loaded:');
console.log('   Tranportal ID:', BENEFIT_PAY_TRANPORTAL_ID);
console.log('   Terminal Resource Key:', BENEFIT_PAY_TERMINAL_RESOURCE_KEY);
console.log('   Base URL:', BENEFIT_PAY_BASE_URL);
console.log('   QR URL:', BENEFIT_PAY_QR_URL);
console.log('   IV:', BENEFIT_PAY_IV);

// AES-256-CBC Encryption for BENEFIT PAY (as per their specification)
const encryptAES = (data, key, iv) => {
  try {
    // Prepare key: use Terminal Resource Key, pad/truncate to 32 bytes for AES-256
    const keyBuffer = Buffer.from(key.padEnd(32, '0').substring(0, 32), 'utf8');
    
    // Prepare IV: use BENEFIT PAY specific IV, pad/truncate to 16 bytes
    const ivBuffer = Buffer.from(iv.padEnd(16, ' ').substring(0, 16), 'utf8');
    
    console.log('🔐 Encryption Key Length:', keyBuffer.length);
    console.log('🔐 IV Length:', ivBuffer.length);
    
    // Create cipher with AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    
    // Encrypt data and output as hex
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    console.log('🔐 AES-256-CBC Encryption successful');
    console.log('🔐 Encrypted length:', encrypted.length);
    
    return encrypted;
  } catch (error) {
    console.error('❌ AES Encryption Error:', error.message);
    throw error;
  }
};

// Create BENEFIT PAY Hosted Payment Session (Server-to-Server)
export const createBenefitPaySession = async (orderData) => {
  try {
    console.log('\n🔄 ========== CREATING BENEFIT PAY SESSION (SERVER-TO-SERVER) ==========');
    console.log('📦 Order Data Received:', JSON.stringify(orderData, null, 2));
    
    const { orderId, total, currency, customerDetails } = orderData;

    const paymentAmount = parseFloat(total).toFixed(3);
    const paymentCurrency = currency || 'BHD';
    
    console.log('💰 Payment Amount:', paymentAmount);
    console.log('💱 Currency:', paymentCurrency);
    
    // Use appropriate URLs based on environment
    // responseURL and errorURL must point to the dedicated plain-text response endpoint
    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/benefit-response`;
    const errorUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/benefit-response`;
    
    console.log('🔗 Callback URL:', callbackUrl);
    console.log('🔗 Error URL:', errorUrl);
    
    // Step 1: Prepare payment data as JSON object (as per BENEFIT PAY format)
    const paymentData = {
      amt: paymentAmount,
      action: '1', // Fixed value: 1 = Purchase
      password: BENEFIT_PAY_TRANPORTAL_PASSWORD,
      id: BENEFIT_PAY_TRANPORTAL_ID,
      currencycode: '048', // Fixed value: ISO 4217 code for BHD
      trackId: orderId,
      udf1: customerDetails.email || '',
      udf2: customerDetails.phone || '',
      udf3: `${customerDetails.firstName} ${customerDetails.lastName}`,
      udf4: '',
      udf5: '',
      cardType: 'D', // Fixed value: D = Debit
      responseURL: callbackUrl,
      errorURL: errorUrl
    };

    console.log('📤 Payment Data (before encoding):', JSON.stringify(paymentData, null, 2));

    // Step 2: Convert to JSON array format and encode
    const jsonArrayString = JSON.stringify([paymentData]);
    console.log('📝 JSON Array String:', jsonArrayString);
    
    // Step 3: URL encode the JSON string
    const encodedData = encodeURIComponent(jsonArrayString);
    console.log('📝 URL Encoded Data:', encodedData);

    // Step 4: Encrypt the encoded data using AES-256-CBC
    const encryptedData = encryptAES(
      encodedData, 
      BENEFIT_PAY_TERMINAL_RESOURCE_KEY,
      BENEFIT_PAY_IV
    );
    
    console.log('🔐 Encrypted Data (hex):', encryptedData);

    // Step 5: Prepare final request as JSON array with id and trandata
    const finalRequest = [
      {
        id: BENEFIT_PAY_TRANPORTAL_ID,
        trandata: encryptedData
      }
    ];

    console.log('📤 Final Request:', JSON.stringify(finalRequest, null, 2));

    // Step 6: Make server-to-server POST request to BENEFIT PAY with JSON body
    const response = await axios.post(
      BENEFIT_PAY_BASE_URL,
      finalRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/html, */*',
          'Cache-Control': 'no-cache'
        },
        timeout: 30000,
        maxRedirects: 5
      }
    );

    console.log('✅ BENEFIT PAY Response Status:', response.status);
    console.log('✅ BENEFIT PAY Response Headers:', JSON.stringify(response.headers, null, 2));
    
    // Check if response contains payment page HTML or redirect URL
    let paymentUrl = null;
    let paymentHtml = null;
    
    if (response.headers.location) {
      paymentUrl = response.headers.location;
      console.log('🔗 Payment URL from Location header:', paymentUrl);
    } else if (typeof response.data === 'string') {
      // Response is HTML - extract payment URL or return the HTML
      console.log('📄 Received HTML response (length):', response.data.length);
      paymentHtml = response.data;
      
      // Look for payment ID or form action in HTML
      const paymentIdMatch = response.data.match(/paymentid[=:][\s]*["']?([^"'\s<>]+)/i);
      const actionMatch = response.data.match(/action=["']([^"']+)["']/i);
      
      if (paymentIdMatch) {
        const paymentId = paymentIdMatch[1];
        paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${paymentId}`;
        console.log('🔗 Payment URL constructed from paymentId:', paymentUrl);
      } else if (actionMatch) {
        paymentUrl = actionMatch[1];
        console.log('🔗 Payment URL from form action:', paymentUrl);
      }
    } else if (response.data && typeof response.data === 'object') {
      // JSON response
      console.log('📊 Received JSON response:', JSON.stringify(response.data, null, 2));
      
      // BENEFIT PAY returns array with result field containing payment URL
      if (Array.isArray(response.data) && response.data.length > 0) {
        const responseObj = response.data[0];
        
        if (responseObj.result) {
          paymentUrl = responseObj.result;
          console.log('🔗 Payment URL from result field:', paymentUrl);
        } else if (responseObj.paymentUrl) {
          paymentUrl = responseObj.paymentUrl;
        } else if (responseObj.paymentId) {
          paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${responseObj.paymentId}`;
        }
      } else if (response.data.result) {
        paymentUrl = response.data.result;
      } else if (response.data.paymentUrl) {
        paymentUrl = response.data.paymentUrl;
      } else if (response.data.paymentId) {
        paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${response.data.paymentId}`;
      }
    }

    console.log('✅ ========== BENEFIT PAY SESSION CREATED SUCCESSFULLY ==========\n');
    
    return {
      success: true,
      sessionId: orderId,
      paymentUrl: paymentUrl,
      paymentHtml: paymentHtml,
      transactionId: orderId,
      reference: orderId
    };

  } catch (error) {
    console.error('\n❌ ========== BENEFIT PAY SESSION ERROR ==========');
    console.error('❌ Error Message:', error.message);
    
    if (error.response) {
      console.error('❌ Response Status:', error.response.status);
      console.error('❌ Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('❌ Response Data:', typeof error.response.data === 'string' 
        ? error.response.data.substring(0, 500) 
        : JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('❌ No response received from server');
    } else {
      console.error('❌ Error setting up request:', error.message);
    }
    console.error('❌ ================================================\n');
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create BENEFIT PAY session'
    };
  }
};

// Verify BENEFIT PAY Payment
export const verifyBenefitPayment = async (transactionId, orderId) => {
  try {
    console.log('\n🔍 ========== VERIFYING BENEFIT PAY PAYMENT ==========');
    console.log('🔍 Transaction ID:', transactionId);
    console.log('🔍 Order ID:', orderId);

    // For hosted payment page, verification is done via callback
    // This is a placeholder for additional verification if needed
    
    return {
      success: true,
      status: 'PENDING',
      message: 'Verification pending callback'
    };

  } catch (error) {
    console.error('❌ BENEFIT PAY Verification Error:', error.message);
    return {
      success: false,
      status: 'ERROR',
      error: error.message
    };
  }
};

// Decrypt AES encrypted response from BENEFIT PAY
const decryptAES = (encryptedData, key, iv) => {
  try {
    // Prepare key and IV same as encryption
    const keyBuffer = Buffer.from(key.padEnd(32, '0').substring(0, 32), 'utf8');
    const ivBuffer = Buffer.from(iv.padEnd(16, ' ').substring(0, 16), 'utf8');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log('🔓 AES Decryption successful');
    return decrypted;
  } catch (error) {
    console.error('❌ AES Decryption Error:', error.message);
    throw error;
  }
};

// Handle BENEFIT PAY Callback Response
export const handleBenefitPayResponse = async (responseData) => {
  try {
    console.log('\n🔔 ========== BENEFIT PAY CALLBACK RECEIVED ==========');
    console.log('📥 Raw Callback Data:', JSON.stringify(responseData, null, 2));
    
    // Check if response is encrypted
    let parsedData = responseData;
    
    if (responseData.trandata) {
      console.log('🔐 Encrypted response detected, decrypting...');
      const decryptedString = decryptAES(
        responseData.trandata, 
        BENEFIT_PAY_TERMINAL_RESOURCE_KEY,
        BENEFIT_PAY_IV
      );
      console.log('🔓 Decrypted String:', decryptedString);
      
      // Decode URL encoded string
      const decodedString = decodeURIComponent(decryptedString);
      console.log('🔓 Decoded String:', decodedString);
      
      // Parse JSON
      try {
        const jsonArray = JSON.parse(decodedString);
        parsedData = Array.isArray(jsonArray) ? jsonArray[0] : jsonArray;
      } catch (e) {
        console.error('❌ Failed to parse JSON, trying query string format');
        // Fallback to query string parsing
        parsedData = {};
        decodedString.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          parsedData[key] = decodeURIComponent(value || '');
        });
      }
      
      console.log('📊 Parsed Decrypted Data:', JSON.stringify(parsedData, null, 2));
    }
    
    const { 
      result, 
      trackid,
      trackId, 
      tranid, 
      paymentid, 
      ref,
      amt,
      udf1,
      udf2,
      udf3,
      responsecode,
      responsetext,
      ErrorText,
      authRespCode
    } = parsedData;
    
    const orderId = trackid || trackId;
    
    console.log('📊 Payment Result:', result);
    console.log('📊 Response Code:', responsecode);
    console.log('📊 Response Text:', responsetext);
    console.log('📊 Error Text:', ErrorText);
    console.log('📊 Auth Response Code:', authRespCode);
    console.log('📊 Track ID (Order ID):', orderId);
    console.log('📊 Transaction ID:', tranid);
    console.log('📊 Payment ID:', paymentid);
    console.log('📊 Amount:', amt);
    
    // Determine payment status
    let paymentStatus = 'PENDING';
    
    // Log all fields for debugging
    console.log('📊 All parsed fields:', JSON.stringify(parsedData, null, 2));

    // Check for errors first
    if (ErrorText && ErrorText.trim() !== '') {
      // IPAY0400001 is a gateway acknowledgement error, not a payment failure
      // If tranid or paymentid is present, the payment actually completed
      if (ErrorText.includes('IPAY0400001') && (tranid || paymentid)) {
        paymentStatus = 'APPROVED';
        console.log('⚠️ IPAY0400001 ack error ignored — payment ID present, treating as APPROVED');
      } else {
        paymentStatus = 'FAILED';
        console.log('❌ Payment FAILED - Error:', ErrorText);
      }
    }
    // Check result field — Benefit Pay uses various success values
    else if (
      result === 'CAPTURED' || result === 'SUCCESS' || result === 'APPROVED' ||
      responsecode === '00' || authRespCode === '00' ||
      (parsedData.Result && (parsedData.Result === 'CAPTURED' || parsedData.Result === 'SUCCESS' || parsedData.Result === 'APPROVED'))
    ) {
      paymentStatus = 'APPROVED';
      console.log('✅ Payment APPROVED');
    } else if (result === 'FAILED' || result === 'DECLINED' || result === 'NOT CAPTURED' ||
               (parsedData.Result && (parsedData.Result === 'FAILED' || parsedData.Result === 'DECLINED'))) {
      paymentStatus = 'FAILED';
      console.log('❌ Payment FAILED');
    } else if (result === 'CANCELED' || result === 'CANCELLED' ||
               (parsedData.Result && (parsedData.Result === 'CANCELED' || parsedData.Result === 'CANCELLED'))) {
      paymentStatus = 'CANCELLED';
      console.log('⚠️ Payment CANCELLED');
    } else if (!result && !parsedData.Result) {
      // No result field at all — check if there's a tranid/paymentid which indicates success
      if (tranid || paymentid) {
        paymentStatus = 'APPROVED';
        console.log('✅ Payment APPROVED (inferred from tranid/paymentid presence)');
      } else {
        paymentStatus = 'CANCELLED';
        console.log('⚠️ Payment CANCELLED or not completed (no result, no tranid)');
      }
    } else {
      // result exists but unknown value — log it
      console.log(`⚠️ Unknown result value: "${result || parsedData.Result}", defaulting to FAILED`);
      paymentStatus = 'FAILED';
    }
    
    console.log('✅ ========== CALLBACK PROCESSED ==========\n');
    
    return {
      success: true,
      orderId: orderId,
      transactionId: tranid || paymentid,
      status: paymentStatus,
      amount: amt,
      responseCode: responsecode,
      responseText: responsetext,
      reference: ref
    };

  } catch (error) {
    console.error('\n❌ ========== BENEFIT PAY CALLBACK ERROR ==========');
    console.error('❌ Error:', error.message);
    console.error('❌ ================================================\n');
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Create BENEFIT PAY QR Code Payment Session (using hosted page like card payment)
export const createBenefitPayQRSession = async (orderData) => {
  try {
    console.log('\n🔄 ========== CREATING BENEFIT PAY QR SESSION (HOSTED PAGE) ==========');
    console.log('📦 Order Data Received:', JSON.stringify(orderData, null, 2));
    
    const { orderId, total, currency, customerDetails } = orderData;

    const paymentAmount = parseFloat(total).toFixed(3);
    const paymentCurrency = currency || 'BHD';
    
    console.log('💰 Payment Amount:', paymentAmount);
    console.log('💱 Currency:', paymentCurrency);
    
    // Use same callback URLs as card payment — dedicated response endpoint
    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/benefit-response`;
    const errorUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/benefit-response`;
    
    console.log('🔗 Callback URL:', callbackUrl);
    console.log('🔗 Error URL:', errorUrl);
    
    // Prepare payment data - SAME as card payment but with QR indicator
    const paymentData = {
      amt: paymentAmount,
      action: '1', // Fixed value: 1 = Purchase
      password: BENEFIT_PAY_TRANPORTAL_PASSWORD,
      id: BENEFIT_PAY_TRANPORTAL_ID,
      currencycode: '048', // Fixed value: ISO 4217 code for BHD
      trackId: orderId,
      udf1: customerDetails.email || '',
      udf2: customerDetails.phone || '',
      udf3: `${customerDetails.firstName} ${customerDetails.lastName}`,
      udf4: 'QR', // Use udf4 to indicate QR payment
      udf5: '',
      cardType: 'D', // Keep as D (Debit) - BENEFIT PAY will show QR based on merchant settings
      responseURL: callbackUrl,
      errorURL: errorUrl
    };

    console.log('📤 QR Payment Data (before encoding):', JSON.stringify(paymentData, null, 2));

    // Use SAME encryption process as card payment
    const jsonArrayString = JSON.stringify([paymentData]);
    console.log('📝 JSON Array String:', jsonArrayString);
    
    const encodedData = encodeURIComponent(jsonArrayString);
    console.log('📝 URL Encoded Data:', encodedData);

    const encryptedData = encryptAES(
      encodedData, 
      BENEFIT_PAY_TERMINAL_RESOURCE_KEY,
      BENEFIT_PAY_IV
    );
    
    console.log('🔐 Encrypted Data (hex):', encryptedData);

    const finalRequest = [
      {
        id: BENEFIT_PAY_TRANPORTAL_ID,
        trandata: encryptedData
      }
    ];

    console.log('📤 Final QR Request:', JSON.stringify(finalRequest, null, 2));

    // Use SAME endpoint as card payment
    const response = await axios.post(
      BENEFIT_PAY_BASE_URL,
      finalRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/html, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Origin': 'https://test.benefit-gateway.bh',
          'Referer': 'https://test.benefit-gateway.bh/',
          'Cache-Control': 'no-cache'
        },
        timeout: 30000,
        maxRedirects: 5
      }
    );

    console.log('✅ BENEFIT PAY QR Response Status:', response.status);
    console.log('✅ BENEFIT PAY QR Response Headers:', JSON.stringify(response.headers, null, 2));
    
    // Extract payment URL (same logic as card payment)
    let paymentUrl = null;
    
    if (response.headers.location) {
      paymentUrl = response.headers.location;
      console.log('🔗 QR Payment URL from Location header:', paymentUrl);
    } else if (typeof response.data === 'string') {
      console.log('📄 Received HTML response (length):', response.data.length);
      
      const paymentIdMatch = response.data.match(/paymentid[=:][\s]*["']?([^"'\s<>]+)/i);
      const actionMatch = response.data.match(/action=["']([^"']+)["']/i);
      
      if (paymentIdMatch) {
        const paymentId = paymentIdMatch[1];
        paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${paymentId}`;
        console.log('🔗 QR Payment URL constructed from paymentId:', paymentUrl);
      } else if (actionMatch) {
        paymentUrl = actionMatch[1];
        console.log('🔗 QR Payment URL from form action:', paymentUrl);
      }
    } else if (response.data && typeof response.data === 'object') {
      console.log('📊 Received JSON response:', JSON.stringify(response.data, null, 2));
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        const responseObj = response.data[0];
        
        if (responseObj.result) {
          paymentUrl = responseObj.result;
          console.log('🔗 QR Payment URL from result field:', paymentUrl);
        } else if (responseObj.paymentUrl) {
          paymentUrl = responseObj.paymentUrl;
        } else if (responseObj.paymentId) {
          paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${responseObj.paymentId}`;
        }
      } else if (response.data.result) {
        paymentUrl = response.data.result;
      } else if (response.data.paymentUrl) {
        paymentUrl = response.data.paymentUrl;
      } else if (response.data.paymentId) {
        paymentUrl = `${BENEFIT_PAY_BASE_URL}?paymentid=${response.data.paymentId}`;
      }
    }

    console.log('✅ ========== BENEFIT PAY QR SESSION CREATED ==========\n');
    
    return {
      success: true,
      sessionId: orderId,
      qrCodeUrl: paymentUrl,
      paymentUrl: paymentUrl,
      transactionId: orderId,
      reference: orderId
    };

  } catch (error) {
    console.error('\n❌ ========== BENEFIT PAY QR SESSION ERROR ==========');
    console.error('❌ Error Message:', error.message);
    
    if (error.response) {
      console.error('❌ Response Status:', error.response.status);
      console.error('❌ Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('❌ Response Data:', typeof error.response.data === 'string' 
        ? error.response.data.substring(0, 500) 
        : JSON.stringify(error.response.data, null, 2));
    }
    console.error('❌ ================================================\n');
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create BENEFIT PAY QR session'
    };
  }
};
export const handleBenefitPayWebhook = async (webhookData) => {
  try {
    console.log('\n🔔 ========== BENEFIT PAY WEBHOOK RECEIVED ==========');
    console.log('📥 Webhook Data:', JSON.stringify(webhookData, null, 2));
    
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
