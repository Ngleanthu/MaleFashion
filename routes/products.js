const express = require('express');
const productController = require('../controllers/products');
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

module.exports = router;
