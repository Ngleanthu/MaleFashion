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
