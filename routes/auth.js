const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signin', authController.getSignIn);
router.get('/signup', authController.getSignUp);
router.get('/forgotpassword', authController.getForgotPassword);

module.exports = router;
