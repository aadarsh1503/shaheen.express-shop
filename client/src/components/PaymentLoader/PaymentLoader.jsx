import { Lock, CheckCircle, CreditCard } from 'lucide-react';

const PaymentLoader = ({ 
  title = "Processing Payment", 
  message = "Please wait while we securely process your payment...",
  type = "processing" // "processing", "verifying", "success"
}) => {
  const getIcon = () => {
    switch (type) {
      case "verifying":
        return <CheckCircle size={32} className="text-white" />;
      case "success":
        return <CheckCircle size={32} className="text-white" />;
      default:
        return <CreditCard size={32} className="text-white" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "verifying":
        return {
          bg: "from-green-500 to-green-600",
          accent: "bg-green-500",
          border: "border-green-200",
          bgLight: "bg-green-50",
          text: "text-green-800",
          textLight: "text-green-600"
        };
      case "success":
        return {
          bg: "from-blue-500 to-blue-600",
          accent: "bg-blue-500",
          border: "border-blue-200",
          bgLight: "bg-blue-50",
          text: "text-blue-800",
          textLight: "text-blue-600"
        };
      default:
        return {
          bg: "from-[#EC2027] to-red-600",
          accent: "bg-[#EC2027]",
          border: "border-red-200",
          bgLight: "bg-red-50",
          text: "text-red-800",
          textLight: "text-red-600"
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-[fadeIn_0.3s_ease-out]">
        <div className="relative mb-6">
          <div className={`absolute inset-0 ${colors.accent} opacity-20 blur-2xl rounded-full`}></div>
          <div className={`relative w-20 h-20 mx-auto bg-gradient-to-br ${colors.bg} rounded-full flex items-center justify-center`}>
            {type === "processing" ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              getIcon()
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        
        <div className="flex justify-center gap-2 mb-4">
          <div className={`w-2 h-2 ${colors.accent} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-2 h-2 ${colors.accent} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-2 h-2 ${colors.accent} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <div className={`${colors.bgLight} border ${colors.border} rounded-lg p-4`}>
          <div className={`flex items-center gap-2 ${colors.text} text-sm`}>
            <Lock size={16} />
            <span className="font-medium">Secure Payment Processing</span>
          </div>
          <p className={`${colors.textLight} text-xs mt-1`}>
            {type === "verifying" 
              ? "We're confirming the details with your bank..." 
              : "Your payment is being processed securely. Please do not close this window."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentLoader;