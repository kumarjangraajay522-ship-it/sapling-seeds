// Sapling Seeds API Service
const API_URL = '/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic fetch method with headers
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/user', {
      method: 'GET'
    });
  }

  logout() {
    this.clearToken();
  }

  // Add more API methods as needed
  // Example:
  // async getProducts() {
  //   return this.request('/products', { method: 'GET' });
  // }
}

export default new ApiService();
