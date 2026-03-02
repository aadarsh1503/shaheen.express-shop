import { useState, useEffect } from 'react';
import { X, QrCode, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../pages/frontend-admin/services/api';

const BenefitPayQR = ({ orderId, amount, currency, onSuccess, onCancel }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, checking, success, failed
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    generateQRCode();
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Generating QR code for order:', orderId);

      const response = await axios.post(`${API_URL}/payment/benefit-qr`, {
        orderId,
        amount,
        currency: currency || 'BHD'
      });

      console.log('✅ QR Response:', response.data);

      if (response.data.success && response.data.qrCodeUrl) {
        setQrCodeUrl(response.data.qrCodeUrl);
        // Start polling for payment status
        startPolling();
      } else {
        setError(response.data.message || 'Failed to generate QR code');
      }
    } catch (err) {
      console.error('❌ QR Code generation error:', err);
      setError(err.response?.data?.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    // Poll every 3 seconds to check payment status
    const interval = setInterval(async () => {
      try {
        setPaymentStatus('checking');
        const response = await axios.get(`${API_URL}/payment/check-status/${orderId}`);
        
        if (response.data.success) {
          const status = response.data.paymentStatus;
          
          if (status === 'APPROVED' || status === 'COMPLETED') {
            setPaymentStatus('success');
            clearInterval(interval);
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 1500);
          } else if (status === 'FAILED' || status === 'CANCELLED') {
            setPaymentStatus('failed');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
    }, 3000);

    setPollingInterval(interval);
  };

  const handleCancel = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    if (onCancel) onCancel();
  };

  const openInNewTab = () => {
    if (qrCodeUrl) {
      window.open(qrCodeUrl, '_blank', 'width=600,height=800');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-[slideUp_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <QrCode size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">BENEFIT PAY QR</h2>
          <p className="text-gray-600 text-sm">Scan to pay with your mobile banking app</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-red-600 text-center mb-4">{error}</p>
            <button
              onClick={generateQRCode}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* QR Code Display - Using iframe to show BENEFIT PAY page */}
        {qrCodeUrl && !isLoading && !error && (
          <div className="space-y-6">
            {/* Amount Display */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-800">
                {parseFloat(amount).toFixed(3)} {currency || 'BHD'}
              </p>
            </div>

            {/* BENEFIT PAY Payment Page in iframe */}
            <div className="bg-white border-4 border-gray-200 rounded-xl overflow-hidden">
              <iframe
                src={qrCodeUrl}
                className="w-full h-[500px]"
                title="BENEFIT PAY QR Code"
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            </div>

            {/* Open in New Tab Button */}
            <button
              onClick={openInNewTab}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Open in New Tab
            </button>

            {/* Status Indicator */}
            {paymentStatus === 'checking' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-medium">Checking payment status...</span>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">Payment successful!</span>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">Payment failed</span>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800 mb-2">How to pay:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Scan the QR code shown above with your mobile banking app</li>
                <li>Or click "Open in New Tab" to view on mobile device</li>
                <li>Confirm the payment amount</li>
                <li>Complete the payment</li>
              </ol>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenefitPayQR;
