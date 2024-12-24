const Product = require('../models/products');

exports.postAddProducts = (req, res, next) => {
    const { title, imgUrl, description, price, color, category, size, brand, tags, amount } = req.body;
    const product = new Product(title, imgUrl, description, price, color, category, size, brand, tags, amount);
    product
        .save()
        .then(result => {
            console.log('Product saved!');
            res.redirect('/manage-products');
        })
        .catch(err => {
            console.error(err);
        });
};
