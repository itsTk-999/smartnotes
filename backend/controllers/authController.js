const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// @desc    Auth user & get token
// @route   POST /api/auth/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      studyStreak: user.studyStreak,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Send Reset Link
// @route   POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // We send a 200 response even if the user is not found
    // to prevent attackers from checking which emails are registered.
    return res.status(200).json({ success: true, message: 'If a user with that email exists, a password reset link has been sent.' });
  }

  // Create a secret that is unique to the user's current password
  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '15m' });

  // This URL must point to your frontend's reset password page
  const resetUrl = `http://localhost:3000/reset-password/${user._id}/${token}`;

  const message = `
    <div style="font-family: 'Inter', sans-serif; background-color: #F8FAFC; padding: 20px 0; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: #F97316; padding: 20px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 800;">Smart Notes</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #0F172A;">Password Reset Required</h2>
          
          <p style="margin-bottom: 25px; line-height: 1.6; color: #334155;">Hello ${user.name},</p>
          
          <p style="margin-bottom: 30px; line-height: 1.6; color: #334155;">
            You requested a password reset. Please click the button below to securely set a new password. This link is valid for 15 minutes.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="
              background-color: #F97316;
              color: white !important;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
              box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
              font-size: 16px;
            ">Reset Password</a>
          </div>

          <p style="margin-top: 30px; line-height: 1.6; color: #334155;">
            If you did not request this, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        
        <div style="background-color: #F1F5F9; padding: 15px; text-align: center; border-top: 1px solid #E2E8F0;">
          <p style="font-size: 11px; color: #64748B; margin: 0;">&copy; 2025 Smart Notes. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Smart Notes - Password Reset',
      message,
    });
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error); // Log the actual error
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:id/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(token, secret);
    user.password = password;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }
});

module.exports = { authUser, registerUser, forgotPassword, resetPassword };