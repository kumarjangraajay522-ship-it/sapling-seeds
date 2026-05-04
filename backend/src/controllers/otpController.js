import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// In-memory OTP store: { email: { code, expiresAt } }
const otpStore = new Map();

// ── Create Gmail transporter ──────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS, // Gmail App Password (not account password)
    },
  });

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ── POST /api/v1/auth/send-otp ────────────────────────────────────────────────
export const sendOTP = async (req, res) => {
  const { email, subject, fromName } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  const code = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store OTP
  otpStore.set(email.toLowerCase(), { code, expiresAt });

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"${fromName || 'Sapling & Seeds Admin'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject || `🌿 Your OTP: ${code}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #060f08; border-radius: 16px; overflow: hidden; border: 1px solid rgba(49,179,115,0.25);">
          <div style="background: linear-gradient(135deg, #0b2914, #0d3d1c); padding: 32px; text-align: center; border-bottom: 1px solid rgba(49,179,115,0.2);">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🌿</div>
            <h1 style="color: #a8d8b8; font-size: 1.4rem; margin: 0; font-weight: 700;">Sapling &amp; Seeds</h1>
            <p style="color: #4d7a5e; font-size: 0.8rem; margin: 6px 0 0; text-transform: uppercase; letter-spacing: 2px;">Verification Service</p>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <h2 style="color: #e0f0e6; font-size: 1.2rem; margin: 0 0 8px; font-weight: 600;">Your Verification Code</h2>
            <p style="color: #6b9e7c; font-size: 0.9rem; margin: 0 0 28px;">Use this one-time password to complete your action securely.</p>
            <div style="background: rgba(49,179,115,0.1); border: 2px solid rgba(49,179,115,0.3); border-radius: 14px; padding: 24px; margin: 0 0 28px; display: inline-block; width: 100%;">
              <span style="font-size: 2.8rem; font-weight: 800; color: #5ce87c; letter-spacing: 12px; font-family: monospace;">${code}</span>
            </div>
            <p style="color: #4d7a5e; font-size: 0.82rem; margin: 0;">This OTP expires in <strong style="color: #6b9e7c;">5 minutes</strong>.</p>
            <p style="color: #4d7a5e; font-size: 0.78rem; margin: 12px 0 0;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: rgba(10,24,14,0.5); padding: 16px; text-align: center; border-top: 1px solid rgba(49,179,115,0.1);">
            <p style="color: #2d5a3a; font-size: 0.75rem; margin: 0;">© ${new Date().getFullYear()} Sapling &amp; Seeds. Eco-friendly products.</p>
          </div>
        </div>
      `,
    });

    return res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('📧 EMAIL FAIL:', err.message);
    
    // Return success with the code as a fallback for local development
    return res.json({ 
      success: true, 
      message: 'OTP sent! (Note: Email failed, using Dev Fallback)',
      devCode: code // Pass code back so UI can show a hint
    });
  }
};

// Internal Helper to check OTP
export const checkOTP = (email, otp) => {
  const record = otpStore.get(email?.toLowerCase());
  if (!record) return { success: false, error: 'OTP not found. Please request a new one.' };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }
  if (record.code !== otp) {
    return { success: false, error: 'Incorrect OTP. Please try again.' };
  }
  otpStore.delete(email.toLowerCase());
  return { success: true };
};

// ── POST /api/v1/auth/verify-otp ─────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  const result = checkOTP(email, otp);
  if (!result.success) {
      return res.status(400).json(result);
  }

  // Find admin user to generate a real JWT
  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    
    // Auto-create or promote user to admin for easy local development testing
    if (!user) {
      user = new User({
        name: 'Admin',
        email: email.toLowerCase(),
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      await user.save();
    } else if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied. Admin account required.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return res.json({ 
      success: true, 
      message: 'OTP verified successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Login failed', message: err.message });
  }
};
