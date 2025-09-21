// App.js
import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
// ... (all your other component imports)
import Hero from './components/Hero/Hero';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FAQ from './components/FAQ/FAQ';
import AboutUs from './components/AboutUs/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import TANDC from './components/TANDC/TANDC';
import TrackingForm from './components/TrackingForm/TrackingForm';
import Task from './components/PrivacyPolicy/Task';
import ChatWidget from './components/ChatWidget/ChatWidget';
import ManPower from './components/ManPower/ManPower';
import SummaryComponent from './components/ManPower/SummaryComponent';
import GeocodeMap from './components/HoverLocationMap/HoverLocationMap';
import { DirectionProvider } from './components/DirectionContext';
import LanguageSwitcher from './components/LanguageSwticher/LanguageSwitcher';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';
import UserDataProtectionPolicy from './components/UserDataProtectionPolicy/UserDataProtectionPolicy';
import ReturnAndRefundPolicy from './components/ReturnAndRefundPolicy/ReturnAndRefundPolicy';
import TermsOfUse from './components/TermsOfUse/TermsOfUse';
import ShopPage from './pages/Home/Home'; 
import Shop_Navbar from './pages/Shop_Navbar/Shop_Navbar';
import ShopFooter from './pages/Shop_Fotter/Shop_Footer';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/LoginPage/RegisterPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CartPage/CheckoutPage';
import MyAccountPage from './pages/MyAccountPage/MyAccountPage';


function ScrollToTop() {
  const { pathname } = useLocation(); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// --- UPDATED LayoutWrapper ---
// Now accepts and passes down all the cart-related props
function LayoutWrapper({ children, cartItems, onRemoveItem, subtotal, currency }) {
  const location = useLocation();

  const isShopPage = location.pathname.startsWith("/shop");
  const isLoginPage = location.pathname.startsWith("/login-shop");
  const isRegisterPage = location.pathname.startsWith("/register-shop");
  const isCartPage = location.pathname === "/cart";
  const isCheckoutPage = location.pathname === "/checkout";
  const isMyAccount = location.pathname === "/my-account";

  const useShopLayout = isShopPage || isLoginPage || isRegisterPage || isCartPage || isCheckoutPage || isMyAccount ;

  return (
    <>
      {useShopLayout ? (
        <Shop_Navbar 
          cartItems={cartItems}
          onRemoveItem={onRemoveItem}
          subtotal={subtotal}
          currency={currency}
        />
      ) : <Navbar />}
      {children}
      {useShopLayout ? <ShopFooter /> : <Footer />}
    </>
  );
}

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingOption, setShippingOption] = useState('pickup');
  const navigate = useNavigate();

  const { subtotal, shippingCost, total, vat, currency } = useMemo(() => {
    const subtotalCalc = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const shippingCostCalc = shippingOption === 'delivery' ? 2.200 : 0;
    const totalCalc = subtotalCalc + shippingCostCalc;
    const vatCalc = totalCalc * 0.10;
    const currencyLabel = cartItems.length > 0 ? cartItems[0].currency : 'BHD';
    return { subtotal: subtotalCalc, shippingCost: shippingCostCalc, total: totalCalc, vat: vatCalc, currency: currencyLabel };
  }, [cartItems, shippingOption]);

  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
    navigate('/cart');
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const handleEmptyCart = () => {
    setCartItems([]);
  };

  return (
    // Pass the required props down to LayoutWrapper
    <LayoutWrapper 
      cartItems={cartItems}
      onRemoveItem={handleRemoveItem}
      subtotal={subtotal}
      currency={currency}
    >
      <Routes>
        {/* ... (Your existing routes are perfect, no changes needed here) ... */}
        <Route path="/" element={<Hero />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/t&c" element={<TANDC />} />
        <Route path="/tracking-Form" element={<TrackingForm />} />
        <Route path="/privacy" element={<Task />} />
        <Route path="/manPower" element={<ManPower />} />
        <Route path="/summaryComponent" element={<SummaryComponent />} />
        <Route path="/map" element={<GeocodeMap />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/return&refund" element={<ReturnAndRefundPolicy />} />
        <Route path="/user-data-protection" element={<UserDataProtectionPolicy />} />

        {/* --- Shop routes with correct props --- */}
        <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/login-shop" element={<LoginPage />} />
        <Route path="/register-shop" element={<RegisterPage />} />
        <Route 
          path="/cart" 
          element={
            <CartPage
              cartItems={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onEmptyCart={handleEmptyCart}
            />
          } 
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage 
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              vat={vat}
              currency={currency}
              onEmptyCart={handleEmptyCart}
            />
          }
        />
      </Routes>
    </LayoutWrapper>
  );
}

function App() {
  return (
    <Router>
      <DirectionProvider>
        <div className='lg:hidden hidden'>
          <LanguageSwitcher />
        </div>
        <ChatWidget />
        <ScrollToTop />
        <GlobalLoader />
        
        <AppContent /> 
        
      </DirectionProvider>
    </Router>
  );
}

export default App;