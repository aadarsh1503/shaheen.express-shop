// App.js (Corrected and Complete)

import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './pages/Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component Imports
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
import { CartProvider , useCart} from './pages/CartPage/CartContext';
// Correct Context Imports



// ========================================================================
// ========= PROTECTED ROUTE COMPONENTS ===================================
// ========================================================================

function UserProtectedRoute({ children }) {

  const { token, loading } = useAuth();


  if (loading) {

    return <GlobalLoader />; 
  }


  if (!token) {
    return <Navigate to="/login-shop" replace />;
  }


  return children;
}

function AdminProtectedRoute({ children }) {
  const { adminToken, loading } = useAuth();

  if (loading) {
    return <GlobalLoader />;
  }

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}


// ========================================================================
// ========= UTILITY & LAYOUT COMPONENTS ==================================
// ========================================================================

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LayoutWrapper({ children, cartItems, onRemoveItem, subtotal, currency }) {
  const location = useLocation();
  const isAdminLogin = location.pathname.startsWith("/admin");
  if (isAdminLogin) {
    return <>{children}</>;
  }

  const useShopLayout = [
    "/shop", "/login-shop", "/register-shop", "/cart", "/checkout", "/my-account",
    "/privacy-store", "/userData-Protection", "/terms-policy", "/return-refund"
  ].some(path => location.pathname.startsWith(path));

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

// ========================================================================
// ========= MAIN APP LOGIC ===============================================
// ========================================================================

function AppContent() {
  // === STATE MANAGEMENT ===
  const { token } = useAuth();
  const { 
    cartItems: localCartItems, 
    addToCart: addToLocalCart,
    removeFromCart: removeFromLocalCart,
    updateQuantity: updateLocalQuantity,
    emptyCart: emptyLocalCart,
  } = useCart();
  const [serverCartItems, setServerCartItems] = useState([]);
  
  // loadingItemId is no longer needed for optimistic updates, so it's removed.
  
  const cartItems = token ? serverCartItems : localCartItems;

  // === SERVER CART LOGIC (remains the same) ===
  const fetchServerCart = async () => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('https://shaheen-express-shop.onrender.com/api/cart', config);
      setServerCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch server cart:", error);
      setServerCartItems([]);
    }
  };
  
  useEffect(() => {
    fetchServerCart();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem('cart')) {
        emptyLocalCart(); 
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [emptyLocalCart]);

  // === UNIFIED CART HANDLERS (OPTIMISTIC VERSION) ===
  const handleAddToCart = async (product, quantity, productTable) => {
    // This logic is fine as it is.
    if (token) {
        if (!productTable) {
          toast.error("An unexpected error occurred.");
          return;
        }
        try {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          await axios.post('https://shaheen-express-shop.onrender.com/api/cart', {
            productId: product.id,
            quantity: quantity,
            productTable: productTable,
          }, config);
          await fetchServerCart();
          toast.success(`${product.name} added to cart!`);
        } catch (error) {
          toast.error("Failed to add item to cart.");
        }
      } else {
        addToLocalCart(product, productTable);
        toast.success(`${product.name} added to cart!`);
      }
  };

  const handleRemoveItem = async (itemId) => {
    if (token) {
      // 1. Save the current state in case we need to revert
      const originalCart = [...serverCartItems];
      
      // 2. Update the UI immediately (Optimistic Update)
      const updatedCart = serverCartItems.filter(item => item.cart_item_id !== itemId);
      setServerCartItems(updatedCart);
      
      try {
        // 3. Send the request to the server in the background
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        await axios.delete(`https://shaheen-express-shop.onrender.com/api/cart/${itemId}`, config);
        // No toast on success, the UI change is the feedback
      } catch (error) {
        // 4. If it fails, show an error and revert the UI
        toast.error("Could not remove item. Please try again.");
        setServerCartItems(originalCart); // Revert to the old state
      }
    } else {
      // Local cart is already synchronous, so it's instant
      removeFromLocalCart(itemId);
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    if (token) {
        // 1. Save the original state
        const originalCart = [...serverCartItems];
        const itemToUpdate = originalCart.find(i => i.cart_item_id === itemId);
        if (!itemToUpdate) return;
        
        const newQuantity = itemToUpdate.quantity + delta;
        
        // 2. Optimistically update the UI
        if (newQuantity < 1) {
            // If quantity is less than 1, we remove it
            const updatedCart = originalCart.filter(i => i.cart_item_id !== itemId);
            setServerCartItems(updatedCart);
        } else {
            // Otherwise, we update the quantity
            const updatedCart = originalCart.map(i => 
                i.cart_item_id === itemId ? { ...i, quantity: newQuantity } : i
            );
            setServerCartItems(updatedCart);
        }

        try {
            // 3. Send the request to the server
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            if (newQuantity < 1) {
                await axios.delete(`https://shaheen-express-shop.onrender.com/api/cart/${itemId}`, config);
            } else {
                await axios.put(`https://shaheen-express-shop.onrender.com/api/cart/${itemId}`, { quantity: newQuantity }, config);
            }
        } catch (error) {
            // 4. If it fails, revert the UI and show error
            toast.error("Could not update quantity.");
            setServerCartItems(originalCart);
        }
    } else {
        updateLocalQuantity(itemId, delta);
    }
  };

  const handleEmptyCart = async () => {
    if (token) {
        const originalCart = [...serverCartItems];
        setServerCartItems([]); // Optimistic update
        try {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          await axios.delete('https://shaheen-express-shop.onrender.com/api/cart', config);
          toast.info("Cart has been emptied.");
        } catch (error) {
          toast.error("Could not empty the cart.");
          setServerCartItems(originalCart); // Revert on failure
        }
      } else {
        emptyLocalCart();
      }
  };
  
  const { subtotal, currency } = useMemo(() => {
    const subtotalCalc = cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
    const currencyLabel = cartItems.length > 0 ? cartItems[0].currency : 'BHD';
    return { subtotal: subtotalCalc, currency: currencyLabel };
  }, [cartItems]);

  // === RENDER LOGIC ===
  return (
    <LayoutWrapper
      cartItems={cartItems}
      onRemoveItem={handleRemoveItem}
      subtotal={subtotal}
      currency={currency}
    >
      {/* THIS IS THE FULL, CORRECTED LIST OF ROUTES */}
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Hero />} />
        <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
        <Route path="/shop/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        <Route path="/shop/category/:categoryId" element={<CategoryProductsPage onAddToCart={handleAddToCart} />} />
        <Route path="/login-shop" element={<LoginPage />} />
        <Route path="/register-shop" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/t&c" element={<TANDC />} />

        {/* --- User Protected Routes --- */}
        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <CartPage 
                cartItems={cartItems} 
                onQuantityChange={handleQuantityChange} 
                onRemoveItem={handleRemoveItem} 
                onEmptyCart={handleEmptyCart} 
              />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              {/* Note: CheckoutPage also needs calculations passed as props */}
              <CheckoutPage cartItems={cartItems} subtotal={subtotal} onEmptyCart={handleEmptyCart} currency={currency} />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/my-account"
          element={<UserProtectedRoute><MyAccountPage /></UserProtectedRoute>}
        />

        {/* --- Admin Public & Protected Routes --- */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
        <Route path="/admin/products" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
        <Route path="/admin/categories" element={<AdminProtectedRoute><CategoryAdmin /></AdminProtectedRoute>} />
        <Route path="/admin/Product" element={<AdminProtectedRoute><ProductAdmin /></AdminProtectedRoute>} />
        <Route path="/admin/Product-shop" element={<AdminProtectedRoute><ShopManagementPage /></AdminProtectedRoute>} />

        {/* --- Other/Policy Routes --- */}
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

// ========================================================================
// ========= ROOT APP COMPONENT ===========================================
// ========================================================================

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
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
        </CartProvider> 
      </AuthProvider>
    </Router>
  );
}

export default App;