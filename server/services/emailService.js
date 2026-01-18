import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to take our messages');
  }
});

// Customer email template
const getCustomerEmailTemplate = (orderData) => {
  const { order, items, customerDetails } = orderData;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Shaheen Express</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #EC2027 0%, #000000 100%); padding: 30px; text-align: center;">
                            <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1768639827/i1-3Ew8TKSD_dit20k.png" alt="Shaheen Express" style="max-width: 150px; height: auto; margin-bottom: 15px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Order Confirmation</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Thank you for your order!</p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #EC2027; margin: 0 0 20px 0; font-size: 24px;">Hello ${customerDetails.firstName}!</h2>
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                Your order has been successfully placed and is being processed. Here are your order details:
                            </p>
                            
                            <!-- Order Info Table -->
                            <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px; margin: 20px 0;">
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Order ID:</strong>
                                        <span style="color: #333333; font-family: monospace;">#${order.order_id}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Payment Method:</strong>
                                        <span style="color: #333333; text-transform: capitalize;">${order.payment_method}</span>
                                    </td>
                                </tr>
                                ${order.payment_method !== 'cod' && order.order_status && order.order_status !== 'PENDING' && order.order_status !== 'CONFIRMED' ? `
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Transaction ID:</strong>
                                        <span style="color: #333333; font-family: monospace; font-size: 12px;">${order.order_status}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Order Date:</strong>
                                        <span style="color: #333333;">${new Date(order.created_at).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong style="color: #EC2027;">Total Amount:</strong>
                                        <span style="color: #333333; font-size: 18px; font-weight: bold;">${parseFloat(order.total_amount).toFixed(3)} ${order.currency}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Items -->
                            <h3 style="color: #EC2027; margin: 30px 0 15px 0; font-size: 20px;">Order Items</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                                ${items.map((item, index) => `
                                <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
                                    <td style="padding: 15px; width: 80px;">
                                        ${item.image ? `<img src="${item.image}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #e0e0e0; border-radius: 4px;">` : '<div style="width: 60px; height: 60px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #999;">No Image</div>'}
                                    </td>
                                    <td style="padding: 15px;">
                                        <strong style="color: #333333; font-size: 14px;">${item.product_name}</strong><br>
                                        <span style="color: #666666; font-size: 12px;">Quantity: ${item.quantity}</span>
                                    </td>
                                    <td style="padding: 15px; text-align: right;">
                                        <strong style="color: #EC2027; font-size: 14px;">${parseFloat(item.price).toFixed(3)} ${order.currency}</strong><br>
                                        <span style="color: #666666; font-size: 12px;">Total: ${(parseFloat(item.price) * item.quantity).toFixed(3)} ${order.currency}</span>
                                    </td>
                                </tr>
                                `).join('')}
                            </table>
                            
                            <!-- Billing Address -->
                            <h3 style="color: #EC2027; margin: 30px 0 15px 0; font-size: 20px;">Billing & Shipping Address</h3>
                            <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px;">
                                <tr>
                                    <td>
                                        <strong style="color: #333333;">${customerDetails.firstName} ${customerDetails.lastName}</strong><br>
                                        ${customerDetails.company ? `<span style="color: #666666;">${customerDetails.company}</span><br>` : ''}
                                        <span style="color: #666666;">${customerDetails.streetAddress}</span><br>
                                        ${customerDetails.apartment ? `<span style="color: #666666;">${customerDetails.apartment}</span><br>` : ''}
                                        <span style="color: #666666;">${customerDetails.city}, ${customerDetails.country}</span><br>
                                        ${customerDetails.postcode ? `<span style="color: #666666;">${customerDetails.postcode}</span><br>` : ''}
                                        <br>
                                        <strong style="color: #EC2027;">Email:</strong> <span style="color: #666666;">${customerDetails.email}</span><br>
                                        <strong style="color: #EC2027;">Phone:</strong> <span style="color: #666666;">${customerDetails.phone}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #333333; padding: 30px; text-align: center;">
                            <h3 style="color: #EC2027; margin: 0 0 15px 0; font-size: 18px;">Shaheen Express</h3>
                            <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.6;">
                                Thank you for choosing Shaheen Express for your shipping needs.<br>
                                If you have any questions, please don't hesitate to contact us.
                            </p>
                            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

// Admin email template
const getAdminEmailTemplate = (orderData) => {
  const { order, items, customerDetails } = orderData;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification - Shaheen Express</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #000000 0%, #EC2027 100%); padding: 30px; text-align: center;">
                            <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1768639827/i1-3Ew8TKSD_dit20k.png" alt="Shaheen Express" style="max-width: 150px; height: auto; margin-bottom: 15px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🚨 New Order Alert</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Admin Notification</p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #EC2027; margin: 0 0 20px 0; font-size: 24px;">New Order Received!</h2>
                            <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                                A new order has been placed on Shaheen Express. Please review the details below:
                            </p>
                            
                            <!-- Order Info Table -->
                            <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px; margin: 20px 0;">
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Order ID:</strong>
                                        <span style="color: #333333; font-family: monospace;">#${order.order_id}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Customer:</strong>
                                        <span style="color: #333333;">${customerDetails.firstName} ${customerDetails.lastName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Email:</strong>
                                        <span style="color: #333333;">${customerDetails.email}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Phone:</strong>
                                        <span style="color: #333333;">${customerDetails.phone}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Payment Method:</strong>
                                        <span style="color: #333333; text-transform: capitalize;">${order.payment_method}</span>
                                    </td>
                                </tr>
                                ${order.payment_method !== 'cod' && order.order_status && order.order_status !== 'PENDING' && order.order_status !== 'CONFIRMED' ? `
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Transaction ID:</strong>
                                        <span style="color: #333333; font-family: monospace; font-size: 12px;">${order.order_status}</span>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="border-bottom: 1px solid #e0e0e0;">
                                        <strong style="color: #EC2027;">Order Date:</strong>
                                        <span style="color: #333333;">${new Date(order.created_at).toLocaleDateString('en-US', { 
                                          year: 'numeric', 
                                          month: 'long', 
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong style="color: #EC2027;">Total Amount:</strong>
                                        <span style="color: #333333; font-size: 18px; font-weight: bold;">${parseFloat(order.total_amount).toFixed(3)} ${order.currency}</span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Customer Address -->
                            <h3 style="color: #EC2027; margin: 30px 0 15px 0; font-size: 20px;">Customer Address</h3>
                            <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8f8f8; border-radius: 8px; margin: 0 0 20px 0;">
                                <tr>
                                    <td>
                                        <strong style="color: #333333;">${customerDetails.firstName} ${customerDetails.lastName}</strong><br>
                                        ${customerDetails.company ? `<span style="color: #666666;">${customerDetails.company}</span><br>` : ''}
                                        <span style="color: #666666;">${customerDetails.streetAddress}</span><br>
                                        ${customerDetails.apartment ? `<span style="color: #666666;">${customerDetails.apartment}</span><br>` : ''}
                                        <span style="color: #666666;">${customerDetails.city}, ${customerDetails.country}</span><br>
                                        ${customerDetails.postcode ? `<span style="color: #666666;">${customerDetails.postcode}</span><br>` : ''}
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Items -->
                            <h3 style="color: #EC2027; margin: 30px 0 15px 0; font-size: 20px;">Order Items (${items.length} items)</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                                ${items.map((item, index) => `
                                <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f9f9f9'};">
                                    <td style="padding: 15px; width: 80px;">
                                        ${item.image ? `<img src="${item.image}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #e0e0e0; border-radius: 4px;">` : '<div style="width: 60px; height: 60px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #999;">No Image</div>'}
                                    </td>
                                    <td style="padding: 15px;">
                                        <strong style="color: #333333; font-size: 14px;">${item.product_name}</strong><br>
                                        <span style="color: #666666; font-size: 12px;">Product ID: ${item.product_id}</span><br>
                                        <span style="color: #666666; font-size: 12px;">Quantity: ${item.quantity}</span>
                                    </td>
                                    <td style="padding: 15px; text-align: right;">
                                        <strong style="color: #EC2027; font-size: 14px;">${parseFloat(item.price).toFixed(3)} ${order.currency}</strong><br>
                                        <span style="color: #666666; font-size: 12px;">Total: ${(parseFloat(item.price) * item.quantity).toFixed(3)} ${order.currency}</span>
                                    </td>
                                </tr>
                                `).join('')}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #333333; padding: 30px; text-align: center;">
                            <h3 style="color: #EC2027; margin: 0 0 15px 0; font-size: 18px;">Shaheen Express Admin Panel</h3>
                            <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.6;">
                                Please process this order as soon as possible.<br>
                                Login to the admin panel to manage this order.
                            </p>
                            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                                This is an automated admin notification.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

// Send order confirmation emails
export const sendOrderConfirmationEmails = async (orderData) => {
  try {
    const { customerDetails } = orderData;
    
    // Send email to customer
    const customerMailOptions = {
      from: `"Shaheen Express" <${process.env.EMAIL_FROM}>`,
      to: customerDetails.email,
      subject: `Order Confirmation #${orderData.order.order_id} - Shaheen Express`,
      html: getCustomerEmailTemplate(orderData),
    };

    // Send email to admin
    const adminMailOptions = {
      from: `"Shaheen Express" <${process.env.EMAIL_FROM}>`,
      to: 'info@shaheen.express',
      subject: `🚨 New Order #${orderData.order.order_id} - Shaheen Express`,
      html: getAdminEmailTemplate(orderData),
    };

    // Send both emails
    const [customerResult, adminResult] = await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log('✅ Customer email sent:', customerResult.messageId);
    console.log('✅ Admin email sent:', adminResult.messageId);

    return { success: true, customerResult, adminResult };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export default { sendOrderConfirmationEmails };