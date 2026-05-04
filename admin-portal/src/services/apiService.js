// ═══════════════════════════════════════════════════════
//  Sapling & Seeds — Admin Portal API Service
// ═══════════════════════════════════════════════════════
const API_URL = '/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  isAuthenticated() {
    return !!this.token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  }

  // ── Auth ──────────────────────────────────────────────
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getCurrentUser() {
    return this.request('/auth/user');
  }

  logout() {
    this.clearToken();
  }

  // ── Products ──────────────────────────────────────────
  async getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/products${qs ? '?' + qs : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(data) {
    return this.request('/products', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProduct(id, data) {
    return this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // ── Orders ────────────────────────────────────────────
  async getOrders(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/orders${qs ? '?' + qs : ''}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ── Enquiries ─────────────────────────────────────────
  async getEnquiries(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/enquiries${qs ? '?' + qs : ''}`);
  }

  async updateEnquiry(id, data) {
    return this.request(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ── Dashboard Stats ───────────────────────────────────
  async getDashboardStats() {
    return this.request('/admin/stats');
  }
}

export default new ApiService();
