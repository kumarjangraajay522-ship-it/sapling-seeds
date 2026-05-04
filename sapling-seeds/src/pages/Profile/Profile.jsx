import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { resolveImageUrl } from '../../utils/imageUtils';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const Profile = () => {
    const navigate = useNavigate();
    const { user, token, updateUser, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editPhone, setEditPhone] = useState(user?.phone || '');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/orders/myorders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setOrders(data);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [user, token, navigate]);

    const handleSave = async () => {
        if (!editName.trim()) return;
        setUpdateLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName, phone: editPhone })
            });
            const data = await res.json();
            if (res.ok) {
                updateUser({ name: editName, phone: editPhone });
                setIsEditing(false);
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Update failed:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadRes = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                const profileRes = await fetch(`${API_URL}/auth/user`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ profileImage: uploadData.image })
                });
                const profileData = await profileRes.json();
                if (profileRes.ok) {
                    updateUser({ profileImage: uploadData.image });
                }
            } else {
                alert(uploadData.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Image upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeProfileImage = async () => {
        if (!window.confirm('Remove profile photo?')) return;
        try {
            const res = await fetch(`${API_URL}/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profileImage: '' })
            });
            if (res.ok) {
                updateUser({ profileImage: '' });
            }
        } catch (err) {
            console.error('Failed to remove image:', err);
        }
    };

    if (!user) return null;

    // Calculate Sustainability XP (mock logic)
    const totalOrders = orders.length;
    const currentXP = Math.min((totalOrders * 250) % 1000, 1000);
    const level = Math.floor((totalOrders * 250) / 1000) + 1;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="profile-avatar-section">
                    <div className="avatar-wrapper">
                        <img 
                            src={resolveImageUrl(user.profileImage)} 
                            alt={user.name} 
                            className="profile-avatar-img"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2e7d32&color=fff&size=128`;
                            }}
                        />
                        <button className="avatar-edit-btn" onClick={() => fileInputRef.current?.click()}>
                            {uploading ? '...' : '📷'}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    {user.profileImage && (
                        <button className="remove-avatar-link" onClick={removeProfileImage}>Remove Photo</button>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="user-intro"
                >
                    <h1>Hello, <span className="accent-text">{user.name.split(' ')[0]}!</span></h1>
                    <span className="user-email">{user.email}</span>
                </motion.div>

                <div className="account-badge">
                    <span className="badge-icon">🌿</span>
                    <span className="badge-text">Eco Level {level}</span>
                </div>
            </header>

            {/* ── ECO PROGRESS ── */}
            <motion.section 
                className="eco-progress-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="progress-header">
                    <div className="level-info">
                        <h3>Your Green Journey</h3>
                        <p>Keep making sustainable choices to level up!</p>
                    </div>
                    <div className="xp-value">{currentXP} / 1000 XP</div>
                </div>
                <div className="progress-bar-wrap">
                    <motion.div 
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentXP / 1000) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
            </motion.section>

            <main className="profile-content">
                <section className="orders-section">
                    <h2 className="section-title">Your Orders</h2>

                    {loading ? (
                        <div className="orders-loading">
                            <div className="spinner"></div>
                            <p>Fetching your green journey...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="orders-grid">
                            {orders.map((order) => (
                                <motion.div
                                    key={order._id}
                                    className="order-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="order-header-row">
                                        <div className="order-id-wrap">
                                            <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className={`status-pill ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-items-preview">
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <img key={i} src={resolveImageUrl(item.image, item.name)} alt={item.name} title={item.name} />
                                        ))}
                                        {order.items.length > 4 && (
                                            <div className="more-items">+{order.items.length - 4}</div>
                                        )}
                                    </div>

                                    <div className="order-footer-row">
                                        <div className="order-contact-details">
                                            <span>{order.user?.email}</span>
                                            {order.user?.phone && <span> • {order.user.phone}</span>}
                                        </div>
                                        <div className="order-total-wrap">
                                            <span className="total-label">Total Amount</span>
                                            <span className="total-value">₹{order.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-orders">
                            <div className="empty-icon">🌱</div>
                            <h3>Start Your Journey</h3>
                            <p>Every small swap makes a big difference for our planet.</p>
                            <button className="shop-now-btn" onClick={() => navigate('/')}>Explore Collection</button>
                        </div>
                    )}
                </section>

                <aside className="profile-sidebar">
                    <div className="sidebar-card info-card">
                        <h3>Account Details</h3>
                        <div className="info-item">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input
                                    className="edit-name-input"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <p>{user.name}</p>
                            )}
                        </div>
                        <div className="info-item">
                            <label>Mobile Number</label>
                            {isEditing ? (
                                <input
                                    className="edit-name-input"
                                    placeholder="e.g. +91 98765 43210"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                />
                            ) : (
                                <p>{user.phone || 'Not added'}</p>
                            )}
                        </div>
                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button
                                        className="save-profile-btn"
                                        onClick={handleSave}
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        className="cancel-profile-btn"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditName(user.name);
                                            setEditPhone(user.phone || '');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="sidebar-card impact-card">
                        <h3>Your Eco Stats</h3>
                        <div className="impact-stats-grid">
                            <div className="stat-box">
                                <span className="stat-emoji">🌊</span>
                                <span className="stat-num">{orders.length * 12}</span>
                                <span className="stat-label">Plastic Saved (g)</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-emoji">🌳</span>
                                <span className="stat-num">{orders.length}</span>
                                <span className="stat-label">Trees Planted</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-emoji">☁️</span>
                                <span className="stat-num">{orders.length * 2.5}</span>
                                <span className="stat-label">CO2 Offset (kg)</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-emoji">🍃</span>
                                <span className="stat-num">{orders.length * 4}</span>
                                <span className="stat-label">Eco Swaps</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Profile;
