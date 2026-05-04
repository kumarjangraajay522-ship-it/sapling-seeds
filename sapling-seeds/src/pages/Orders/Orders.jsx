import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../../assets/assets';
import './Orders.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const Orders = () => {
    const navigate = useNavigate();
    const [user] = useState(JSON.parse(localStorage.getItem('user_data') || 'null'));
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('user_token');
                const res = await fetch(`${API_URL}/orders/myorders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setOrders(data || []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="orders-page-container"
        >
            <div className="orders-header">
                <h1>Your <span className="accent-text">Orders</span></h1>
                <p>Tracking your sustainable journey</p>
            </div>

            <div className="orders-content">
                {loading ? (
                    <div className="orders-loading">
                        <div className="spinner"></div>
                        <p>Fetching your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h2>No orders placed yet.</h2>
                        <p>Your sustainable collection is waiting to begin.</p>
                        <button onClick={() => navigate('/collection')} className="shop-now-btn">Start Shopping</button>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <motion.div 
                                key={order._id} 
                                className="order-card"
                                whileHover={{ x: 10 }}
                            >
                                <div className="order-main">
                                    <div className="order-info">
                                        <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                                        <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-items-preview">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <img key={idx} src={getProductImage(item.image)} alt={item.name} title={item.name} />
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="more-items">+{order.items.length - 3}</div>
                                    )}
                                </div>
                                <div className="order-footer">
                                    <div className="total-box">
                                        <span className="total-label">Total Amount</span>
                                        <span className="total-value">₹{order.totalPrice.toLocaleString()}</span>
                                    </div>
                                    <button className="view-details-btn">View Details</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Orders;
