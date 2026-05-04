# Backend Setup Summary

## ✅ What's Been Created

### Backend Structure (`backend/`)
```
backend/
├── src/
│   ├── server.js                  # Main Express server
│   ├── controllers/
│   │   └── authController.js      # Auth business logic
│   ├── models/
│   │   └── User.js                # MongoDB User schema
│   ├── routes/
│   │   └── authRoutes.js          # Auth API endpoints
│   └── middleware/
│       └── auth.js                # JWT authentication
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
└── README.md                      # Full documentation (in parent)
```

### Frontend Services (`admin-portal/src/services/` and `sapling-seeds/src/services/`)
```
├── apiService.js                  # Reusable API client
```

### Environment Files (Templates)
```
├── backend/.env.example           # Backend configuration
├── admin-portal/.env.example      # Admin portal config
└── sapling-seeds/.env.example     # Main app config
```

## 🎯 Key Features Included

1. **Express.js Backend** with CORS enabled for both frontends
2. **MongoDB Integration** via Mongoose ODM
3. **JWT Authentication** for secure API access
4. **User Management** - Register, Login, Get Current User
5. **API Service Classes** for easy frontend integration
6. **Authentication Middleware** for protected routes
7. **Error Handling** at request and response levels
8. **Environment Configuration** for dev/prod flexibility

## 🚀 To Get Started

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
```bash
cp .env.example .env
```

### 4. Update .env with your settings
```env
MONGODB_URI=mongodb://localhost:27017/sapling-seeds
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
ADMIN_PORTAL_URL=http://localhost:5173
SAPLING_SEEDS_URL=http://localhost:5174
API_PREFIX=/api/v1
```

### 5. Start the backend
```bash
npm run dev
# Backend running on http://localhost:5000
```

## 📋 API Endpoints Available

### Public Routes (No authentication needed)
- `POST /api/v1/auth/register` - Create new user
- `POST /api/v1/auth/login` - User login
- `GET /health` - Health check

### Protected Routes (Requires token)
- `GET /api/v1/auth/user` - Get current user info

## 🔌 Using API Service in Components

### Example in Admin Portal or Sapling Seeds:

```javascript
import apiService from '../services/apiService.js';

// Login
const handleLogin = async (email, password) => {
  try {
    const response = await apiService.login(email, password);
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Register
const handleRegister = async (name, email, password) => {
  try {
    const response = await apiService.register(name, email, password);
    console.log('Registered:', response.user);
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Get current user
const handleGetUser = async () => {
  try {
    const response = await apiService.getCurrentUser();
    console.log('Current user:', response.user);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// Logout
const handleLogout = () => {
  apiService.logout();
};
```

## 📚 Documentation Files

- **[QUICKSTART.md](../QUICKSTART.md)** - Quick setup guide
- **[README.md](../README.md)** - Complete documentation
- **[backend/package.json](backend/package.json)** - Backend dependencies

## 🔄 How They Connect

```
┌─────────────────────────────────────────────────────────────┐
│                    Port 3000-3100                            │
│        MongoDB Database (Local or Atlas)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
    Port 5000                        Port 5000
    Backend API Server               Shared Database
    (Express + Node.js)              Connection
        │                                │
   ┌────┴──────────────────┬──────────────┴────┐
   │                       │                    │
   ▼                       ▼                    ▼
Port 5173              Port 5174            Admin Panel
Admin Portal         Sapling Seeds         Admin Portal
  (React)              (React)              Uses Backend
  Uses Backend       Uses Backend          API for data
  API Calls          API Calls
```

## 🛠️ Next Steps

1. **Install dependencies** - `npm install` in backend folder
2. **Configure MongoDB** - Update MONGODB_URI in .env
3. **Start backend** - `npm run dev`
4. **Test API** - Visit http://localhost:5000/health
5. **Update frontends** - Create .env.local files in both folders
6. **Start frontends** - `npm run dev` in each folder
7. **Create features** - Add new endpoints and components as needed

## 📖 Available Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev          # Start development server with auto-reload
npm start            # Start production server
npm test             # Run tests (add test files)
```

## ⚙️ Technologies Used

- **Backend**: Express.js, Mongoose, JWT, bcryptjs
- **Frontend**: React, Vite, fetch API
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Password hashing with bcryptjs, CORS

## 💡 Features to Add Later

- [ ] Product management APIs
- [ ] Order management
- [ ] Payment processing
- [ ] Email notifications
- [ ] File uploads
- [ ] Admin dashboard features
- [ ] Customer dashboard
- [ ] Reviews and ratings
- [ ] Search functionality
- [ ] Filtering and pagination

---

**Everything is ready! Start with the QUICKSTART.md guide to get your dev environment running.**
