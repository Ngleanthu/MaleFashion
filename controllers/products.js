const Product = require('../models/products');

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
      res.render('user/shop', {
        prods: products,
        path: '/shop',
        // searchQuery: ''
      });
    }).catch(err => {
        console.log(err);
    });
  };

  exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log("Product ID:", prodId);  // Kiểm tra giá trị ID
    Product.findById(prodId)
      .then(product => {
        if (!product) {
          console.log("Product not found");
          return res.status(404).render('user/shop-details', {
            message: 'Sản phẩm không tồn tại.',
            path: '/shop',
          });
        }
        console.log("Product found:", product);  // Kiểm tra thông tin sản phẩm
        res.render('user/shop-details', {
          product: product,
          path: `/shop/shop-details/${product._id}`,
        });
      })
      .catch(err => {
        console.log("Error:", err);
        res.status(500).render('user/shop-details', {
          message: 'Đã xảy ra lỗi khi tải sản phẩm.',
          path: '/shop',
        });
      });
  };
  
  