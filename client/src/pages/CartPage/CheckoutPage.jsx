import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';

// ... (InputField component same rahega)
const InputField = ({ id, label, placeholder, required = true, type = 'text', className = '' }) => (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
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

const CheckoutPage = ({ cartItems, onEmptyCart }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingOption, setShippingOption] = useState('delivery');
  
  // --- NEW STATE for payment method ---
  const [paymentMethod, setPaymentMethod] = useState('debit'); // Default value 'debit'

  const navigate = useNavigate();

  // ... (useMemo for calculations same rahega)
  const { subtotal, shippingCost, total, vat, currency } = useMemo(() => {
    const subtotalCalc = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    const shippingCostCalc = shippingOption === 'delivery' ? 2.200 : 0; 
    const totalCalc = subtotalCalc + shippingCostCalc;
    const vatCalc = totalCalc * 0.10;
    const currencyLabel = cartItems.length > 0 ? cartItems[0].currency : 'BHD';
    return { subtotal: subtotalCalc, shippingCost: shippingCostCalc, total: totalCalc, vat: vatCalc, currency: currencyLabel };
  }, [cartItems, shippingOption]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.warn("Please accept the terms and conditions to place your order.");
      return;
    }
    setIsProcessing(true);
    const processPayment = () => new Promise((_, reject) => setTimeout(() => reject(new Error("Payment failed. Please try again.")), 2500));
    try {
      const paymentResult = await processPayment();
      toast.success(`Order placed successfully!`);
      onEmptyCart();
      navigate('/my-account');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-light mb-2 text-gray-800">Your cart is empty.</h1>
        <p className="text-gray-500 mb-6">You can't proceed to checkout without any items.</p>
        <Link to="/shop" className="bg-[#EC2027] text-white font-semibold py-3 px-8 rounded-md hover:bg-red-700 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-12">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-x-16">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-gray-800">Billing & Shipping</h2>
              <Link to="/cart" className="text-sm text-gray-600 hover:text-black">&lt; Back to Cart</Link>
            </div>
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
              
              {/* --- YAHAN PAR MAJOR FIX KIYA GAYA HAI --- */}
              <div className="mt-8 space-y-3">
                <div className="p-4 border border-gray-300 rounded-md bg-white">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">Debit Card (Benefit)</span>
                    <input type="radio" name="payment" value="debit" checked={paymentMethod === 'debit'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-teal-600 focus:ring-teal-500" />
                  </label>
                </div>
                <div className="p-4 border border-gray-300 rounded-md bg-white">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">Credit Card</span>
                    <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-teal-600 focus:ring-teal-500" />
                  </label>
                </div>
                <div className="p-4 border border-gray-300 rounded-md bg-white">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">Cash on delivery</span>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-teal-600 focus:ring-teal-500" />
                  </label>
                </div>
                <div className="p-4 border border-gray-300 rounded-md bg-white">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">Benefit Pay</span>
                    <input type="radio" name="payment" value="benefitpay" checked={paymentMethod === 'benefitpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-teal-600 focus:ring-teal-500" />
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="flex items-center">
                  <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
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
  );
};

export default CheckoutPage;