import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Set up directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';
import fs from 'fs';

// Explicitly load .env (though we are bypassing it for the DB right now)
dotenv.config({ path: join(__dirname, '../.env') }); 

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { getDashboardStats } from './routes/productRoutes.js';

const app = express();
app.set('trust proxy', true);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5714',
    'http://localhost:3000',
    'https://www.saplingandseeds.com',
    'https://saplingandseeds.com',
    /^http:\/\/localhost:\d+$/, 
    process.env.ADMIN_PORTAL_URL,
    process.env.SAPLING_SEEDS_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ==========================================
// THE GUARANTEED DATABASE FIX
// We are hardcoding the string to ignore the .env file entirely
// ==========================================
const mongoURI = "mongodb://ajayk283703_db_user:PPWSb8wzJuZKGGET@ac-c7dasor-shard-00-00.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-01.uhsusji.mongodb.net:27017,ac-c7dasor-shard-00-02.uhsusji.mongodb.net:27017/?ssl=true&replicaSet=atlas-9uekf1-shard-0&authSource=admin&appName=Cluster0";

console.log("============== DEBUG ==============");
console.log("Attempting to connect to MongoDB...");
console.log("===================================");

mongoose
  .connect(mongoURI) 
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error details:', error);
    process.exit(1); 
  });

// Basic Route to Test the Connection
app.get('/api/status', (req, res) => {
  res.json({ message: 'Sapling & Seeds API is running smoothly!' });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/upload`, uploadRoutes);
app.use(`${apiPrefix}/ai`, aiRoutes);
app.use(`${apiPrefix}/enquiries`, enquiryRoutes);
app.get(`${apiPrefix}/admin/stats`, getDashboardStats);

// Root API endpoint
app.get(`${apiPrefix}`, (req, res) => {
  res.json({
    message: 'Sapling Seeds API',
    version: 'v1',
    status: 'running'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});