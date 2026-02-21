import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BenefitPayTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const param = searchParams.get('param');
  const orderId = searchParams.get('orderId') || 'TEST_ORDER';

  const handlePayment = (result) => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const transactionId = 'BENEFIT_' + Date.now();
      const callbackUrl = `http://localhost:5000/api/payment/benefit-callback?trackid=${orderId}&paymentid=${transactionId}&result=${result}&param=${param}`;
      
      // Redirect to backend callback
      window.location.href = callbackUrl;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        {/* BENEFIT PAY Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">B</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BENEFIT PAY</h1>
          <p className="text-gray-600">Test Payment Gateway</p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant:</span>
              <span className="font-medium">Shaheen Express</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-xs">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="text-green-600 font-medium">TEST</span>
            </div>
          </div>
        </div>

        {/* Test Payment Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-4">Test Payment Scenarios</h3>
          
          <button
            onClick={() => handlePayment('CAPTURED')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            ✅ Simulate Successful Payment (CAPTURED)
          </button>
          
          <button
            onClick={() => handlePayment('NOT CAPTURED')}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            ❌ Simulate Failed Payment (NOT CAPTURED)
          </button>
          
          <button
            onClick={() => handlePayment('CANCELED')}
            disabled={loading}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            🚫 Simulate Cancelled Payment
          </button>
          
          <button
            onClick={() => handlePayment('DENIED BY RISK')}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            ⚠️ Simulate Risk Denial
          </button>
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Processing payment...
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/checkout')}
          disabled={loading}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel & Return to Checkout
        </button>

        {/* Debug Info */}
        {param && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p className="font-semibold text-gray-700 mb-1">Encrypted Parameter:</p>
            <p className="text-gray-600 break-all font-mono">{param.substring(0, 50)}...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitPayTest;