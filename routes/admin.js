const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Route xử lý thêm sản phẩm
router.post('/', adminController.postAddProducts);
module.exports = router;
