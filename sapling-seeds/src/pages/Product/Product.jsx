// Product.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../assets/assets';
import './Product.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/products/${productId}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    console.error("Product not found");
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <div className="product-page-loading">🌿 Loading Product...</div>;
    if (!product) return <div className="product-page-error">Product not found 🍃</div>;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="product-page-container"
        >
            <div className="product-page-layout">
                <div className="product-page-image">
                    <img
                        src={getProductImage(product.image)}
                        alt={product.name}
                    />
                </div>
                <div className="product-page-info">
                    <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
                    <p className="product-page-category">{product.category}</p>
                    <h1 className="product-page-title">{product.name}</h1>
                    <p className="product-page-price">₹{product.price.toLocaleString()}</p>
                    <div className="product-page-divider" />
                    <p className="product-page-description">
                        {product.description || 'Experience the natural elegance of our sustainably sourced products. Designed to minimize environmental impact without compromising on premium quality.'}
                    </p>
                    <div className="product-page-actions">
                        <button
                            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                            disabled={product.stock === 0}
                            onClick={() => {
                                addToCart(product);
                                navigate('/cart');
                            }}
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart →'}
                        </button>
                        {product.stock <= 10 && product.stock > 0 && (
                            <p className="low-stock-alert">⚠️ Hurry! Only {product.stock} left</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Product;
