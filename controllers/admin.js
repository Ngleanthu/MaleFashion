const Product = require('../models/products');
const User = require('../models/user');
const Order = require('../models/order');
exports.dashboard = (req, res, next) => {
    res.render('admin/dashboard', {path: 'admin/dashboard'});
}
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const description = req.bodyx.description;
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

exports.getAllUsers = (req, res, next) => {
    let page = req.query.page ? req.query.page : 1;
    let limit = 2; 

    User.find()
        .then(users => {
            res.render('admin/manage-users', {
                isAuthenticated: req.session.isLoggedIn,
                users: users.slice((page - 1) * limit, page * limit),
                path: '/manage-users',  // Truyền biến 'path' vào view
                currentPage: page, // Trang hiện tại
                totalProducts: users.length, // Tổng số sản phẩm
                totalPages: Math.ceil(users.length / limit), // Tổng số trang (2 sản phẩm/trang)
                limit: limit, // Số lượng sản phẩm mỗi trang
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching users');
        });
};
exports.getAllProducts = (req, res, next) => {
    let page = req.query.page ? req.query.page : 1;
    let limit = 2; 
    Product.find()  // Sử dụng phương thức fetchAll trong model Product
        .then(products => {
            res.render('admin/manage-products', {
                isAuthenticated: req.session.isLoggedIn,
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
        res.render('admin/edit-product', {
          product: product,
          path: `/manage-products/${product._id}`,
          isAuthenticated: req.session.isLoggedIn
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
        res.redirect('/admin/manage-products'); // Sau khi cập nhật xong, điều hướng về trang quản lý sản phẩm
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
            res.redirect('/admin/manage-products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.filterProducts = (req, res, next) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 2;
    let category = req.query.category || ''; // Lọc theo danh mục
    let brand = req.query.brand || ''; // Lọc theo thương hiệu
    let tags = req.query.tags || ''; // Lọc theo tag
    let status = req.query.status || ''; // Lọc theo trạng thái (active, inactive)
    let searchTerm = req.query.search || ''; // Từ khóa tìm kiếm
    let sortField = req.query.sortField || ''; // Sắp xếp theo trường nào (price, title...)
    let sortType = req.query.sortType || ''; // Sắp xếp theo thứ tự ASC hoặc DESC

    // Build search query
    let query = {};
    if (searchTerm) {
        query.title = { $regex: searchTerm, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (category) {
        query.category = category;
    }
    if (brand) {
        query.brand = brand;
    }
    if (tags) {
        query.tags = tags;
    }
    if (status) {
        query.status = status; // Trạng thái của sản phẩm
    }

    // Sorting
    let sort = {};
    if (sortField) {
        sort[sortField] = sortType === 'ASC' ? 1 : -1; // Sắp xếp theo thứ tự ASC hoặc DESC
    }

    Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)  // Bỏ qua số lượng kết quả từ các trang trước
        .limit(limit)  // Giới hạn số lượng kết quả mỗi trang
        .then(products => {
            Product.countDocuments(query)  // Đếm tổng số sản phẩm thỏa mãn filter
                .then(totalProducts => {
                    const totalPages = Math.ceil(totalProducts / limit); // Tổng số trang
                    res.render('admin/manage-products', {  // Trả về view
                        prods: products,
                        path: 'admin/manage-products',  // Truyền biến 'path' vào view
                        currentPage: page, // Trang hiện tại
                        totalProducts: totalProducts, // Tổng số sản phẩm
                        totalPages: totalPages, // Tổng số trang
                        limit: limit, // Số lượng sản phẩm mỗi trang
                        category: category,
                        brand: brand,
                        tags: tags,
                        status: status,
                        searchTerm: searchTerm,
                        sortField: sortField,
                        sortType: sortType
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error counting products');
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching products');
        });
};


exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + order.products.reduce((prodSum, item) => {
                return prodSum + (item.product.price * item.quantity);
            }, 0);
        }, 0);
        
        res.render('admin/dashboard', {
            path: 'admin/dashboard',
            totalUsers,
            totalOrders,
            totalRevenue,
            revenueIncrease: 10,  // Giả sử tăng 10%
            userIncrease: 5,      // Giả sử tăng 5%
            orderIncrease: 2      // Giả sử tăng 2%
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching dashboard data');
    }
};

exports.getRevenueReport = async (req, res) => {
    try {
        const { range } = req.query; // day, week, month
        let startDate;

        switch (range) {
            case 'day':
                startDate = new Date(new Date().setDate(new Date().getDate() - 1));
                break;
            case 'week':
                startDate = new Date(new Date().setDate(new Date().getDate() - 7));
                break;
            case 'month':
                startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
                break;
            default:
                startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        }

        const orders = await Order.find({ createdAt: { $lte: startDate } });
        const revenueData = orders.map(order => ({
            date: order.createdAt.split(' ')[1],
            amount: order.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }));

        res.json(revenueData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching revenue report');
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const { range } = req.query; // day, week, month
        let startDate;

        switch (range) {
            case 'day':
                startDate = new Date(new Date().setDate(new Date().getDate() - 1));
                break;
            case 'week':
                startDate = new Date(new Date().setDate(new Date().getDate() - 7));
                break;
            case 'month':
                startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
                break;
            default:
                startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        }

        const orders = await Order.find({ createdAt: { $lte: startDate } });
        const productSales = {};

        orders.forEach(order => {
            order.products.forEach(item => {
                const productName = item.product.name;
                const revenue = item.product.price * item.quantity;
                productSales[productName] = (productSales[productName] || 0) + revenue;
            });
        });

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, revenue]) => ({ name, revenue }));

        res.json(topProducts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching top products');
    }
};


exports.filterAccountByAdmin = (req, res, next) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage) : 2;
    let searchField = req.query.searchField || ''; // Tìm kiếm theo trường nào (username, email...)
    let searchTerm = req.query.searchTerm || ''; // Từ khóa tìm kiếm
    let filterRole = req.query.filterRole || ''; // Lọc theo vai trò
    let sortField = req.query.sortField || ''; // Sắp xếp theo trường nào (username, email...)
    let sortType = req.query.sortType || ''; // Sắp xếp theo thứ tự ASC hoặc DESC
    let filterStatus = req.query.filterStatus || ''; // Lọc theo trạng thái (active, inactive)

    // Build search query
    let query = {};
    if (searchField && searchTerm) {
        query[searchField] = { $regex: searchTerm, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa, chữ thường
    }
    if (filterRole) {
        query.role = filterRole;
    }
    if (filterStatus) {
        query.status = filterStatus; // Chuyển đổi thành boolean
    }

    // Sorting
    let sort = {};
    if (sortField) {
        sort[sortField] = sortType === 'ASC' ? 1 : -1; // Sắp xếp theo thứ tự ASC hoặc DESC
    }

    User.find(query)
        .sort(sort)
        .skip((page - 1) * limit)  // Bỏ qua số lượng kết quả từ các trang trước
        .limit(limit)  // Giới hạn số lượng kết quả mỗi trang
        .then(users => {
            User.countDocuments(query)  // Đếm tổng số người dùng thỏa mãn filter
                .then(totalUsers => {
                    const totalPages = Math.ceil(totalUsers / limit); // Tổng số trang
                    res.render('admin/manage-users', {  // Trả về view
                        isAuthenticated: req.session.isLoggedIn,
                        users: users,
                        path: '/manage-users',  // Truyền biến 'path' vào view
                        currentPage: page, // Trang hiện tại
                        totalUsers: totalUsers, // Tổng số người dùng
                        totalPages: totalPages, // Tổng số trang
                        limit: limit, // Số lượng người dùng mỗi trang
                        searchField: searchField,
                        searchTerm: searchTerm,
                        filterRole: filterRole,
                        sortField: sortField,
                        sortType: sortType,
                        filterStatus: filterStatus
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error counting users');
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching users');
        });
};