import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { CartProvider } from './context/CartContext';

// Navigation (always needed, not lazy)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

// Decorative — lazy so they don't block the initial paint
const LeafCursor = lazy(() => import('./components/LeafCursor'));
const BambooBuddy = lazy(() => import('./components/BambooBuddy'));
const GlobalGraphics = lazy(() => import('./components/GlobalGraphics'));

// Home is the landing page — load eagerly for fast initial paint
import Home from './pages/Home/Home';

// All other pages lazy-loaded to reduce initial bundle
const About = lazy(() => import('./pages/About/About'));
const Collection = lazy(() => import('./pages/Collection/Collection'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Product = lazy(() => import('./pages/Product/Product'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Orders = lazy(() => import('./pages/Orders/Orders'));
const Gifting = lazy(() => import('./pages/Gifting/Gifting'));
const PrivacyPolicy = lazy(() => import('./pages/Policy/PrivacyPolicy'));
const ShippingPolicy = lazy(() => import('./pages/Policy/ShippingPolicy'));
const ReturnsPolicy = lazy(() => import('./pages/Policy/ReturnsPolicy'));
const TermsAndConditions = lazy(() => import('./pages/Policy/TermsAndConditions'));

const PageFallback = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#2d7a4a', fontSize: '1rem' }}>Loading…</span>
    </div>
);

// New Component to handle smooth scrolling to hashes across routes
const ScrollToHash = () => {
    const { hash, pathname } = useLocation();
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                const timeoutId = setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 150);
                return () => clearTimeout(timeoutId);
            }
        } else {
            // Instant scroll to top on path changes without hash
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [hash, pathname]);
    return null;
};

const AppContent = () => {
    const location = useLocation();
    // Dynamically show/hide Navbar and Footer based on route
    const isLoginPage = location.pathname === '/login';

    return (
        <div className='w-full' style={{ overflow: 'clip', minHeight: '100vh', position: 'relative' }}>
            {!isLoginPage && <Navbar />}
            <Suspense fallback={null}>
                <LeafCursor />
                {!isLoginPage && <BambooBuddy />}
                <GlobalGraphics />
            </Suspense>
            <ScrollToHash />
            <Suspense fallback={<PageFallback />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/gifting" element={<Gifting />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/returns-policy" element={<ReturnsPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                </Routes>
            </Suspense>
            {!isLoginPage && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <SmoothScroll>
            <AppContent />
        </SmoothScroll>
    );
};

export default App;