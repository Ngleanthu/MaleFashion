const Product = require('../models/products');

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
      res.render('user/shop', {
        prods: products,
        path: '/shop',
      });
    }).catch(err => {
        console.log(err);
    });
  };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
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
        path: `/shop/${product._id}`,
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
  
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('user/shop', {
        prods: products,
        path: '/shop'
      })
    })
}
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      console.log(products);
      res.render('user/shopping-cart', {
        path: '/shopping-cart',
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("postCartController" + prodId);
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      console.log("success")
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    })
}