const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);

module.exports = router;
