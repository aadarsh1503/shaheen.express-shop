// src/CartPage.js
import React, { useMemo } from 'react';
import { X, Minus, Plus, MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MAIN CART PAGE COMPONENT ---
// It receives all data and functions as props. No more internal state!
const CartPage = ({ cartItems, onQuantityChange, onRemoveItem, onEmptyCart }) => {
    
  // --- CART CALCULATION LOGIC ---
  // This logic remains but now depends on the `cartItems` prop.
  const [shippingOption, setShippingOption] = React.useState('pickup');

  const { subtotal, shippingCost, total, vat } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    const shippingCost = shippingOption === 'delivery' ? 2.200 : 0;
    const total = subtotal + shippingCost;
    const vat = total * 0.10; // Assuming 10% VAT on the total

    return { subtotal, shippingCost, total, vat };
  }, [cartItems, shippingOption]);


  // --- RENDER LOGIC ---
  // NEW: Unique empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F8F8] min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-light mb-2 text-gray-800">Your Cart is a Blank Canvas</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any gear yet. Time to start creating your masterpiece!</p>
        <Link to="/shop" className="bg-[#EC2027] text-white font-semibold py-3 px-8 hover:bg-[#EC2027] transition-colors">
          Return to Shop
        </Link>
      </div>
    )
  }

  // Currency can be taken from the first item if the cart is not empty
  const currency = cartItems.length > 0 ? cartItems[0].currency : 'BHD';

  return (
    <div className="bg-[#F8F8F8] font-sans py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-200">
              <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
              <img src={item.image1} alt={item.name} className="w-20 h-20 object-contain bg-white border border-gray-200" />
              <div className="flex-grow">
                <p className="text-gray-800">{item.name}</p>
                <span className="text-sm text-green-600 border border-green-300 rounded-full px-2 py-0.5 inline-block my-1">
                  In stock
                </span>
                <p className="text-sm text-gray-500">{parseFloat(item.price).toFixed(3)} {item.currency}</p>
              </div>
              <div className="flex items-center gap-3 border border-gray-300 px-2 py-1">
                <button onClick={() => onQuantityChange(item.id, -1)} disabled={item.quantity <= 1}>
                  <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => onQuantityChange(item.id, 1)}>
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
              <p className="font-semibold text-gray-800 w-28 text-right">
                {(parseFloat(item.price) * item.quantity).toFixed(3)} {item.currency}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button onClick={onEmptyCart} className="bg-gray-200 text-gray-700 px-5 py-2 hover:bg-gray-300 transition-colors">
              Empty Cart
            </button>
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Coupon:" className="border border-gray-300 p-2 focus:ring-1 focus:ring-teal-500 focus:border-teal-500" />
              <button className="bg-[#212121] text-white px-5 py-2 rounded-md hover:bg-black transition-colors">Apply coupon</button>
            </div>
          </div>
        </div>

        {/* Right Column: Cart Totals */}
        <div className="bg-white border border-gray-200 p-6 h-fit">
          <h2 className="text-2xl font-light text-gray-800 mb-4 pb-4 border-b">Cart totals</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">SUBTOTAL</span>
              <span className="font-semibold text-gray-800">{subtotal.toFixed(3)} {currency}</span>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">SHIPPING</span>
              <div className="mt-2 space-y-2 text-sm">
                <label className="flex items-center justify-between">
                  <span>
                    <input type="radio" name="shipping" value="pickup" checked={shippingOption === 'pickup'} onChange={(e) => setShippingOption(e.target.value)} className="mr-2 text-teal-600 focus:ring-teal-500" />
                    Pick up from Shop إستلام من المحل
                  </span>
                </label>
                <label className="flex items-center justify-between">
                  <span>
                    <input type="radio" name="shipping" value="delivery" checked={shippingOption === 'delivery'} onChange={(e) => setShippingOption(e.target.value)} className="mr-2 text-teal-600 focus:ring-teal-500" />
                     المندوب (incl. VAT)
                  </span>
                  <span className="font-semibold">{shippingCost > 0 ? `${shippingCost.toFixed(3)} ${currency}` : ''}</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Shipping options will be updated during checkout.</p>
              <button className="flex items-center gap-1 text-sm text-teal-600 mt-2">
                <MapPin size={14} />
                <span>Calculate shipping</span>
                <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-gray-800 font-medium">TOTAL</span>
              <div className="text-right">
                <span className="font-bold text-lg text-gray-900">{total.toFixed(3)} {currency}</span>
                <p className="text-xs text-gray-500">(includes {vat.toFixed(3)} {currency} 10% VAT)</p>
              </div>
            </div>
          </div>

          <Link to="/checkout" className="block text-center w-full bg-[#EC2027] text-white font-semibold py-3 mt-6 hover:bg-[#EC2027] transition-colors">
            Proceed to checkout
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CartPage;