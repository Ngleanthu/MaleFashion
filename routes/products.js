const express = require('express');
const productController = require('../controllers/products');
const adminController = require('../controllers/admin');
const router = express.Router();


router.get('/shop', productController.getAllProducts);
router.get('/shop/:productId', productController.getProduct);
router.get('/shopping-cart', productController.getCart);
router.post('/shopping-cart', productController.postCart);
router.post('/shopping-cart/update', productController.postCartUpdate);
router.post('/shopping-cart/:productId', productController.postCartDeleteProduct);
router.get('/checkout', productController.getCheckoutProduct);
router.post('/create-order', productController.postOrder);
router.get('/order', productController.getOrder);
router.get('/order/:orderId', productController.getOrderDetails);
router.get('/filter', productController.filterProducts);




module.exports = router;
