const express = require('express');
const productController = require('../controllers/products');
const router = express.Router();

router.get('/shop', productController.getAllProducts);
router.get('/shop/:productId', productController.getProduct);
router.get('/shopping-cart', productController.getCart);
router.post('/shopping-cart', productController.postCart);
router.post('/shopping-cart/:productId', productController.postCartDeleteProduct);

module.exports = router;
