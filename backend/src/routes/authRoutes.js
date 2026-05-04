import express from 'express';
import { registerUser, loginUser, getCurrentUser, requestAuthOTP, verifyAuthOTP, googleAuth, updateUser } from '../controllers/authController.js';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

// OTP Routes (admin login)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Customer Customer OTP Auth Flow
router.post('/request-otp', requestAuthOTP);
router.post('/verify-auth-otp', verifyAuthOTP);

// Protected Routes
router.get('/user', authenticateToken, getCurrentUser);
router.put('/user', authenticateToken, updateUser);

export default router;
