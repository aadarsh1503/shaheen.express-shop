import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, X, Loader, FileText } from 'lucide-react';
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
  const [countdown, setCountdown] = useState(5);
  const [showInvoice, setShowInvoice] = useState(false);
  const hasVerified = useRef(false);

  useEffect(() => {
    // Prevent duplicate verification
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPayment = async () => {
      const resultIndicator = searchParams.get('resultIndicator');
      const sessionVersion = searchParams.get('sessionVersion');

      console.log('🔍 Payment Callback - resultIndicator:', resultIndicator);
      console.log('🔍 Payment Callback - sessionVersion:', sessionVersion);

      // Get orderId from URL parameters first, then fallback to sessionStorage
      const orderIdFromUrl = searchParams.get('orderId');
      const orderId = orderIdFromUrl || sessionStorage.getItem('pendingOrderId');
      const paymentMethod = sessionStorage.getItem('pendingPaymentMethod');
      const orderTotal = sessionStorage.getItem('pendingOrderTotal');
      const orderCurrency = sessionStorage.getItem('pendingOrderCurrency');
      const cartItemsStr = sessionStorage.getItem('pendingCartItems');

      console.log('📦 Retrieved orderId:', orderId);

      if (!orderId) {
        console.warn('⚠️ No pending order found, redirecting...');
        setTimeout(() => navigate('/my-account?tab=orders'), 2000);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/payment/verify-payment`, {
          orderId,
          resultIndicator
        });

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
                          paymentMethod === 'benefit' ? 'Benefit Pay' : 'Debit Card',
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

          // Empty the cart (silently, no toast)
          if (onEmptyCart) {
            onEmptyCart(true);
          }

          toast.success('Payment verified successfully!', { toastId: 'payment-success' });
        } else {
          toast.error('Payment verification failed', { toastId: 'payment-error' });
          setTimeout(() => navigate('/checkout'), 3000);
        }
      } catch (err) {
        console.error('❌ Verification Error:', err);
        toast.error('Payment verification failed', { toastId: 'payment-error' });
        setTimeout(() => navigate('/checkout'), 3000);
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
      navigate('/my-account?tab=orders');
    }
  }, [countdown, isVerifying, orderDetails, navigate]);

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

  // Success state with modal
  if (orderDetails) {
    return (
      <>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-[slideUp_0.3s_ease-out] relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => navigate('/my-account?tab=orders')}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Success Icon */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 pt-12 pb-8 px-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-[bounce_0.6s_ease-in-out]">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600">Your order has been placed successfully</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting in {countdown} seconds...</p>
            </div>

            {/* Order Details */}
            <div className="px-8 py-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={20} className="text-[#EC2027]" />
                  <h3 className="font-semibold text-gray-800">Order Details</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono font-semibold text-gray-800">#{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-800">{orderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-[#EC2027]">
                      {orderDetails.total.toFixed(3)} {orderDetails.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-40 overflow-y-auto">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Items Ordered:</h4>
                  <div className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} × {item.quantity}</span>
                        <span className="text-gray-600">{(item.price * item.quantity).toFixed(3)} {orderDetails.currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {/* <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  View Invoice
                </button>
                <button
                  onClick={() => navigate('/my-account?tab=orders')}
                  className="flex-1 bg-[#EC2027] text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div> */}
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
