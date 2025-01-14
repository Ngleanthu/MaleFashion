const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Định tuyến cho các route liên quan đến đăng nhập, đăng ký và đăng xuất
router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);  // Đăng nhập qua Passport

router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);  // Đăng ký người dùng mới

router.get('/forgotpassword', authController.getForgotPassword);

router.get('/profile', authController.getProfile);

router.get('/logout', authController.getLogout);  // Đăng xuất

// router.get('/verify-email/:token', authController.verifyEmail);
module.exports = router;
