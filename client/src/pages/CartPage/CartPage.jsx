import React, { useMemo } from 'react';
import { X, Minus, Plus, MapPin, ChevronDown, Loader2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify'; // Import toast

const CartPage = ({ cartItems, onQuantityChange, onRemoveItem, onEmptyCart, loadingItemId }) => {
  const { token } = useAuth();
  const [shippingOption, setShippingOption] = React.useState('pickup');

  // Calculations (Subtotal, VAT, etc.)
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

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F8F8F8] min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <ShoppingCart size={48} className="text-gray-300 mb-4" />
        <h1 className="text-3xl font-light mb-2 text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6 max-w-sm">Looks like you haven't added anything to your cart yet. Let's find something for you!</p>
        <Link to="/shop" className="bg-[#EC2027] text-white font-semibold py-3 px-8 rounded-md hover:bg-red-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  // --- STOCK INFO HELPER ---
  const getStockInfo = (item) => {
    const currentQty = item.quantity || 0;
    const maxStock = item.stockQuantity || 0;

    if (!item.inStock || maxStock <= 0) {
      return <span className="text-xs text-red-500 font-medium">Out of stock</span>;
    }
    if (currentQty >= maxStock) {
        return <span className="text-xs text-orange-600 font-medium">Max stock reached!</span>;
    }
    if (maxStock <= 5) {
      return <span className="text-xs text-yellow-600 font-medium">Only {maxStock} total left!</span>;
    }
    return (
      <span className="text-xs text-green-600 font-medium">
        In stock
      </span>
    );
  };

  const currency = cartItems.length > 0 ? cartItems[0].currency : 'BHD';

  return (
    <div className="bg-gray-50 font-sans py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Cart Items List --- */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
            {cartItems.map((item) => {
              const uniqueId = token ? item.cart_item_id : item.id;
              const isLoading = loadingItemId === uniqueId;
              
              const currentQty = item.quantity || 0;
              const maxStock = item.stockQuantity; // Now available from the backend!
              const isMaxReached = currentQty >= maxStock;
              const isOutOfStock = !item.inStock || maxStock <= 0;

              // THIS IS THE KEY FIX: The function that runs before calling the prop
              const handlePlusClick = () => {
                  if (isMaxReached) {
                      toast.warn(`Max quantity reached! Only ${maxStock} available.`);
                      return; // Stop execution here
                  }
                  // If not maxed out, call the function from App.js
                  onQuantityChange(uniqueId, 1);
              };

              return (
                <div key={uniqueId} className={`flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                  
                  <img src={item.image || item.image1} alt={item.name} className="w-24 h-24 object-contain bg-gray-100 border border-gray-200 rounded-md" />
                  
                  <div className="flex-grow">
                    <p className="text-gray-800 font-semibold">{item.name}</p>
                    <div className="mt-1">{getStockInfo(item)}</div>
                    <p className="text-sm text-gray-500 mt-1">{parseFloat(item.price).toFixed(3)} {item.currency}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-lg text-gray-800 w-28 text-right">
                      {(parseFloat(item.price) * item.quantity).toFixed(3)} {item.currency}
                    </p>
                    <div className="flex items-center gap-3 border border-gray-300 px-2 py-1 rounded-md bg-white">
                    <button 
                      onClick={() => onQuantityChange(uniqueId, -1)} 
                      disabled={item.quantity <= 1 || isLoading}
                      className="p-1 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:text-black"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <div className="w-8 text-center font-medium">
                      {isLoading ? <Loader2 size={16} className="animate-spin text-gray-500 mx-auto" /> : <span>{item.quantity}</span>}
                    </div>

                    <button 
                      // MODIFIED: Use isMaxReached to disable the button
                      onClick={() => onQuantityChange(uniqueId, 1)}
                      disabled={isLoading || isMaxReached} 
                      className="p-1 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:text-black"
                      title={isMaxReached ? `Maximum stock (${maxStock}) reached` : "Increase quantity"}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                    </div>
                  </div>
                  <button onClick={() => onRemoveItem(uniqueId)} disabled={isLoading} className="text-gray-400 hover:text-red-600 p-2" title="Remove item">
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                  </button>
                </div>
              )
            })}
          </div>

          {/* --- Right Column: Cart Totals --- */}
          <div className="bg-white border border-gray-200 p-6 h-fit rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Cart Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">{subtotal.toFixed(3)} {currency}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-800 block mb-2">Shipping</span>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <input type="radio" name="shipping" value="pickup" checked={shippingOption === 'pickup'} onChange={(e) => setShippingOption(e.target.value)} className="mr-3 text-[#EC2027] focus:ring-[#EC2027]" />
                      <span className="text-sm text-gray-700">Pick up from Shop <br/><span className="text-xs text-gray-500">إستلام من المحل</span></span>
                    </div>
                    <span className="font-semibold text-sm">Free</span>
                  </label>
                  <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <input type="radio" name="shipping" value="delivery" checked={shippingOption === 'delivery'} onChange={(e) => setShippingOption(e.target.value)} className="mr-3 text-[#EC2027] focus:ring-[#EC2027]" />
                      <span className="text-sm text-gray-700">Delivery <br/><span className="text-xs text-gray-500">المندوب</span></span>
                    </div>
                    <span className="font-semibold text-sm">2.200 {currency}</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-end pt-4 border-t mt-4">
                <span className="text-gray-800 font-bold text-lg">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-[#EC2027]">{total.toFixed(3)} {currency}</span>
                  <p className="text-xs text-gray-500 mt-1">(includes {vat.toFixed(3)} VAT)</p>
                </div>
              </div>
            </div>
            <Link 
              to="/checkout" 
              className={`block text-center w-full text-white font-bold py-4 rounded-lg mt-8 transition-all duration-300 ${cartItems.some(i => !i.inStock || i.stockQuantity <=0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#EC2027] hover:bg-red-700 hover:shadow-lg'}`}
              onClick={(e) => { if(cartItems.some(i => !i.inStock || i.stockQuantity <=0)) e.preventDefault(); }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;