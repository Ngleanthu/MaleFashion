const Product = require('../models/products');

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.body.description;
    const price = req.body.price;
    const color = req.body.color;
    const category = req.body.category;
    const size = req.body.size;
    const brand = req.body.brand;
    const tags = req.body.tags;
    const amount = req.body.amount;    
    const product = new Product({
        title: title,
        imgUrl: imgUrl,
        description: description,
        price: price,
        color: color,
        category: category,
        size: size,
        brand: brand,
        tags: tags,
        amount: amount,
        userId: req.user
    })
    product.save()
        .then(result => {
            console.log('Product saved!');
            res.redirect('/manage-products');
        })
        .catch(err => {
            console.error(err);
        });
};

exports.getAllProducts = (req, res, next) => {
    let page = req.query.page ? req.query.page : 1;
    let limit = 2; 
    Product.find()  // Sử dụng phương thức fetchAll trong model Product
        .then(products => {
            res.render('admin/manage-products', {
                prods: products.slice((page - 1) * limit, page * limit),
                path: '/manage-products',  // Truyền biến 'path' vào view
                currentPage: page, // Trang hiện tại
                totalProducts: products.length, // Tổng số sản phẩm
                totalPages: Math.ceil(products.length / limit), // Tổng số trang (2 sản phẩm/trang)
                limit: limit, // Số lượng sản phẩm mỗi trang
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
    Product.findByIdAndDelete(productId)
        .then( ()=> {
            console.log('Destroyed product');
            res.redirect('/manage-products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.filterProducts = async (req, res) => {
    try {
        const queryConditions = [];
    
        if (req.query.category) {
            queryConditions.push({ category: req.query.category });
        }
    
        if (req.query.brand) {
            queryConditions.push({ brand: req.query.brand });
        }
    
        if (req.query.tags) {
            queryConditions.push({ tags: req.query.tags });
        }
    
        if (req.query.status) {
            queryConditions.push({ status: req.query.status });
        }
    
        if (req.query.search) {
            queryConditions.push({ title: { $regex: req.query.search, $options: 'i' } });
        }
    
        const finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};    

        let query = Product.find(finalQuery);
        const totalProducts = await Product.countDocuments(finalQuery);

        if (req.query.sort) {
            if (req.query.sort === 'DESC') {
                query = query.sort({ price: -1 });
            } else if (req.query.sort === 'ASC') {
                query = query.sort({ price: 1 });
            }
        }

        // Phân trang
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 2);
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Lấy sản phẩm và tổng số sản phẩm
        const [products] = await Promise.all([
            query
        ]);

        // Trả kết quả
        res.render("admin/manage-products", {
            prods: products,
            path: "/manage-products",
            currentPage: page,
            totalProducts: totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            limit: limit,
        });

    } catch (err) {
        console.error("Error filtering products:", {
            error: err.message,
            stack: err.stack,
        });
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi lọc sản phẩm.",
        });
    }
};