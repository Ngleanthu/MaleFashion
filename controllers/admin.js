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

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll()  // Sử dụng phương thức fetchAll trong model Product
        .then(products => {
            res.render('admin/manage-products', {
                prods: products,
                path: '/manage-products'  // Truyền biến 'path' vào view
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching products');
        });
};
