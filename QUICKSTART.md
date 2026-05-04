# Quick Start Guide

## 🚀 First Time Setup

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file and set your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/sapling-seeds
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
ADMIN_PORTAL_URL=http://localhost:5173
SAPLING_SEEDS_URL=http://localhost:5174
API_PREFIX=/api/v1
```

### Step 2: Admin Portal Setup
```bash
cd admin-portal
npm install
cp .env.example .env.local
```

Contents of `.env.local`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 3: Sapling Seeds Setup
```bash
cd sapling-seeds
npm install
cp .env.example .env.local
```

Contents of `.env.local`:
```
VITE_API_URL=http://localhost:5000/api/v1
```

## 🎯 Running All Three Services

Open 3 terminal windows and run in each:

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:5000

**Terminal 2 - Admin Portal**
```bash
cd admin-portal
npm run dev
```
✅ Admin Portal runs on: http://localhost:5173

**Terminal 3 - Sapling Seeds**
```bash
cd sapling-seeds
npm run dev
```
✅ Main App runs on: http://localhost:5174

## 📱 Testing API Connectivity

Once all three are running, test the backend health:

```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2024-03-22T..."
}
```

## 🔗 API Usage Examples

### Register a new user (in Admin Portal or Sapling Seeds)
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data.token);  // Store this token for authenticated requests
```

### Login
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### Get Current User (Protected)
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/v1/auth/user', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.user);
```

## 📦 MongoDB Setup

### Option 1: Local MongoDB
If you don't have MongoDB installed:
1. Download from https://www.mongodb.com/try/download/community
2. Install it
3. Start MongoDB service
4. Use `MONGODB_URI=mongodb://localhost:27017/sapling-seeds` in `.env`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/sapling-seeds`)
4. Add to `.env` file

## ✅ Folder Structure

```
sapling-seeds-react/
├── backend/                    # Express API Server
│   ├── src/
│   │   ├── server.js          # Main app
│   │   ├── controllers/        # Business logic
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   └── middleware/         # Custom middleware
│   ├── package.json
│   ├── .env                    # (Create from .env.example)
│   └── .env.example
├── admin-portal/              # Admin Dashboard
│   ├── src/
│   ├── package.json
│   └── .env.local             # (Create from .env.example)
├── sapling-seeds/             # Main Website
│   ├── src/
│   ├── package.json
│   └── .env.local             # (Create from .env.example)
└── README.md                  # Full documentation
```

## 🐛 Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 14+)
- Try deleting `node_modules` and reinstalling: `npm install`
- Check if port 5000 is already in use

### MongoDB connection error
- Ensure MongoDB is running
- Check your MongoDB URI in `.env`
- Try connection string: `mongodb://localhost:27017/sapling-seeds`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env.local` matches backend URL
- Check browser Network tab for CORS errors

### CORS errors
- Verify frontend URLs in backend `.env`
- Restart backend after changing `ADMIN_PORTAL_URL` or `SAPLING_SEEDS_URL`

## 📚 Next Steps

1. **Add Database Models**: Create more schemas in `backend/src/models/`
2. **Extend API Routes**: Add more endpoints in `backend/src/routes/`
3. **Frontend Integration**: Create API service in React apps
4. **Add Features**: Products, orders, payments, etc.
5. **Deploy**: Move to production hosting

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)
- [REST API Best Practices](https://restfulapi.net/)
- [React Hooks](https://react.dev/reference/react/hooks)
