const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Route xử lý thêm sản phẩm
router.post('/', adminController.postAddProducts);
router.get('/', adminController.getAllProducts);
router.get('/:id', adminController.getEditProduct);

// Cập nhật sản phẩm
router.post('/:id', adminController.postEditProduct);
router.post('/delete-product/:id', adminController.postDeleteProduct);
module.exports = router;
