import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, CheckCircle, Package, X, FileText, MapPin, Plus, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Invoice from '../../components/Invoice/Invoice';
import PaymentLoader from '../../components/PaymentLoader/PaymentLoader';
import { API_URL } from '../../pages/frontend-admin/services/api';

// ---------------- InputField ----------------
const InputField = ({ id, label, placeholder, required = true, type = 'text', className = '' }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
      />
    </div>
  );
};

// ---------------- CheckoutPage ----------------
const CheckoutPage = ({ cartItems, onEmptyCart }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingOption, setShippingOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [showPaymentLoader, setShowPaymentLoader] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  // Countdown timer for success modal
  useEffect(() => {
    if (showSuccessModal && orderDetails && successCountdown > 0) {
      const timer = setTimeout(() => {
        setSuccessCountdown(successCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (successCountdown === 0 && showSuccessModal) {
      navigate('/my-account?tab=orders');
    }
  }, [successCountdown, showSuccessModal, orderDetails, navigate]);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSavedAddresses(response.data.addresses);
        // Auto-select default address if available
        const defaultAddress = response.data.addresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Get current user info
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both response.data.user and response.data directly
      return response.data.user || response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const { subtotal, shippingCost, total, vat, currency } = useMemo(() => {
    const subtotalCalc = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    const shippingCostCalc = shippingOption === 'delivery' ? 2.200 : 0;
    const totalCalc = subtotalCalc + shippingCostCalc;
    const vatCalc = totalCalc * 0.10;
    const currencyLabel = cartItems.length > 0 ? cartItems[0].currency : 'BHD';

    return {
      subtotal: subtotalCalc,
      shippingCost: shippingCostCalc,
      total: totalCalc,
      vat: vatCalc,
      currency: currencyLabel
    };
  }, [cartItems, shippingOption]);

  // ---------------- Place Order ----------------
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.warn('Please accept the terms and conditions.');
      return;
    }

    const formData = new FormData(e.target);
    let customerDetails;

    if (selectedAddress && !useNewAddress) {
      // Use selected saved address
      customerDetails = {
        firstName: selectedAddress.first_name,
        lastName: selectedAddress.last_name,
        company: selectedAddress.company || '',
        streetAddress: selectedAddress.street_address,
        apartment: selectedAddress.apartment || '',
        city: selectedAddress.city,
        country: selectedAddress.country,
        phone: selectedAddress.phone,
        email: selectedAddress.email
      };
    } else {
      // Use form data for new address
      customerDetails = Object.fromEntries(formData.entries());
    }

    // ---------------- COD ----------------
    if (paymentMethod === 'cod') {
      setIsProcessing(true);

      try {
        // Get current user info
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          toast.error('Please log in to place an order');
          setIsProcessing(false);
          return;
        }

        const response = await axios.post(`${API_URL}/payment/create-session`, {
          total,
          currency,
          customerDetails,
          cartItems,
          shippingOption,
          paymentMethod: 'cod',
          userId: currentUser.id
        });

        if (response.data.success) {
          const orderData = {
            orderId: response.data.orderId,
            total,
            currency,
            paymentMethod: 'Cash on Delivery',
            items: cartItems,
            // Add additional fields for invoice
            order_id: response.data.orderId,
            total_amount: total.toString(),
            payment_status: 'COMPLETED',
            payment_method: 'cod',
            created_at: new Date().toISOString(),
            first_name: customerDetails.firstName,
            last_name: customerDetails.lastName,
            email: customerDetails.email,
            phone: customerDetails.phone,
            street_address: customerDetails.streetAddress,
            city: customerDetails.city,
            country: customerDetails.country,
            company: customerDetails.company || ''
          };
          
          setOrderDetails(orderData);
          setShowSuccessModal(true);
          
          // Show success toast
          toast.success('Order placed successfully! You will receive a confirmation email shortly.', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          
          // Empty cart after a short delay to ensure modal shows first
          setTimeout(() => {
            onEmptyCart(true);
          }, 500);
        }
      } catch (err) {
        console.error('❌ COD Error:', err);
        toast.error('COD order failed');
      } finally {
        setIsProcessing(false);
      }

      return;
    }

    // ---------------- Card Payment (Credit, Debit, Benefit) ----------------
    if (paymentMethod === 'credit' || paymentMethod === 'debit' || paymentMethod === 'benefit') {
      setIsProcessing(true);

      try {
        // Get current user info
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          toast.error('Please log in to place an order');
          setIsProcessing(false);
          return;
        }

        const response = await axios.post(`${API_URL}/payment/create-session`, {
          total,
          currency,
          customerDetails,
          cartItems,
          shippingOption,
          paymentMethod,
          userId: currentUser.id
        });

        if (!response.data.success) {
          throw new Error('Session creation failed');
        }

        const { sessionId, orderId } = response.data;

        // Store order info in sessionStorage for callback page
        sessionStorage.setItem('pendingOrderId', orderId);
        sessionStorage.setItem('pendingPaymentMethod', paymentMethod);
        sessionStorage.setItem('pendingOrderTotal', total.toString());
        sessionStorage.setItem('pendingOrderCurrency', currency);
        sessionStorage.setItem('pendingCartItems', JSON.stringify(cartItems));

        const script = document.createElement('script');
        script.src = 'https://afs.gateway.mastercard.com/checkout/version/61/checkout.js';

        script.onload = () => {
          window.Checkout.configure({
            session: { id: sessionId },
            order: {
              amount: total.toFixed(3),
              currency,
              id: orderId
            },
            customer: {
              email: customerDetails.email,
              firstName: customerDetails.firstName,
              lastName: customerDetails.lastName,
              phone: customerDetails.phone
            },
            billing: {
              address: {
                street: customerDetails.streetAddress,
                street2: customerDetails.apartment || '',
                city: customerDetails.city,
                postcodeZip: customerDetails.postcode || '',
                country: customerDetails.country === 'Bahrain' ? 'BHR' : 
                         customerDetails.country === 'Saudi Arabia' ? 'SAU' : 
                         customerDetails.country === 'UAE' ? 'ARE' : 'BHR'
              }
            },
            interaction: {
              operation: 'PURCHASE',
              merchant: {
                name: 'Shaheen Express'
              }
            }
          });
          
          // Show payment loader immediately when payment page opens
          setShowPaymentLoader(true);
          
          window.Checkout.showPaymentPage();
        };

        script.onerror = () => {
          console.error('❌ MPGS Script Load Failed');
          toast.error('Payment gateway failed');
          setIsProcessing(false);
        };

        window.completeCallback = async (resultIndicator) => {
          try {
            const verify = await axios.post(`${API_URL}/payment/verify-payment`, {
              orderId,
              resultIndicator
            });

            if (verify.data.success) {
              const orderData = {
                orderId,
                total,
                currency,
                paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 
                              paymentMethod === 'benefit' ? 'Benefit Pay' : 'Debit Card',
                items: cartItems,
                // Add additional fields for invoice
                order_id: orderId,
                total_amount: total.toString(),
                payment_status: 'COMPLETED',
                payment_method: paymentMethod,
                created_at: new Date().toISOString(),
                first_name: customerDetails.firstName,
                last_name: customerDetails.lastName,
                email: customerDetails.email,
                phone: customerDetails.phone,
                street_address: customerDetails.streetAddress,
                city: customerDetails.city,
                country: customerDetails.country,
                company: customerDetails.company || ''
              };
              
              setOrderDetails(orderData);
              setShowSuccessModal(true);
              onEmptyCart(true);
            }
          } catch (err) {
            console.error('❌ Verification Error:', err);
            toast.error('Verification failed');
          } finally {
            setIsProcessing(false);
          }
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error('❌ Payment Error:', err);
        toast.error('Payment initialization failed');
        setIsProcessing(false);
      }
    }
  };

  // ---------------- Empty Cart ----------------
  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#EC2027] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-[slideUp_0.3s_ease-out] relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/my-account?tab=orders');
              }}
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
              <p className="text-sm text-gray-500 mt-2">Redirecting to orders in {successCountdown} seconds...</p>
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  View Invoice
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/my-account?tab=orders');
                  }}
                  className="flex-1 bg-[#EC2027] text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-12">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-x-16">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-gray-800">Billing & Shipping</h2>
              <Link to="/cart" className="text-sm text-gray-600 hover:text-black">&lt; Back to Cart</Link>
            </div>

            {/* Address Selection */}
            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Address</h3>
                
                {/* Saved Addresses */}
                <div className="space-y-3 mb-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress?.id === address.id && !useNewAddress
                          ? 'border-[#EC2027] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedAddress(address);
                        setUseNewAddress(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="addressSelection"
                            checked={selectedAddress?.id === address.id && !useNewAddress}
                            onChange={() => {
                              setSelectedAddress(address);
                              setUseNewAddress(false);
                            }}
                            className="mt-1 text-[#EC2027] focus:ring-[#EC2027]"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-800">
                                {address.first_name} {address.last_name}
                              </p>
                              {address.is_default && (
                                <span className="bg-[#EC2027] text-white px-2 py-1 rounded-full text-xs">
                                  Default
                                </span>
                              )}
                            </div>
                            {address.company && (
                              <p className="text-sm text-gray-600">{address.company}</p>
                            )}
                            <p className="text-sm text-gray-700">{address.street_address}</p>
                            {address.apartment && (
                              <p className="text-sm text-gray-700">{address.apartment}</p>
                            )}
                            <p className="text-sm text-gray-700">
                              {address.city}, {address.country}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Option */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    useNewAddress
                      ? 'border-[#EC2027] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setUseNewAddress(true)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="addressSelection"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(true)}
                      className="text-[#EC2027] focus:ring-[#EC2027]"
                    />
                    <div className="flex items-center gap-2">
                      <Plus size={20} className="text-[#EC2027]" />
                      <span className="font-semibold text-gray-800">Use a new address</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* New Address Form */}
            {(useNewAddress || savedAddresses.length === 0) && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField id="firstName" label="First name" placeholder="" />
                  <InputField id="lastName" label="Last name" placeholder="" />
                </div>
                <InputField id="company" label="Company name" placeholder="(optional)" required={false} />
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">Country / Region <span className="text-red-500">*</span></label>
                  <select id="country" name="country" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition bg-white">
                    <option>Bahrain</option>
                    <option>Saudi Arabia</option>
                    <option>UAE</option>
                  </select>
                </div>
                <InputField id="streetAddress" label="Street address" placeholder="House number and street name" />
                <InputField id="apartment" label="Apartment, suite, unit, etc." placeholder="(optional)" required={false} />
                <InputField id="city" label="Town / City" placeholder="" />
                <InputField id="postcode" label="Block Number / Postcode" placeholder="(optional)" required={false} />
                <InputField id="phone" label="Phone" type="tel" placeholder="" />
                <InputField id="email" label="Email address" type="email" placeholder="" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <div className="bg-[#F8F8F8] p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-light text-gray-800 mb-6 pb-4 border-b border-gray-300">Your order</h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.cart_item_id || item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <img src={item.image1 || item.image} alt={item.name} className="w-16 h-16 object-contain bg-white border rounded-md" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name} <span className="text-gray-500">× {item.quantity}</span></p>
                        <span className="text-green-600 text-xs">In stock</span>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">{(item.price * item.quantity).toFixed(3)} {currency}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-300 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-800">{subtotal.toFixed(3)} {currency}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium text-gray-800">{shippingCost.toFixed(3)} {currency}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-baseline">
                <span className="text-lg font-medium text-gray-800">TOTAL</span>
                <div className="text-right"><span className="text-2xl font-bold text-gray-900">{total.toFixed(3)} {currency}</span><p className="text-xs text-gray-500">(includes {vat.toFixed(3)} {currency} 10% VAT)</p></div>
              </div>
              
              <div className="mt-8 space-y-3">
                <div className={`p-4 border-2 rounded-md bg-white cursor-pointer transition-all ${paymentMethod === 'credit' ? 'border-[#EC2027] bg-red-50' : 'border-gray-300'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Credit Card</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="credit" 
                      checked={paymentMethod === 'credit'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="text-[#EC2027] focus:ring-[#EC2027]" 
                    />
                  </label>
                </div>
                <div className={`p-4 border-2 rounded-md bg-white cursor-pointer transition-all ${paymentMethod === 'debit' ? 'border-[#EC2027] bg-red-50' : 'border-gray-300'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Debit Card</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="debit" 
                      checked={paymentMethod === 'debit'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="text-[#EC2027] focus:ring-[#EC2027]" 
                    />
                  </label>
                </div>
                <div className={`p-4 border-2 rounded-md bg-white cursor-pointer transition-all ${paymentMethod === 'benefit' ? 'border-[#EC2027] bg-red-50' : 'border-gray-300'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B</span>
                      </div>
                      <span className="font-medium text-gray-700">Benefit Pay</span>
                      {/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Popular in Bahrain</span> */}
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="benefit" 
                      checked={paymentMethod === 'benefit'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="text-[#EC2027] focus:ring-[#EC2027]" 
                    />
                  </label>
                </div>
                <div className={`p-4 border-2 rounded-md bg-white cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#EC2027] bg-red-50' : 'border-gray-300'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">Cash on Delivery</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="text-[#EC2027] focus:ring-[#EC2027]" 
                    />
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={termsAccepted} 
                    onChange={() => setTermsAccepted(!termsAccepted)} 
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" 
                  />
                  <span className="ml-2 text-sm text-gray-700">I have read and agree to the website <Link to="/t&c" className="text-teal-600 font-medium hover:underline">terms and conditions</Link><span className="text-red-500">*</span></span>
                </label>
              </div>
              <button type="submit" disabled={!termsAccepted || isProcessing} className="w-full bg-[#EC2027] text-white font-semibold py-4 mt-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isProcessing ? 'Processing Payment...' : <><Lock size={16} /> Place order</>}
              </button>
            </div>
          </div>
        </form>
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

      {/* Payment Processing Loader */}
      {showPaymentLoader && (
        <PaymentLoader 
          title="Processing Payment"
          message="Please wait while we securely process your payment..."
          type="processing"
        />
      )}
    </>
  );
};

export default CheckoutPage;