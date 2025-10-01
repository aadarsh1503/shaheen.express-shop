// src/pages/CheckoutPage/CheckoutPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

// Reusable Input Field Component
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

// Main Checkout Page Component
const CheckoutPage = ({ cartItems, subtotal, shippingCost, total, vat, currency }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the terms and conditions to place your order.");
      return;
    }

    // Set processing to true to show loading state on the button
    setIsProcessing(true);

    // Simulate a payment processing delay
    setTimeout(() => {
      // Show a payment error message after the delay
      alert("Payment error, please try again.");

      // Stop the processing state
      setIsProcessing(false);
      
      // Redirect to the homepage after the error
      navigate('/shop'); 
    }, 2500); // 2.5-second delay to simulate API call
  };
  
  if (cartItems.length === 0) {
      return (
          <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-3xl font-light mb-2 text-gray-800">Your cart is empty.</h1>
              <p className="text-gray-500 mb-6">You can't proceed to checkout without any items.</p>
              <Link to="/shop" className="bg-[#00A89C] text-white font-semibold py-3 px-8 hover:bg-[#008a7e] transition-colors">
                  Return to Shop
              </Link>
          </div>
      )
  }

  return (
    <div className="bg-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-light text-center text-gray-800 mb-12">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-x-16">
          
          {/* --- LEFT SIDE: BILLING & SHIPPING --- */}
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
                 <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">
                    Country / Region <span className="text-red-500">*</span>
                 </label>
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

              <div className="pt-4">
                <h3 className="text-xl font-light text-gray-800 mb-3">Additional information</h3>
                <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-600 mb-1">
                  Order notes (optional)
                </label>
                <textarea 
                  id="orderNotes" 
                  name="orderNotes"
                  rows="4"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
                ></textarea>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: YOUR ORDER --- */}
          <div className="lg:col-span-2 mt-12 lg:mt-0">
             <div className="bg-[#F8F8F8] p-8 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-light text-gray-800 mb-6 pb-4 border-b border-gray-300">Your order</h2>
                
                {/* Order Items */}
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <img src={item.image1} alt={item.name} className="w-16 h-16 object-contain bg-white border rounded-md" />
                        <div>
                           <p className="font-semibold text-gray-800">{item.name} <span className="text-gray-500">× {item.quantity}</span></p>
                           <span className="text-green-600 text-xs">In stock</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{(item.price * item.quantity).toFixed(3)} {currency}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t border-gray-300 space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Subtotal</span>
                     <span className="font-medium text-gray-800">{subtotal.toFixed(3)} {currency}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Shipping</span>
                     <span className="font-medium text-gray-800">{shippingCost.toFixed(3)} {currency}</span>
                   </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-baseline">
                   <span className="text-lg font-medium text-gray-800">TOTAL</span>
                   <div className="text-right">
                     <span className="text-2xl font-bold text-gray-900">{total.toFixed(3)} {currency}</span>
                     <p className="text-xs text-gray-500">(includes {vat.toFixed(3)} {currency} 10% VAT)</p>
                   </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mt-8 space-y-3">
                    <div className="p-4 border border-gray-300 rounded-md bg-white">
                        <label className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Debit Card (Benefit)</span>
                            <input type="radio" name="payment" defaultChecked className="text-teal-600 focus:ring-teal-500" />
                        </label>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-md bg-white">
                        <label className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Credit Card</span>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4"/>
                        </label>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-md bg-white">
                        <label className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Cash on delivery</span>
                            <input type="radio" name="payment" className="text-teal-600 focus:ring-teal-500" />
                        </label>
                    </div>
                     <div className="p-4 border border-gray-300 rounded-md bg-white">
                        <label className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Benefit Pay</span>
                            <img src="data:image/png;base64,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" alt="Apple Pay" className="h-6"/>
                        </label>
                    </div>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link to="/privacy-policy" className="text-teal-600 hover:underline">privacy policy</Link>.
                </div>

                <div className="mt-6">
                    <label className="flex items-center">
                        <input type="checkbox" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2 text-sm text-gray-700">I have read and agree to the website <Link to="/t&c" className="text-teal-600 font-medium hover:underline">terms and conditions</Link><span className="text-red-500">*</span></span>
                    </label>
                </div>
                
                <button 
                  type="submit"
                  disabled={!termsAccepted || isProcessing}
                  className="w-full bg-[#EC2027] text-white font-semibold py-4 mt-6 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    'Proceeding to Payment...'
                  ) : (
                    <>
                      <Lock size={16} />
                      Place order
                    </>
                  )}
                </button>

             </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;