import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import { assets } from '../assets/shop_assets/assets';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const getProductImage = (imageStr) => {
  if (imageStr && assets[imageStr]) return assets[imageStr];
  if (typeof imageStr === 'string' && imageStr.startsWith('/')) return `${API_URL.replace('/api/v1', '')}${imageStr}`;
  if (typeof imageStr === 'string' && imageStr.startsWith('http') && !imageStr.includes('unsplash') && !imageStr.includes('placeholder')) return imageStr;
  
  // Use a neat default or actual unsplash fallback exactly mirroring ProductPreview
  return imageStr || 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';
};

// --- Static Initial Data ---
const STATIC_PRODUCTS = [
  { _id: 'static-1', name: 'Herbal Neem Combs', price: 150, category: 'Hair Care', stock: 65, image: 'neemrubycomb', description: 'Natural neem wood combs for healthy hair.', isStatic: true },
  { _id: 'static-2', name: 'Seed Pen', price: 15, category: 'Stationery', stock: 120, image: 'seedpen', description: 'Plant a pen — grows into herbs after use.', isStatic: true },
  { _id: 'static-3', name: 'Wooden Pen', price: 50, category: 'Stationery', stock: 80, image: 'penWithBox', description: 'Sustainably sourced wooden pen.', isStatic: true },
  { _id: 'static-4', name: 'Adult Toothbrush', price: 50, category: 'Oral Care', stock: 200, image: 'bottomPaintCharcoal', description: 'Bamboo adult toothbrush — plastic free.', isStatic: true },
  // Gifting Fallbacks
  { _id: 'static-g1', name: 'Bamboo Diary with Pen', category: 'Stationery', price: 0, stock: 100, image: 'dairyWithPen', isGifting: true, isStatic: true },
  { _id: 'static-g2', name: 'Bamboo Notepad Combo', category: 'Stationery', price: 0, stock: 100, image: 'plantableA5Notebook', isGifting: true, isStatic: true },
  { _id: 'static-g3', name: 'Bamboo Diary, Bottle & Pen', category: 'Gift Set', price: 0, stock: 100, image: 'giftSet1', isGifting: true, isStatic: true },
];

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiStatus, setApiStatus] = useState('offline');

  // Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', stock: '', description: '', image: '', isGifting: false });
  const [uploading, setUploading] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProductForm({ ...productForm, image: data.image });
        setUploading(false);
      } else {
        alert(data.message || 'Upload failed');
        setUploading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
      setUploading(false);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=100`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.length > 0 ? data.data : STATIC_PRODUCTS);
        setApiStatus('connected');
      }
    } catch (err) {
      setApiStatus('offline');
      setProducts(STATIC_PRODUCTS);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/enquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setEnquiries(data.data);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  }, []);

  const updateEnquiryStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      }
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchEnquiries();
  }, [fetchProducts, fetchOrders, fetchEnquiries]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openAddModal = (isGifting = false) => {
    setEditingProduct(null);
    setProductForm({ name: '', category: isGifting ? 'Gifting' : '', price: isGifting ? '0' : '', stock: isGifting ? '0' : '', description: '', image: '', isGifting });
    setShowProductModal(true);
  };

  const openEditModal = (p) => {
    if(p.isStatic) { alert('Cannot edit fallback preview items. Please add a real product to the DB first.'); return; }
    setEditingProduct(p);
    setProductForm({ 
      name: p.name||'', 
      category: p.category||'', 
      price: p.price||'', 
      stock: p.stock||'', 
      description: p.description||'', 
      image: p.image||'',
      isGifting: p.isGifting || false
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('admin_token');
      const isEdit = !!editingProduct;
      const url = isEdit ? `${API_URL}/products/${editingProduct._id}` : `${API_URL}/products`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        setShowProductModal(false);
        fetchProducts(); // Refresh products completely to ensure DB ID sync
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch(err) {
      alert('Network error saving product');
    }
  };

  const safeDeleteProduct = (p) => {
    if(p.isStatic) { alert('Cannot delete fallback preview items.'); return; }
    if(window.confirm(`Confirm delete ${p.name}?`)) deleteProduct(p._id);
  };

  const seedGiftingData = async () => {
    const STATIC_GIFTING_DATA = [
      { name: 'Bamboo Diary with Pen', category: 'Stationery', image: 'dairyWithPen', isGifting: true, price: 0, stock: 100, description: 'Premium bamboo notebook with matching pen.' },
      { name: 'Bamboo Notepad Combo', category: 'Stationery', image: 'plantableA5Notebook', isGifting: true, price: 0, stock: 100, description: 'Eco-friendly plantable notepad.' },
      { name: 'Bamboo Diary, Bottle & Pen', category: 'Gift Set', image: 'giftSet1', isGifting: true, price: 0, stock: 100, description: 'Complete corporate gift set.' },
      { name: 'Bamboo Diary & Bottle (500 ML)', category: 'Gift Set', image: 'giftSet2', isGifting: true, price: 0, stock: 100, description: 'Essential sustainable kit.' },
      { name: 'Bamboo Tumbler (450 ML)', category: 'Drinkware', image: 'tumbler1', isGifting: true, price: 0, stock: 100, description: 'Insulated bamboo tumbler.' },
      { name: 'Bamboo Coffee Mug (260 ML)', category: 'Drinkware', image: 'coffeeMug', isGifting: true, price: 0, stock: 100, description: 'Classic bamboo coffee mug.' },
      { name: 'Bamboo Wheat Fibre Mug (450 ML)', category: 'Drinkware', image: 'corkMug', isGifting: true, price: 0, stock: 100, description: 'Sustainable wheat fibre mug.' },
      { name: 'Bamboo Pen with Box', category: 'Stationery', image: 'penWithBox', isGifting: true, price: 0, stock: 100, description: 'Elegant bamboo pen in a gift box.' },
    ];

    if (!window.confirm('This will import 8 original gifting items into your database. Continue?')) return;

    setLoading(true);
    try {
      const token = sessionStorage.getItem('admin_token');
      for (const item of STATIC_GIFTING_DATA) {
        await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(item)
        });
      }
      alert('Gifting data seeded successfully!');
      fetchProducts();
    } catch (err) {
      alert('Error seeding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🌿</div>
          <div className="brand-text">
            <h2>Sapling & Seeds</h2>
            <p>Admin Suite</p>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-label">Main Navigation</div>
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="menu-emoji">📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="menu-emoji">📦</span>
            <span>Products</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'gifting' ? 'active' : ''}`}
            onClick={() => setActiveTab('gifting')}
          >
            <span className="menu-emoji">🎁</span>
            <span>Corporate Gifting</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="menu-emoji">📋</span>
            <span>Orders</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'queries' ? 'active' : ''}`}
            onClick={() => setActiveTab('queries')}
          >
            <span className="menu-emoji">💬</span>
            <span>Queries</span>
          </button>
          <button 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="menu-emoji">⚙</span>
            <span>Settings</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              ☰
            </button>
            <div className="search-box">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search products or orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <a href={import.meta.env.VITE_STOREFRONT_URL || "http://localhost:5174"} target="_blank" rel="noreferrer" className="storefront-link">
              <span>🚀</span> Storefront ↗
            </a>
            <div className="avatar-wrapper">
              <div className="avatar" style={{ background: '#31b373', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Super Admin ▾</span>
              </div>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          {activeTab === 'dashboard' && (
            <div className="dashboard-section">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Dashboard Overview</h1>
                  <p className="page-subtitle">Welcome back to your store metrics.</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon stat-icon-green">📦</div>
                  <div className="stat-details">
                    <p className="stat-label">Total Products</p>
                    <p className="stat-value">{products.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stat-icon-blue">📋</div>
                  <div className="stat-details">
                    <p className="stat-label">Total Orders</p>
                    <p className="stat-value">{orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon stat-icon-purple">💰</div>
                  <div className="stat-details">
                    <p className="stat-label">Total Revenue</p>
                    <p className="stat-value">₹{orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fff9c4', color: '#fbc02d' }}>💬</div>
                  <div className="stat-details">
                    <p className="stat-label">Queries</p>
                    <p className="stat-value">{enquiries.length}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Recent Orders</h3>
                  <button className="text-btn" onClick={() => setActiveTab('orders')}>View All</button>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id}>
                          <td className="fw-600">#{o._id.slice(-6).toUpperCase()}</td>
                          <td>{o.user?.name || 'Guest'}</td>
                          <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                          <td>₹{o.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Product Inventory</h1>
                  <p className="page-subtitle">Manage your bamboo-based product catalog.</p>
                </div>
                <button className="primary-btn" onClick={() => openAddModal(false)}>+ Add Product</button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => !p.isGifting && !['Gift Set', 'Gifting', 'Combo'].includes(p.category) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, i) => (
                        <tr key={p._id}>
                          <td className="text-muted">{i + 1}</td>
                          <td>
                            <div className="product-row-info">
                              <img src={getProductImage(p.image)} alt="" className="product-thumb" />
                              <div className="fw-600">{p.name}</div>
                            </div>
                          </td>
                          <td><span className="category-chip">{p.category}</span></td>
                          <td>₹{p.price}</td>
                          <td className={p.stock < 10 ? 'alert-text fw-600' : ''}>{p.stock}</td>
                          <td>
                            <div className="action-btns">
                              <button className="action-btn edit" onClick={() => openEditModal(p)}>Edit</button>
                              <button className="action-btn delete" onClick={() => safeDeleteProduct(p)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gifting' && (
            <div className="products-section">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Corporate Gifting</h1>
                  <p className="page-subtitle">Manage corporate and bulk gifting options. Price automatically hidden.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="secondary-btn" onClick={seedGiftingData}>Seed Original Gifting</button>
                  <button className="primary-btn" onClick={() => openAddModal(true)}>+ Add Gifting Item</button>
                </div>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Gifting Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => (p.isGifting || ['Gift Set', 'Gifting', 'Combo'].includes(p.category)) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((p, i) => (
                        <tr key={p._id}>
                          <td className="text-muted">{i + 1}</td>
                          <td>
                            <div className="product-row-info">
                              <img src={getProductImage(p.image)} alt="" className="product-thumb" />
                              <div className="fw-600">{p.name}</div>
                            </div>
                          </td>
                          <td><span className="category-chip" style={{ background: '#e3f2fd', color: '#1565c0' }}>{p.category}</span></td>
                          <td><span className="badge badge-pending" style={{ background: '#f5f5f5', color: '#555' }}>On Request</span></td>
                          <td>
                            <div className="action-btns">
                              <button className="action-btn edit" onClick={() => openEditModal(p)}>Edit</button>
                              <button className="action-btn delete" onClick={() => safeDeleteProduct(p)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.filter(p => p.isGifting || ['Gift Set', 'Gifting', 'Combo'].includes(p.category)).length === 0 && (
                        <tr><td colSpan="5" className="text-center" style={{ padding: '40px' }}>No corporate gifting items found. Add one to get started.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Order Management</h1>
                  <p className="page-subtitle">Track and manage customer orders.</p>
                </div>
                <button className="primary-btn" onClick={fetchOrders}>Refresh Orders</button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Items</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(o => o._id.includes(searchQuery) || o.user?.name.toLowerCase().includes(searchQuery.toLowerCase())).map(o => (
                        <tr key={o._id}>
                          <td className="fw-600">#{o._id.slice(-6).toUpperCase()}</td>
                          <td>{o.user?.name || 'Guest'}</td>
                          <td className="text-muted">{o.user?.email || '—'}</td>
                          <td className="text-muted">{o.user?.phone || '—'}</td>
                          <td>
                            <div className="order-items-thumbs">
                              {o.orderItems?.slice(0, 3).map((item, idx) => (
                                <img key={idx} src={getProductImage(item.image)} alt="" className="item-mini-thumb" title={item.name} />
                              ))}
                              {o.orderItems?.length > 3 && <span className="more-items-count">+{o.orderItems.length - 3}</span>}
                            </div>
                          </td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td><span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span></td>
                          <td>₹{o.totalPrice}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <select 
                                className="status-select"
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                              >
                                <option>Pending</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                              </select>
                              <button className="action-btn label-btn" onClick={() => { setSelectedOrder(o); setShowLabelModal(true); }}>
                                🏷️ Label
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="queries-section">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Customer Enquiries</h1>
                  <p className="page-subtitle">Manage messages from Contact form and Bamboo Buddy callbacks.</p>
                </div>
                <button className="primary-btn" onClick={fetchEnquiries}>Refresh Queries</button>
              </div>

              <div className="card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.phone.includes(searchQuery)).map(e => (
                        <tr key={e._id}>
                          <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${e.type === 'callback' ? 'badge-processing' : 'badge-shipped'}`} style={{ textTransform: 'capitalize' }}>
                              {e.type}
                            </span>
                          </td>
                          <td className="fw-600">{e.name}</td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>
                              <div>📞 {e.phone}</div>
                              {e.email && <div>✉️ {e.email}</div>}
                            </div>
                          </td>
                          <td>
                            <div style={{ maxWidth: '300px', fontSize: '0.85rem' }}>
                              {e.message && <div className="text-muted" style={{ fontStyle: 'italic' }}>"{e.message}"</div>}
                              {e.page && <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#666' }}>From: {e.page}</div>}
                            </div>
                          </td>
                          <td>
                            <select 
                              className="status-select"
                              value={e.status}
                              onChange={(ev) => updateEnquiryStatus(e._id, ev.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td>
                            <button className="action-btn delete" onClick={() => deleteEnquiry(e._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {enquiries.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center" style={{ padding: '40px' }}>No enquiries found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="page-header">
                <h1 className="page-title">System Settings</h1>
              </div>
              <div className="settings-grid">
                <div className="card settings-card">
                  <h3 className="settings-section-title">API Connection</h3>
                  <div className="settings-row">
                    <label>Backend URL</label>
                    <input type="text" className="settings-input" value={API_URL} readOnly />
                  </div>
                  <div className="settings-row">
                    <label>Connection Status</label>
                    <div className={`api-status ${apiStatus}`}>
                      <span className="status-dot"></span>
                      {apiStatus === 'connected' ? 'Systems Operational' : 'Offline / Error'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal overlay */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSaveProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="e.g. Bamboo Straw" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input required type="text" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder="e.g. Eco Home" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input required type="number" min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input required type="number" min="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                  <input 
                    type="checkbox" 
                    id="isGifting" 
                    checked={productForm.isGifting} 
                    onChange={e => setProductForm({...productForm, isGifting: e.target.checked})} 
                    style={{ width: '20px', height: '20px' }}
                  />
                  <label htmlFor="isGifting" style={{ marginBottom: 0, cursor: 'pointer' }}>Mark as Gifting Item</label>
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    onChange={uploadFileHandler} 
                    style={{ flex: 1 }}
                    accept="image/*"
                  />
                  {uploading && <span className="loader-small">Uploading...</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                  Selected: {productForm.image || 'None'}
                </p>
                <input 
                  type="text" 
                  value={productForm.image} 
                  onChange={e => setProductForm({...productForm, image: e.target.value})} 
                  placeholder="Or enter URL/Asset Key..." 
                  style={{ marginTop: '5px' }}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Product details..."></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Shipping Label Modal */}
      {showLabelModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowLabelModal(false)}>
          <div className="label-modal-box" onClick={e => e.stopPropagation()}>
            <div className="label-modal-actions">
              <button className="primary-btn" onClick={() => window.print()}>🖨️ Print Label</button>
              <button className="btn-cancel" onClick={() => setShowLabelModal(false)}>Close</button>
            </div>
            
            <div id="printable-label" className="meesho-label">
              <div className="label-header">
                <div className="label-logo">🌿 Sapling & Seeds</div>
                <div className="label-type">{selectedOrder.paymentMethod === 'COD' ? 'CASH ON DELIVERY' : 'PREPAID'}</div>
              </div>

              <div className="label-body">
                <div className="label-section ship-to">
                  <div className="section-title">SHIPPING ADDRESS</div>
                  <div className="section-content">
                    <h3>{selectedOrder.user?.name || 'Customer'}</h3>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                    <p className="label-phone">📞 {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>

                <div className="label-section order-details">
                  <div className="section-title">ORDER DETAILS</div>
                  <table className="label-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="label-total">
                    <span>Total Amount:</span>
                    <strong>₹{selectedOrder.totalPrice}</strong>
                  </div>
                </div>
              </div>

              <div className="label-footer">
                <div className="return-address">
                  <div className="section-title">RETURN ADDRESS</div>
                  <p>Sapling & Seeds (Shanah Enterprises)</p>
                  <p>Faridabad, Haryana - 121001</p>
                  <p>Contact: 8800799151</p>
                </div>
                <div className="label-barcode">
                  <div className="barcode-placeholder">
                    #{selectedOrder._id.slice(-8).toUpperCase()}
                  </div>
                  <p>Order ID: {selectedOrder._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
