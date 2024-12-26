const express = require('express');
const productController = require('../controllers/products');
const router = express.Router();

router.get('/shop', productController.getAllProducts);
router.get('/shop/shop-details/:productId', productController.getProduct);
module.exports = router;
