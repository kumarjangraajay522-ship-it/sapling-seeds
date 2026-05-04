<<<<<<< HEAD
# Sapling Seeds - Full Stack Setup

This is a monorepo containing three main parts:
- **admin-portal/**: Admin dashboard React application
- **sapling-seeds/**: Main customer-facing React application  
- **backend/**: Node.js + Express API server with MongoDB

## Project Structure

```
sapling-seeds-react/
├── admin-portal/          # Admin portal React app
├── sapling-seeds/         # Main website React app
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── server.js     # Main application entry
│   │   ├── models/       # MongoDB schemas
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Custom middleware
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## Prerequisites

- Node.js 14+ and npm
- MongoDB 4.0+ (local or Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env

# Edit .env and update MongoDB URI and other settings
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/sapling-seeds
# For MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sapling-seeds
```

### 2. Admin Portal Setup

```bash
cd admin-portal

# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Development server
npm run dev
# Runs on http://localhost:5173
```

### 3. Sapling Seeds Setup

```bash
cd sapling-seeds

# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Development server
npm run dev
# Runs on http://localhost:5174
```

## Running the Application

### Terminal 1: Backend Server
```bash
cd backend
npm install  # First time only
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Admin Portal
```bash
cd admin-portal
npm install  # First time only
npm run dev
# Admin portal runs on http://localhost:5173
```

### Terminal 3: Sapling Seeds
```bash
cd sapling-seeds
npm install  # First time only
npm run dev
# Main app runs on http://localhost:5174
```

## API Documentation

### Base URL
`http://localhost:5000/api/v1`

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // or "admin"
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User (Protected)
```
GET /auth/user
Authorization: Bearer {token}
```

### Health Check
```
GET /health

Response:
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2024-03-22T..."
}
```

## Frontend API Integration

### Admin Portal (.env.local)
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Sapling Seeds (.env.local)
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Making API Calls from React
```javascript
const API_URL = import.meta.env.VITE_API_URL;

// Example: Register
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'pass123'
  })
});

// Example: Protected Request
const response = await fetch(`${API_URL}/auth/user`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Environment Variables

### Backend (.env)
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

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Production Deployment

### Backend Deployment
- Use services like Heroku, Railway, or Render
- Set environment variables on the hosting platform
- Ensure MongoDB is accessible from the server

### Frontend Deployment
- Build apps: `npm run build`
- Deploy to Vercel, Netlify, or similar services
- Update `VITE_API_URL` to production API URL

## Next Steps

1. Add more API routes in `backend/src/routes/`
2. Create more MongoDB models in `backend/src/models/`
3. Add form handlers in React components to call backend endpoints
4. Implement error handling and loading states in frontends
5. Add database migrations if needed

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MongoDB URI in .env
- Verify database name and credentials

### CORS Errors
- Check that frontend URLs in backend .env match your local development URLs
- Restart backend server after changing CORS settings

### Backend Not Responding
- Verify backend is running on port 5000
- Check that API_URL in frontend .env matches backend URL
- Check browser console for network errors

## Support

For issues or questions, refer to:
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
=======
"# sapling-seeds" 
>>>>>>> 8bc0e51686a2e8b9f31edb4d44d41e59075653e0
