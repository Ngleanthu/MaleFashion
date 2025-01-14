const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
// Lấy sản phẩm
router.get('/manage-products', adminController.getAllProducts);
router.post('/manage-products', adminController.postAddProducts);
// Cập nhật sản phẩm
router.get('/manage-products/:id', adminController.getEditProduct);
router.post('/manage-products/:id', adminController.postEditProduct);
// Xoá sản phẩm
router.post('/manage-products/delete-product/:id', adminController.postDeleteProduct);

// router.post('/manage-users', adminController.postAllUsers);
router.get('/manage-users', adminController.getAllUsers);
router.get('/filterUser', adminController.filterAccountByAdmin);

// order
router.get('/manage-orders', adminController.getAllOrders);
router.get('/manage-orders/:id', adminController.getOrderDetails);

router.get('/filter', adminController.filterProducts);
router.get('/dashboard/revenue-report', adminController.getRevenueReport);
router.get('/dashboard/top-products', adminController.getTopProducts);
router.get('/dashboard', adminController.getDashboardStats);
router.get('/', adminController.getDashboardStats);


module.exports = router;
