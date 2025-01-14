const Product = require("../models/products");
const Order = require("../models/order");
exports.getAllProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("user/shop", {
                prods: products,
                path: "/shop",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                console.log("Product not found");
                return res.status(404).render("user/shop-details", {
                    message: "Sản phẩm không tồn tại.",
                    path: "/shop",
                });
            }

            res.render("user/shop-details", {
                product: product,
                path: `/shop/${product._id}`,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log("Error:", err);
            res.status(500).render("user/shop-details", {
                message: "Đã xảy ra lỗi khi tải sản phẩm.",
                path: "/shop",
            });
        });
};

exports.getIndex = (req, res, next) => {
    Product.find().then((products) => {
        res.render("user/shop", {
            prods: products,
            path: "/shop",
            isAuthenticated: req.session.isLoggedIn
        });
    });
};
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/shopping-cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items;
            res.render("user/shopping-cart", {
                path: "/shopping-cart",
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .removeFromCart(prodId)
    .then(() => {
        res.redirect("/shopping-cart");
    })
    .catch((err) => {
        console.log(err);
    });

};

exports.getCheckoutProduct = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items;
            res.render("user/checkout", {
                path: "/checkout",
                products: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postCartUpdate = (req, res, next) => {
    console.log(req.body); // Xem toàn bộ nội dung request body

    const updatedItems = req.body.items;

    // Kiểm tra xem updatedItems có tồn tại và là mảng không
    if (!Array.isArray(updatedItems)) {
        console.log("Items are not valid or missing.");
        return res.status(400).send("Invalid or missing items.");
    }

    console.log(updatedItems + "day");

    // Tiến hành xử lý các sản phẩm trong giỏ hàng
    Promise.all(
        updatedItems.map((item) => {
            if (item.quantity > 0) {
                // Cập nhật số lượng sản phẩm
                console.log("Cập nhật sản phẩm");
                // return req.session.user.updateCartItem(item.id, item.quantity);
            } else {
                // Xóa sản phẩm khỏi giỏ hàng
                console.log("Xóa sản phẩm");
                // return req.user.deleteItemFromCart(item.id);
            }
        })
    )
        .then(() => {
            res.redirect("/shopping-cart");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error processing cart update");
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc}};
            });            
            const order = new Order({
                user: {
                    name: req.user.username,
                    userId: req.user
                },
                products: products,
                createdAt: new Date().toLocaleString('vi-VN'), // Thêm ngày tạo
                status: 'Đang xác nhận' // Thêm trạng thái
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/order");
        })  
        .catch((err) => {
            console.log(err);   
        });
};

exports.getOrder = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/signin'); 
    }
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render("user/order", {
                path: "/order",
                orders: orders,
                user: req.user ,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error fetching orders.");
        });
};

exports.getOrderDetails = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findOne({ _id: orderId, "user.userId": req.user._id})
        .then((order) => {
            if (!order) {
                res.redirect("user/order");
            }
            res.render("user/order-details", {
                user: req.user,
                order: order,
                path: `/order/${order._id}`,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch((err) => {
            console.log(err);
            res.redirect("user/order");
        });
};
