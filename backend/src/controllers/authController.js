console.log('--- authController.js Loading ---');
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          profileImage: user.profileImage || '',
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          profileImage: user.profileImage || '',
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/user
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          profileImage: user.profileImage || '',
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/user
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;
      if (req.body.phone !== undefined) {
          user.phone = req.body.phone;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        token: generateToken(updatedUser._id),
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          isAdmin: updatedUser.isAdmin,
          profileImage: updatedUser.profileImage || '',
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google auth
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { tokenId, idToken } = req.body;
    const token = tokenId || idToken;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Google Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if doesn't exist
      const password = Math.random().toString(36).slice(-10); // Random password for social login
      user = await User.create({
        name,
        email,
        password,
        phone: '',
        profileImage: picture || '',
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- OTP Logic ---

// In-memory OTP store for customer auth: { email: { code, expiresAt } }
const customerOtpStore = new Map();

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Request Auth OTP (Customer login/signup)
// @route   POST /api/v1/auth/request-otp
// @access  Public
export const requestAuthOTP = async (req, res) => {
    try {
        const { email, password, type } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const emailLower = email.toLowerCase();

        if (type === 'login') {
            const user = await User.findOne({ email: emailLower }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, error: 'Invalid email or password' });
            }
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, error: 'Invalid email or password' });
            }
        } else if (type === 'signup') {
            const userExists = await User.findOne({ email: emailLower });
            if (userExists) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            }
        } else {
            return res.status(400).json({ success: false, error: 'Invalid type' });
        }

        const code = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        customerOtpStore.set(emailLower, { code, expiresAt });

        try {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: `"Sapling & Seeds" <${process.env.EMAIL_USER}>`,
                to: emailLower,
                subject: `🌿 Your Verification Code: ${code}`,
                html: `
                    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #060f08; border-radius: 16px; overflow: hidden; border: 1px solid rgba(49,179,115,0.25);">
                        <div style="background: linear-gradient(135deg, #0b2914, #0d3d1c); padding: 32px; text-align: center; border-bottom: 1px solid rgba(49,179,115,0.2);">
                            <div style="font-size: 2.5rem; margin-bottom: 8px;">🌿</div>
                            <h1 style="color: #a8d8b8; font-size: 1.4rem; margin: 0; font-weight: 700;">Sapling &amp; Seeds</h1>
                        </div>
                        <div style="padding: 40px 32px; text-align: center;">
                            <h2 style="color: #e0f0e6; font-size: 1.2rem; margin: 0 0 8px; font-weight: 600;">Your Verification Code</h2>
                            <p style="color: #6b9e7c; font-size: 0.9rem; margin: 0 0 28px;">Use this code to complete your ${type}.</p>
                            <div style="background: rgba(49,179,115,0.1); border: 2px solid rgba(49,179,115,0.3); border-radius: 14px; padding: 24px; margin: 0 0 28px; display: inline-block; width: 100%;">
                                <span style="font-size: 2.8rem; font-weight: 800; color: #5ce87c; letter-spacing: 12px; font-family: monospace;">${code}</span>
                            </div>
                            <p style="color: #4d7a5e; font-size: 0.82rem; margin: 0;">This OTP expires in <strong style="color: #6b9e7c;">5 minutes</strong>.</p>
                        </div>
                    </div>
                `,
            });
            return res.json({ success: true, message: 'OTP sent successfully' });
        } catch (err) {
            console.error('📧 EMAIL FAIL:', err.message);
            return res.json({ 
                success: true, 
                message: 'OTP sent! (Email failed, using Dev Fallback)',
                devCode: code
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify Auth OTP (Customer login/signup)
// @route   POST /api/v1/auth/verify-auth-otp
// @access  Public
export const verifyAuthOTP = async (req, res) => {
    try {
        const { email, password, name, type, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Email and OTP are required' });
        }

        const emailLower = email.toLowerCase();
        const record = customerOtpStore.get(emailLower);

        if (!record) {
            return res.status(400).json({ success: false, error: 'OTP not found. Please request a new one.' });
        }
        if (Date.now() > record.expiresAt) {
            customerOtpStore.delete(emailLower);
            return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
        }
        if (record.code !== otp) {
            return res.status(400).json({ success: false, error: 'Incorrect OTP. Please try again.' });
        }

        // OTP is valid
        customerOtpStore.delete(emailLower);

        let user;
        if (type === 'login') {
            user = await User.findOne({ email: emailLower });
            if (!user) {
                 return res.status(401).json({ success: false, error: 'User not found' });
            }
        } else if (type === 'signup') {
            user = await User.create({
                name,
                email: emailLower,
                password,
                phone: '',
            });
        }

        if (user) {
            res.status(type === 'signup' ? 201 : 200).json({
                success: true,
                message: 'OTP verified successfully',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    profileImage: user.profileImage || '',
                },
            });
        } else {
            res.status(400).json({ success: false, error: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
