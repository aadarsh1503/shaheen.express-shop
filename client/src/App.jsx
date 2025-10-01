// App.js (With Protected Routes)

import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './pages/Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ... (all your component imports remain the same)
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
import PrivacyPolicy1 from './pages/privacy/Privacy';
import UserDataProtectionPolicy1 from './pages/UserData/UserData';
import TermsOfUse1 from './pages/Terms_of _Use/Terms';
import ReturnRefundPolicy12 from './pages/Return/Return';
import AdminPage from './pages/frontend-admin/AdminPage/AdminPage';
import CategoryAdmin from './pages/frontend-admin/AdminPage/CategoryAdmin';
import ProductAdmin from './pages/frontend-admin/AdminPage/ProductAdmin';
import CategoryProductsPage from './pages/frontend-admin/AdminPage/CategoryProductsPage';
import AdminLoginPage from './pages/frontend-admin/AdminLoginPage/AdminLoginPage';
import AdminSignupPage from './pages/frontend-admin/AdminLoginPage/AdminSignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import ShopManagementPage from './pages/frontend-admin/AdminPage/ShopManagementPage';


// ========================================================================
// ========= START: NEW PROTECTED ROUTE COMPONENTS ========================
// ========================================================================

// This component protects routes that only a logged-in regular user should access.
function UserProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    // If no token, redirect to the customer login page
    return <Navigate to="/login-shop" replace />;
  }
  return children;
}

// This component protects routes that only a logged-in admin should access.
function AdminProtectedRoute({ children }) {
  const { adminToken } = useAuth(); // Assuming your AuthContext provides this
  if (!adminToken) {
    // If no admin token, redirect to the admin login page
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// ========================================================================
// ========= END: NEW PROTECTED ROUTE COMPONENTS ==========================
// ========================================================================


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// LayoutWrapper remains unchanged
function LayoutWrapper({ children, cartItems, onRemoveItem, subtotal, currency }) {
  const location = useLocation();

  const isShopPage = location.pathname.startsWith("/shop");
  const isAdminLogin = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.startsWith("/login-shop");
  const isRegisterPage = location.pathname.startsWith("/register-shop");
  const isCartPage = location.pathname === "/cart";
  const isCheckoutPage = location.pathname === "/checkout";
  const isMyAccount = location.pathname === "/my-account";
  const isPrivacy = location.pathname === "/privacy-store";
  const isUserData = location.pathname === "/userData-Protection";
  const isTerms = location.pathname === "/terms-policy";
  const isReturn = location.pathname === "/return-refund";

  if (isAdminLogin) {
    return <>{children}</>;
  }

  const useShopLayout = isShopPage || isLoginPage || isRegisterPage || isTerms || isCartPage || isReturn || isCheckoutPage || isMyAccount || isPrivacy || isUserData;

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
  const { token } = useAuth();

  // --- All cart logic functions (fetchCart, handleAddToCart, etc.) remain unchanged ---
  const fetchCart = async () => {
    if (token) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('https://shaheen-express-shop.onrender.com/api/cart', config);
        setCartItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const { subtotal, shippingCost, total, vat, currency } = useMemo(() => {
    const subtotalCalc = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const shippingCostCalc = shippingOption === 'delivery' ? 2.200 : 0;
    const totalCalc = subtotalCalc + shippingCostCalc;
    const vatCalc = totalCalc * 0.10;
    const currencyLabel = cartItems.length > 0 ? cartItems[0].currency : 'BHD';
    return { subtotal: subtotalCalc, shippingCost: shippingCostCalc, total: totalCalc, vat: vatCalc, currency: currencyLabel };
  }, [cartItems, shippingOption]);

  const handleAddToCart = async (productToAdd, quantity = 1, productTable) => {
    if (!token) {
      navigate('/login-shop');
      return;
    }
    if (!productTable) {
      console.error("Developer Error: 'productTable' argument is missing in handleAddToCart call.");
      toast.error("An unexpected error occurred.");
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.post('https://shaheen-express-shop.onrender.com/api/cart', {
        productId: productToAdd.id,
        quantity: quantity,
        productTable: productTable,
      }, config);
      await fetchCart();
      toast.success("Item added to cart!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add item to cart";
      console.error(errorMessage, error);
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!token) return;
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.delete(`https://shaheen-express-shop.onrender.com/api/cart/${cartItemId}`, config);
      await fetchCart();
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Could not remove item. Please try again.");
    }
  };

  const handleQuantityChange = async (cartItemId, amount) => {
    const item = cartItems.find(i => i.cart_item_id === cartItemId);
    if (!token || !item) return;
    const newQuantity = item.quantity + amount;
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.put(`https://shaheen-express-shop.onrender.com/api/cart/${cartItemId}`, { quantity: newQuantity }, config);
      await fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Could not update quantity.");
    }
  };

  const handleEmptyCart = async () => {
    if (!token) return;
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.delete('https://shaheen-express-shop.onrender.com/api/cart', config);
      await fetchCart();
      toast.info("Your cart has been emptied.");
    } catch (error) {
      console.error("Failed to empty cart:", error);
      toast.error("Could not empty the cart.");
    }
  };

  return (
    <LayoutWrapper
      cartItems={cartItems}
      onRemoveItem={handleRemoveItem}
      subtotal={subtotal}
      currency={currency}
    >
      <Routes>
        {/* --- Public Routes (Anyone can see these) --- */}
        <Route path="/" element={<Hero />} />
        <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
        <Route path="/shop/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        <Route path="/shop/category/:categoryId" element={<CategoryProductsPage onAddToCart={handleAddToCart} />} />
        <Route path="/login-shop" element={<LoginPage />} />
        <Route path="/register-shop" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* Other public pages */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/t&c" element={<TANDC />} />
        {/* ... other public routes */}


        {/* --- User Protected Routes (Must be logged in as a customer) --- */}
        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <CartPage cartItems={cartItems} onQuantityChange={handleQuantityChange} onRemoveItem={handleRemoveItem} onEmptyCart={handleEmptyCart} />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              <CheckoutPage cartItems={cartItems} subtotal={subtotal} shippingCost={shippingCost} total={total} vat={vat} currency={currency} onEmptyCart={handleEmptyCart} />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/my-account"
          element={
            <UserProtectedRoute>
              <MyAccountPage />
            </UserProtectedRoute>
          }
        />


        {/* --- Admin Public Routes (Login/Signup for Admin) --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        
        {/* --- Admin Protected Routes (Must be logged in as an Admin) --- */}
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminProtectedRoute>
              <CategoryAdmin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/Product"
          element={
            <AdminProtectedRoute>
              <ProductAdmin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/Product-shop"
          element={
            <AdminProtectedRoute>
              <ShopManagementPage />
            </AdminProtectedRoute>
          }
        />

        {/* ... Your remaining policy and other routes ... */}
        <Route path="/tracking-Form" element={<TrackingForm />} />
        <Route path="/privacy" element={<Task />} />
        <Route path="/manPower" element={<ManPower />} />
        <Route path="/summaryComponent" element={<SummaryComponent />} />
        <Route path="/map" element={<GeocodeMap />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/return&refund" element={<ReturnAndRefundPolicy />} />
        <Route path="/user-data-protection" element={<UserDataProtectionPolicy />} />
        <Route path="/userData-Protection" element={<UserDataProtectionPolicy1 />} />
        <Route path="/terms-policy" element={<TermsOfUse1 />} />
        <Route path="/return-refund" element={<ReturnRefundPolicy12 />} />
        <Route path="/privacy-store" element={<PrivacyPolicy1 />} />
      </Routes>
    </LayoutWrapper>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DirectionProvider>
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
          <div className='lg:hidden hidden'>
            <LanguageSwitcher />
          </div>
          <ChatWidget />
          <ScrollToTop />
          <GlobalLoader />
          <AppContent />
        </DirectionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;