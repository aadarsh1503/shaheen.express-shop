import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Invoice from '../../components/Invoice/Invoice';
import PaymentLoader from '../../components/PaymentLoader/PaymentLoader';
import { API_URL } from '../../pages/frontend-admin/services/api';

const PaymentCallback = ({ onEmptyCart }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [showInvoice, setShowInvoice] = useState(false);
  const hasVerified = useRef(false);

  useEffect(() => {
    // Prevent duplicate verification
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      const resultIndicator = searchParams.get('resultIndicator');
      const transactionId = searchParams.get('transactionId');
      const gateway = searchParams.get('gateway');
      const status = searchParams.get('status');
      const result = searchParams.get('result'); // BENEFIT PAY result parameter
      const trackid = searchParams.get('trackid'); // BENEFIT PAY track ID
      const errorParam = searchParams.get('error'); // Check for error parameter
      const ErrorText = searchParams.get('ErrorText'); // BENEFIT PAY error text
      const authRespCode = searchParams.get('authRespCode'); // Auth response code
      
      // TEST MODE: Allow manual testing with test=success parameter
      const testMode = searchParams.get('test');
      
      // Get orderId and other data from URL/sessionStorage
      const orderIdFromUrl = searchParams.get('orderId');
      const orderId = orderIdFromUrl || sessionStorage.getItem('pendingOrderId');
      const paymentMethod = sessionStorage.getItem('pendingPaymentMethod');
      const orderTotal = sessionStorage.getItem('pendingOrderTotal');
      const orderCurrency = sessionStorage.getItem('pendingOrderCurrency');
      const cartItemsStr = sessionStorage.getItem('pendingCartItems');

      console.log('🔍 Payment Callback - Gateway:', gateway);
      console.log('🔍 Payment Callback - resultIndicator:', resultIndicator);
      console.log('🔍 Payment Callback - transactionId:', transactionId);
      console.log('🔍 Payment Callback - status:', status);
      console.log('🔍 Payment Callback - error:', errorParam);
      console.log('🔍 Payment Callback - result:', result);
      console.log('🔍 Payment Callback - ErrorText:', ErrorText);
      console.log('🔍 Payment Callback - authRespCode:', authRespCode);
      console.log('🔍 Payment Callback - TEST MODE:', testMode);
      console.log('📦 Retrieved orderId:', orderId);
      console.log('💳 Payment method:', paymentMethod);

      // TEST MODE: Simulate successful payment
      if (testMode === 'success' && (gateway === 'benefit' || paymentMethod === 'benefitpay')) {
        console.log('✅ TEST MODE: Simulating successful BENEFIT PAY payment');
        
        sessionStorage.removeItem('pendingOrderId');
        sessionStorage.removeItem('pendingPaymentMethod');
        sessionStorage.removeItem('pendingOrderTotal');
        sessionStorage.removeItem('pendingOrderCurrency');
        sessionStorage.removeItem('pendingCartItems');
        
        const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];
        
        const orderData = {
          orderId: orderId || 'TEST123',
          total: parseFloat(orderTotal || '100'),
          currency: orderCurrency || 'BHD',
          paymentMethod: 'BENEFIT PAY',
          items: cartItems,
          order_id: orderId || 'TEST123',
          total_amount: orderTotal || '100',
          payment_status: 'COMPLETED',
          payment_method: 'benefitpay',
          created_at: new Date().toISOString(),
          first_name: 'Test',
          last_name: 'Customer',
          email: 'test@example.com',
          phone: '+973 XXXX XXXX',
          street_address: 'Test Address',
          city: 'Manama',
          country: 'Bahrain'
        };
        
        setOrderDetails(orderData);
        
        // Empty cart after successful payment
        if (onEmptyCart) {
          await onEmptyCart(true); // Make it async
        }
        
        // Force refresh cart state
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        
        toast.success('TEST MODE: Payment successful!', { toastId: 'payment-success' });
        setIsVerifying(false);
        return;
      }
      
      if (!orderId) {
        console.warn('⚠️ No pending order found, redirecting...');
        setTimeout(() => navigate('/my-account?tab=orders'), 2000);
        return;
      }

      // Check if payment was cancelled or failed
      if (errorParam || status === 'cancelled' || status === 'failed' || status === 'FAILED' || result === 'CANCELLED' || result === 'FAILED' || ErrorText) {
        console.warn('⚠️ Payment was cancelled or failed');
        setPaymentFailed(true);
        setErrorMessage(
          ErrorText ? `Payment failed: ${ErrorText}` :
          errorParam === 'payment_failed' ? 'Payment processing failed' :
          status === 'cancelled' || result === 'CANCELLED' ? 'Payment was cancelled' :
          status === 'failed' || status === 'FAILED' || result === 'FAILED' ? 'Payment failed' :
          'Payment could not be completed'
        );
        setIsVerifying(false);
        return;
      }
      
      // For BENEFIT PAY with result=CAPTURED or authRespCode=00, mark as success
      if ((result === 'CAPTURED' || authRespCode === '00') && (gateway === 'benefit' || paymentMethod === 'benefitpay')) {
        console.log('✅ BENEFIT PAY payment successful from URL params');
        // Skip verification, directly show success
        const orderIdToUse = orderIdFromUrl || orderId;
        
        // Clear session storage
        sessionStorage.removeItem('pendingOrderId');
        sessionStorage.removeItem('pendingPaymentMethod');
        sessionStorage.removeItem('pendingOrderTotal');
        sessionStorage.removeItem('pendingOrderCurrency');
        sessionStorage.removeItem('pendingCartItems');
        
        const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];
        
        const orderData = {
          orderId: orderIdToUse,
          total: parseFloat(orderTotal),
          currency: orderCurrency,
          paymentMethod: 'BENEFIT PAY',
          items: cartItems,
          order_id: orderIdToUse,
          total_amount: orderTotal,
          payment_status: 'COMPLETED',
          payment_method: paymentMethod,
          created_at: new Date().toISOString(),
          first_name: 'Customer',
          last_name: '',
          email: 'customer@email.com',
          phone: '+973 XXXX XXXX',
          street_address: 'Customer Address',
          city: 'Manama',
          country: 'Bahrain'
        };
        
        setOrderDetails(orderData);
        
        // Empty cart after successful payment
        if (onEmptyCart) {
          await onEmptyCart(true); // Make it async
        }
        
        // Force refresh cart state
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
        
        toast.success('BENEFIT PAY payment successful!', { toastId: 'payment-success' });
        setIsVerifying(false);
        return;
      }

      console.log('📦 Retrieved orderId:', orderId);
      console.log('💳 Payment method:', paymentMethod);

      if (!orderId) {
        console.warn('⚠️ No pending order found, redirecting...');
        setTimeout(() => navigate('/my-account?tab=orders'), 2000);
        return;
      }

      try {
        const verificationPayload = {
          orderId,
          gateway: gateway || (paymentMethod === 'benefitpay' ? 'benefit' : 'mpgs')
        };

        // Add appropriate verification data based on gateway
        if (gateway === 'benefit' || paymentMethod === 'benefitpay') {
          verificationPayload.transactionId = transactionId;
          verificationPayload.status = status;
          verificationPayload.result = result; // BENEFIT PAY result
          verificationPayload.trackid = trackid; // BENEFIT PAY track ID
        } else {
          verificationPayload.resultIndicator = resultIndicator;
        }

        const response = await axios.post(`${API_URL}/payment/verify-payment`, verificationPayload);

        console.log('✅ Verification Response:', response.data);

        if (response.data.success) {
          // Clear session storage
          sessionStorage.removeItem('pendingOrderId');
          sessionStorage.removeItem('pendingPaymentMethod');
          sessionStorage.removeItem('pendingOrderTotal');
          sessionStorage.removeItem('pendingOrderCurrency');
          sessionStorage.removeItem('pendingCartItems');

          // Parse cart items
          const cartItems = cartItemsStr ? JSON.parse(cartItemsStr) : [];

          const orderData = {
            orderId,
            total: parseFloat(orderTotal),
            currency: orderCurrency,
            paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 
                          paymentMethod === 'benefitpay' ? 'BENEFIT PAY' : 
                          paymentMethod === 'debit' ? 'Debit Card' : 'Unknown',
            items: cartItems,
            // Add additional order details for invoice
            order_id: orderId,
            total_amount: orderTotal,
            payment_status: 'COMPLETED',
            payment_method: paymentMethod,
            created_at: new Date().toISOString(),
            first_name: 'Customer', // These would come from the actual order data
            last_name: '',
            email: 'customer@email.com',
            phone: '+973 XXXX XXXX',
            street_address: 'Customer Address',
            city: 'Manama',
            country: 'Bahrain'
          };

          setOrderDetails(orderData);

          // Empty the cart after successful payment
          if (onEmptyCart) {
            await onEmptyCart(true); // Make it async
          }
          
          // Force refresh cart state
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('storage'));

          const successMessage = gateway === 'benefit' || paymentMethod === 'benefitpay' 
            ? 'BENEFIT PAY payment verified successfully!' 
            : 'Payment verified successfully!';
          
          toast.success(successMessage, { toastId: 'payment-success' });
        } else {
          const errorMessage = gateway === 'benefit' || paymentMethod === 'benefitpay'
            ? 'BENEFIT PAY verification failed'
            : 'Payment verification failed';
          
          setPaymentFailed(true);
          setErrorMessage(errorMessage);
          toast.error(errorMessage, { toastId: 'payment-error' });
        }
      } catch (err) {
        console.error('❌ Verification Error:', err);
        const errorMessage = gateway === 'benefit' || paymentMethod === 'benefitpay'
          ? 'BENEFIT PAY verification failed'
          : 'Payment verification failed';
        
        setPaymentFailed(true);
        setErrorMessage(errorMessage);
        toast.error(errorMessage, { toastId: 'payment-error' });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isVerifying && orderDetails && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Refresh the entire website and navigate to orders
      window.location.href = '/my-account?tab=orders';
    }
  }, [countdown, isVerifying, orderDetails]);

  // Loading state
  if (isVerifying) {
    return (
      <PaymentLoader 
        title="Verifying Your Payment"
        message="Please wait while we confirm your transaction..."
        type="verifying"
      />
    );
  }

  // Error/Cancellation state
  if (paymentFailed) {
    return (
      <>
        {/* Blurred Background Overlay */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"></div>
        
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-gradient-to-br from-red-50/80 to-orange-50/80 z-40"></div>
        
        {/* Main Content */}
        <div className="fixed inset-0 flex items-center justify-center p-6 pt-20 pb-6 z-50 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full animate-[slideUp_0.3s_ease-out] relative border border-white/20">
            {/* Sad Face Icon */}
            <div className="bg-gradient-to-br from-red-50/90 to-orange-50/90 backdrop-blur-sm pt-8 pb-6 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-3 shadow-lg">
                <span className="text-4xl">😔</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
              <p className="text-gray-600 text-sm">{errorMessage || 'Your payment was not completed'}</p>
              <p className="text-xs text-gray-500 mt-2">Don't worry, you can try again</p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-6 space-y-3 bg-white/50 backdrop-blur-sm">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-[#EC2027] hover:bg-[#d11d22] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Package size={18} />
                Return to Cart
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>

            {/* Help Text */}
            <div className="px-6 pb-6">
              <div className="text-center py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30">
                <p className="text-gray-600 text-xs">
                  Need help? Contact our support team
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success state with modal
  if (orderDetails) {
    return (
      <>
        {/* Blurred Background Overlay */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"></div>
        
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-50/80 to-emerald-50/80 z-40"></div>
        
        {/* Main Content */}
        <div className="fixed inset-0 flex items-center justify-center p-6 pt-20 pb-6 z-50 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto animate-[slideUp_0.3s_ease-out] relative border border-white/20">
            {/* Close Button */}
            <button
              onClick={() => window.location.href = '/my-account?tab=orders'}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/90"
            >
              <X size={18} />
            </button>

            {/* Success Icon */}
            <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm pt-8 pb-6 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3 animate-[bounce_0.6s_ease-in-out] shadow-lg">
                <CheckCircle size={36} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 text-sm">Your order has been placed successfully</p>
              <p className="text-xs text-gray-500 mt-2">Redirecting in {countdown} seconds...</p>
            </div>

            {/* Order Details */}
            <div className="px-6 py-4 space-y-4 bg-white/50 backdrop-blur-sm">
              {/* Order Summary Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-[#EC2027]" />
                  <h3 className="font-semibold text-gray-800">Order Details</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Order ID:</span>
                    <span className="font-mono font-semibold text-gray-800 bg-gray-100/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      #{orderDetails.orderId}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 text-sm">Payment:</span>
                    <span className="font-medium text-gray-800 bg-blue-50/80 text-blue-800 px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                      {orderDetails.paymentMethod}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-300/50 pt-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total:</span>
                      <span className="text-xl font-bold text-[#EC2027]">
                        {orderDetails.total.toFixed(3)} {orderDetails.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary Card - Compact */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                    <Package size={14} className="text-[#EC2027]" />
                    Items ({orderDetails.items.length})
                  </h4>
                  
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/90 backdrop-blur-sm rounded border border-gray-100/50">
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-800 text-sm font-medium truncate block">{item.name}</span>
                          <span className="text-gray-500 text-xs">× {item.quantity}</span>
                        </div>
                        <div className="text-right ml-2">
                          <span className="font-semibold text-gray-800 text-sm">
                            {(item.price * item.quantity).toFixed(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message - Compact */}
              <div className="text-center py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30">
                <p className="text-gray-600 text-xs">
                  🎉 Order processed successfully!
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Confirmation email sent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        {showInvoice && orderDetails && (
          <Invoice 
            order={orderDetails} 
            onClose={() => setShowInvoice(false)} 
            isModal={true} 
          />
        )}
      </>
    );
  }

  // Fallback
  return null;
};

export default PaymentCallback;
