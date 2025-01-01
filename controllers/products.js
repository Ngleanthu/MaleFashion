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
      // console.log("Product found:", product);  // Kiểm tra thông tin sản phẩm
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
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
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
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    })
}


exports.getCheckoutProduct = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('user/checkout', {
        path: '/checkout',
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    })
}


exports.postCartUpdate = (req, res, next) => {
  console.log(req.body); // Xem toàn bộ nội dung request body

  const updatedItems = req.body.items; 

  // Kiểm tra xem updatedItems có tồn tại và là mảng không
  if (!Array.isArray(updatedItems)) {
    console.log('Items are not valid or missing.');
    return res.status(400).send('Invalid or missing items.');
  }

  console.log(updatedItems + "day");

  // Tiến hành xử lý các sản phẩm trong giỏ hàng
  Promise.all(updatedItems.map(item => {
    if (item.quantity > 0) {
      // Cập nhật số lượng sản phẩm
      console.log("Cập nhật sản phẩm");
      // return req.user.updateCartItem(item.id, item.quantity);
    } else {
      // Xóa sản phẩm khỏi giỏ hàng
      console.log("Xóa sản phẩm");
      // return req.user.deleteItemFromCart(item.id);
    }
  }))
  .then(() => {
    res.redirect('/shopping-cart');
  })
  .catch(err => {
    console.log(err);
    res.status(500).send('Error processing cart update');
  });
};


exports.postOrder = (req, res, next) => {
  req.user.addOrder()
    .then(result => {
      res.redirect('/order');
    })
    .catch(err => {
      console.log(err);
    })
}


exports.getOrder = (req, res, next) => {
  req.user.getOrders()
    .then(orders => { 
      res.render('user/order', { 
        user: req.user,
        path: '/order',
        orders: orders
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getOrderDetails = (req, res, next) => {
  const orderId = req.params.orderId; 
  req.user.getOrderDetails(orderId)
    .then(order => {
      if (!order) {
        res.redirect('user/order'); 
      }
      res.render('user/order-details', { 
        user: req.user,
        order: order,
        path: `/order/${order._id}`
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('user/order'); 
    });
};
