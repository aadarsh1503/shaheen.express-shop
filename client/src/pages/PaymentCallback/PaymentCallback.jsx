import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { API_URL } from '../../pages/frontend-admin/services/api';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('orderId');
      const resultIndicator = searchParams.get('resultIndicator');

      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid payment session');
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/payment/verify-payment`, {
          orderId,
          resultIndicator
        });

        if (response.data.success && response.data.paymentStatus === 'COMPLETED') {
          setStatus('success');
          setMessage('Payment successful! Your order has been placed.');
          
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate('/my-account?tab=orders');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Payment verification failed. Please try again or contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {status === 'success' && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="mb-6 flex justify-center">
              <Loader className="h-20 w-20 text-[#EC2027] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 opacity-20 blur-2xl rounded-full"></div>
                <CheckCircle className="relative h-20 w-20 text-green-500" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800 font-semibold">
                Redirecting to your orders...
              </p>
            </div>
            <button
              onClick={() => navigate('/my-account?tab=orders')}
              className="bg-gradient-to-r from-[#EC2027] to-red-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
            >
              View My Orders
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 opacity-20 blur-2xl rounded-full"></div>
                <XCircle className="relative h-20 w-20 text-red-500" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-gradient-to-r from-[#EC2027] to-red-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
              >
                Return to Cart
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl hover:bg-gray-300 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
