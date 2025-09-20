import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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


function ScrollToTop() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }
  }, [hash]);

  return null;
}

function LayoutWrapper({ children }) {
  const location = useLocation();

  const isShopPage = location.pathname.startsWith("/shop");

  return (
    <>
      {/* Navbar / Shop_Navbar */}
      {isShopPage ? <Shop_Navbar /> : <Navbar />}

      {/* Page Content */}
      {children}

      {/* Footer / ShopFooter */}
      {isShopPage ? <ShopFooter /> : <Footer />}
    </>
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

        <LayoutWrapper>
          <Routes>
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

            {/* Shop page */}
            <Route path="/shop" element={<ShopPage />} />
          </Routes>
        </LayoutWrapper>
      </DirectionProvider>
    </Router>
  );
}

export default App;
