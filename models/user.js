const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
    status: {
        type: Number,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

userSchema.methods.addToCart = function (product) {
    if (!Array.isArray(this.cart.items)) {
        this.cart.items = [];
    }

    const cartProductIndex = this.cart.items.findIndex((cp) => {
        // Kiểm tra cp.productId và product._id có tồn tại không trước khi gọi toString()
        if (cp.productId && product._id) {
            return cp.productId.toString() === product._id.toString();
        }
        return false;
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity; // Cập nhật lại số lượng
    } else {
        updatedCartItems.push({ productId: product._id, quantity: 1 });
    }

    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;

    return this.save();
};
userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save(); // Gọi save() để lưu và trả về Promise
};

userSchema.methods.clearCart = function() {
    this.cart = { item: [] };
    return this.save();
};
module.exports = mongoose.model("User", userSchema);
// class User {
//     constructor(email, fullname, username, password, cart, id){
//         this.email = email;
//         this.fullname = fullname;
//         this.username = username;
//         this.password = password;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users')
//             .insertOne(this)
//             .then(result => {
//                 console.log('User inserted:', result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchAll(){
//         const db = getDb();
//         return db.collection('users')
//             .find()
//             .toArray()
//             .then(users => {
//                 return users;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static findById(userId) {
//         const db = getDb();
//                 return db.collection('users')
//                     .find({ _id : new mongodb.ObjectId(userId)})
//                     .next()
//                     .then(user => {
//                         return user;
//                     })
//                     .catch(err => {
//                         console.log(err);
//                     })
//     }
//     getCart() {
// const db = getDb();

// // Kiểm tra nếu `this.cart.items` là mảng hợp lệ, nếu không thì khởi tạo là mảng rỗng
// const cartItems = Array.isArray(this.cart.items) ? this.cart.items : [];

// const productIds = cartItems.map(i => i.productId);

// return db.collection('products').find({_id : {$in: productIds}}).toArray()
//     .then(products => {
//         return products.map(p => {
//             // Lấy số lượng cho từng sản phẩm từ giỏ hàng
//             const cartItem = cartItems.find(i => i.productId.toString() === p._id.toString());
//             return {
//                 ...p,
//                 quantity: cartItem ? cartItem.quantity : 0 // Nếu không tìm thấy thì số lượng là 0
//             };
//         });
//     })
//     .catch(err => console.log(err));
//     }

// addToCart(product) {
//     // Kiểm tra nếu `this.cart.items` chưa được khởi tạo thì khởi tạo là mảng rỗng
//     if (!Array.isArray(this.cart.items)) {
//         this.cart.items = [];
//     }

//     const cartProductIndex = this.cart.items.findIndex(cp => {
//         // Kiểm tra cp.productId và product._id có tồn tại không trước khi gọi toString()
//         if (cp.productId && product._id) {
//             return cp.productId.toString() === product._id.toString();
//         }
//         return false;
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//         updatedCartItems[cartProductIndex].quantity = newQuantity; // Cập nhật lại số lượng
//     } else {
//         updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
//     }

//     const updatedCart = { items: updatedCartItems }; // Sửa tên trường từ `item` thành `items` cho đồng nhất
//     const db = getDb();

//     return db.collection('users')
//         .updateOne({ _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: updatedCart } })
//         .then(() => {
//             // console.log('Updated Cart');
//         })
//         .catch(err => console.log(err));
// }

//     deleteItemFromCart(productId) {
// const updatedCartItems = this.cart.items.filter(item => {
//     return item.productId.toString() !== productId.toString();
// })
//         const db = getDb();
//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: {items: updatedCartItems }} })
//             .then(() => {
//                 // console.log('Updated Cart');
//             })
//             .catch(err => console.log(err));
//     }

//     updateCartItem(productId, quantity) {
//         const updatedCartItems = [...this.cart.items]; // Tạo bản sao danh sách items hiện tại
//         const cartItemIndex = updatedCartItems.findIndex(item =>
//             item.productId.toString() === productId.toString()
//         );

//         if (cartItemIndex >= 0) {
//             // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
//             updatedCartItems[cartItemIndex].quantity = quantity;
//         } else {
//             // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(productId),
//                 quantity: quantity
//             });
//         }

//         // Lưu lại giỏ hàng đã cập nhật
//         const db = getDb();
//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             )
//             .then(() => {
//                 // console.log('Cart updated successfully');
//             })
//             .catch(err => console.log(err));
//     }

    // addOrder(){
    //     const db = getDb();
    //     return this.getCart().then(products => {
    //         const order = {
    //             items: products,
    //             user: {
    //                 _id: new mongodb.ObjectId(this._id),
    //                 fullname: this.fullname,
    //                 email: this.email
    //             },
    //             createdAt: (new Date()).toLocaleString('vi-VN'),
    //             status: "Đang xác nhận"
    //         }
    //         return db.collection('orders')
    //             .insertOne(order)
    //     }).then(result => {
    //             this.cart = {items: []};
    //             return db
    //                 .collection('users')
    //                 .updateOne(
    //                     { _id: new mongodb.ObjectId(this._id) },
    //                     { $set: { cart: { items: [] } } }
    //                 );
    //         })
    //         .catch(err => console.log(err));
    // }

//     getOrderDetails(orderId) {
//         const db = getDb();
//         return db.collection('orders').findOne({'_id': new mongodb.ObjectId(orderId), 'user._id': new mongodb.ObjectId(this._id)});
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray();
//       }

// }

// module.exports = User;
