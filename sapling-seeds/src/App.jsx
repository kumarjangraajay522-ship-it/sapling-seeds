import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { MotionConfig } from 'framer-motion';

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

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

const DeferredBambooBuddy = () => {
    const [show, setShow] = React.useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 5000);
        return () => clearTimeout(timer);
    }, []);
    if (!show) return null;
    return <BambooBuddy />;
};

const PageFallback = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#2d7a4a', fontSize: '1rem' }}>Loading…</span>
    </div>
);

// Protected Route Wrapper
const ProtectedGate = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

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
    const { isAuthenticated } = useAuth();
    
    // Dynamically show/hide Navbar and Footer based on route
    const isLoginPage = location.pathname === '/login';

    return (
        <div className='w-full' style={{ overflow: 'clip', minHeight: '100vh', position: 'relative' }}>
            {(!isLoginPage && isAuthenticated) && <Navbar />}
            <Suspense fallback={null}>
                {isAuthenticated && <LeafCursor />}
                {(!isLoginPage && isAuthenticated) && <DeferredBambooBuddy />}
                {isAuthenticated && <GlobalGraphics />}
            </Suspense>
            <ScrollToHash />
            <Suspense fallback={<PageFallback />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedGate><Home /></ProtectedGate>} />
                    <Route path="/home" element={<ProtectedGate><Home /></ProtectedGate>} />
                    <Route path="/about" element={<ProtectedGate><About /></ProtectedGate>} />
                    <Route path="/collection" element={<ProtectedGate><Collection /></ProtectedGate>} />
                    <Route path="/gifting" element={<ProtectedGate><Gifting /></ProtectedGate>} />
                    <Route path="/contact" element={<ProtectedGate><Contact /></ProtectedGate>} />
                    <Route path="/cart" element={<ProtectedGate><Cart /></ProtectedGate>} />
                    <Route path="/profile" element={<ProtectedGate><Profile /></ProtectedGate>} />
                    <Route path="/orders" element={<ProtectedGate><Orders /></ProtectedGate>} />
                    <Route path="/product/:id" element={<ProtectedGate><Product /></ProtectedGate>} />
                    
                    {/* Policies can be public or protected, making them protected for now per request */}
                    <Route path="/privacy-policy" element={<ProtectedGate><PrivacyPolicy /></ProtectedGate>} />
                    <Route path="/shipping-policy" element={<ProtectedGate><ShippingPolicy /></ProtectedGate>} />
                    <Route path="/returns-policy" element={<ProtectedGate><ReturnsPolicy /></ProtectedGate>} />
                    <Route path="/terms-and-conditions" element={<ProtectedGate><TermsAndConditions /></ProtectedGate>} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
            {(!isLoginPage && isAuthenticated) && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <SmoothScroll>
            <MotionConfig transition={isMobile ? { duration: 0.1 } : undefined}>
                <AppContent />
            </MotionConfig>
        </SmoothScroll>
    );
};

export default App;