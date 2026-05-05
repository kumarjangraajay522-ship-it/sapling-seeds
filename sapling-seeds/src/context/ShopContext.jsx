import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const currency = '₹';
    const delivery_fee = 0;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products?active=true`);
            const contentType = res.headers.get('content-type') || '';
            if (!res.ok || !contentType.includes('application/json')) return;
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch {
            // Backend unavailable — app works without products
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {
        products,
        currency,
        delivery_fee,
        loading,
        fetchProducts
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
