const Product = require('../models/products');

exports.postAddProducts = (req, res, next) => {
    const { title, imgUrl, description, price, color, category, size, brand, tags, amount } = req.body;
    const product = new Product(title, imgUrl, description, price, color, category, size, brand, tags, amount, null, req.user._id);
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
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.id; // Sử dụng id làm tham số
    Product.findById(productId)
      .then(product => {
        if (!product) {
          console.log("Product not found");
          return res.status(404).render('admin/manage-products', {
            message: 'Sản phẩm không tồn tại.',
            path: '/manage-products',
          });
        }
        // console.log("Product found:", product);  // Kiểm tra thông tin sản phẩm
        res.render('admin/edit-product', {
          product: product,
          path: `/manage-products/${product._id}`,
        });
      })
      .catch(err => {
        console.log("Error:", err);
        res.status(500).render('admin/manage-products', {
          message: 'Đã xảy ra lỗi khi tải sản phẩm.',
          path: '/manage-products',
        });
      });
};


// Cập nhật thông tin sản phẩm khi người dùng gửi form
exports.postEditProduct = async (req, res, next) => {
    const productId = req.params.id; // Sử dụng id trong URL
    const updatedData = {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        description: req.body.description,
        price: req.body.price,
        color: req.body.color,
        category: req.body.category,
        size: req.body.size,
        brand: req.body.brand,
        tags: req.body.tags,
        amount: req.body.amount
    };

    try {
        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.redirect('/manage-products'); // Sau khi cập nhật xong, điều hướng về trang quản lý sản phẩm
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.id; // Sử dụng id làm tham số
    Product.deleteById(productId)
        .then( ()=> {
            console.log('Destroyed product');
            res.redirect('/manage-products');
        })
        .catch(err => {
            console.log(err);
        });
};