// ... (imports remain the same)
import React, { useMemo } from 'react';
import { X, Minus, Plus, MapPin, ChevronDown, Loader2 } from 'lucide-react'; // Import Loader2
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';


// --- NEW: Receive loadingItemId as a prop ---
const CartPage = ({ cartItems, onQuantityChange, onRemoveItem, onEmptyCart, loadingItemId }) => {
  const { token } = useAuth();
  const [shippingOption, setShippingOption] = React.useState('pickup');

  // ... (useMemo, empty cart check, currency logic remains the same)
  const { subtotal, shippingCost, total, vat } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    const shippingCost = shippingOption === 'delivery' ? 2.200 : 0;
    const total = subtotal + shippingCost;
    const vat = total * 0.10;
    return { subtotal, shippingCost, total, vat };
  }, [cartItems, shippingOption]);

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F8F8] min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-light mb-2 text-gray-800">Your Cart is a Blank Canvas</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any gear yet. Time to start creating your masterpiece!</p>
        <Link to="/shop" className="bg-[#EC2027] text-white font-semibold py-3 px-8 hover:bg-red-700 transition-colors">
          Return to Shop
        </Link>
      </div>
    )
  }

  const currency = cartItems.length > 0 ? cartItems[0].currency : 'BHD';

  return (
    <div className="bg-[#F8F8F8] font-sans py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          {cartItems.map((item) => {
            const uniqueId = token ? item.cart_item_id : item.id;
            // --- NEW: Check if the current item is the one being updated ---
            const isLoading = loadingItemId === uniqueId;

            return (
              // --- Add a subtle opacity change when loading ---
              <div key={uniqueId} className={`flex items-center gap-4 py-4 border-b border-gray-200 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                
                {/* --- Replace remove button with a spinner when loading --- */}
                <button onClick={() => onRemoveItem(uniqueId)} disabled={isLoading} className="text-gray-400 hover:text-red-500 w-5 h-5 flex items-center justify-center">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                </button>
              
                {/* ... (Image and item details remain the same) ... */}
                <img src={item.image1} alt={item.name} className="w-20 h-20 object-contain bg-white border border-gray-200" />
                <div className="flex-grow">
                  <p className="text-gray-800">{item.name}</p>
                  <span className="text-sm text-green-600 border border-green-300 rounded-full px-2 py-0.5 inline-block my-1">
                    In stock
                  </span>
                  <p className="text-sm text-gray-500">{parseFloat(item.price).toFixed(3)} {item.currency}</p>
                </div>

                {/* --- Update the quantity control section --- */}
                <div className="flex items-center gap-3 border border-gray-300 px-2 py-1">
                  <button onClick={() => onQuantityChange(uniqueId, -1)} disabled={item.quantity <= 1 || isLoading}>
                    <Minus size={16} className={item.quantity <= 1 || isLoading ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  
                  {/* --- Show a spinner instead of quantity when loading --- */}
                  {isLoading ? (
                      <Loader2 size={16} className="animate-spin text-gray-500" />
                  ) : (
                      <span>{item.quantity}</span>
                  )}

                  <button onClick={() => onQuantityChange(uniqueId, 1)} disabled={isLoading}>
                    <Plus size={16} className={isLoading ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                </div>

                <p className="font-semibold text-gray-800 w-28 text-right">
                  {(parseFloat(item.price) * item.quantity).toFixed(3)} {item.currency}
                </p>
              </div>
            )
          })}

          {/* ... (Rest of the component remains the same) ... */}
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

        {/* ... (Right Column with Cart Totals remains the same) ... */}
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

          <Link to="/checkout" className="block text-center w-full bg-[#EC2027] text-white font-semibold py-3 mt-6 hover:bg-red-700 transition-colors">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;