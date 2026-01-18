import React, { useEffect, useState } from 'react';
// 1. Import useLocation from react-router-dom
import { useLocation } from 'react-router-dom';
import { useDirection } from '../DirectionContext';
import "./LanguageSwitcher.css";
import i1 from "./i1.jpg"

const LanguageSwitcher = () => {
    const { toggleLanguageAndDirection } = useDirection();
    const [loading, setLoading] = useState(false);

    // 2. Get the current location object
    const location = useLocation();

    useEffect(() => {
        // ... (your existing useEffect code remains unchanged)
        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const googleTranslateScript = document.createElement('script');
            googleTranslateScript.id = 'google-translate-script';
            googleTranslateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(googleTranslateScript);
        }

        window.googleTranslateElementInit = () => {
            try {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                }, 'google_translate_element');
            } catch (error) {
                // Error initializing Google Translate
            }
        };
    }, []);

    const handleLanguageChange = (lang) => {
        try {
            // 3. Define the routes where the animation should be hidden
            // We use .startsWith() to cover dynamic routes like /shop/product/123
            const noAnimationRoutes = [
                '/shop', // Covers /shop, /shop/product/:id, /shop/category/:categoryId
                '/login-shop',
                '/register-shop',
                '/forgot-password',
                '/reset-password', // Covers /reset-password/:token
            ];

            // 4. Check if the current path starts with any of the disabled routes
            const shouldShowAnimation = !noAnimationRoutes.some(route => location.pathname.startsWith(route));

            toggleLanguageAndDirection(lang);

            // 5. Only show the loader if it's an allowed route
            if (shouldShowAnimation) {
                setLoading(true); // Show loader only on non-shop pages
            }

            // The reload logic remains the same for all pages
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            // Error changing language
        }
    };

    return (
        <div className="language-switcher flex gap-2 relative">
            {/* This JSX will now only render if setLoading(true) is called */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-image">
                        <img
                            src={i1}
                            alt="Loading"
                        />
                    </div>
                </div>
            )}
            <div id="google_translate_element"></div>
            <img
                src="https://t3.ftcdn.net/jpg/00/66/61/74/360_F_66617490_w7bC64aJjLgIJc4iBRN1QawdvhV9SVuF.jpg"
                alt="Switch to Arabic"
                onClick={() => handleLanguageChange('ar')}
                className="cursor-pointer w-12 h-auto"
            />
            <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="Switch to English"
                onClick={() => handleLanguageChange('en')}
                className="cursor-pointer w-12 h-auto"
            />
        </div>
    );
};

export default LanguageSwitcher;