const mongodb = require('mongodb');
const getDb = require('../config/database').getDb;
class User {
    constructor(email, fullname, username, password, cart, id){
        this.email = email;
        this.fullname = fullname;
        this.username = username;
        this.password = password;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                console.log('User inserted:', result);
            })
            .catch(err => {
                console.log(err);
            })
    }
    

    static fetchAll(){
        const db = getDb();
        return db.collection('users')
            .find()
            .toArray()
            .then(users => {
                console.log(users);
                return users;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static findById(userId) {
        const db = getDb();
                return db.collection('users')
                    .find({ _id : new mongodb.ObjectId(userId)})
                    .next()
                    .then(user => {
                        
                        return user;
                    })
                    .catch(err => {
                        console.log(err);
                    })
    }
    getCart() {
        const db = getDb();
    
        // Kiểm tra nếu `this.cart.items` là mảng hợp lệ, nếu không thì khởi tạo là mảng rỗng
        const cartItems = Array.isArray(this.cart.items) ? this.cart.items : [];
    
        const productIds = cartItems.map(i => i.productId);
    
        return db.collection('products').find({_id : {$in: productIds}}).toArray()
            .then(products => {
                return products.map(p => {
                    // Lấy số lượng cho từng sản phẩm từ giỏ hàng
                    const cartItem = cartItems.find(i => i.productId.toString() === p._id.toString());
                    return {
                        ...p, 
                        quantity: cartItem ? cartItem.quantity : 0 // Nếu không tìm thấy thì số lượng là 0
                    };
                });
            })
            .catch(err => console.log(err));
    }


    addToCart(product) {
        // Kiểm tra nếu `this.cart.items` chưa được khởi tạo thì khởi tạo là mảng rỗng
        if (!Array.isArray(this.cart.items)) {
            this.cart.items = [];
        }
    
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
    
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
    
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity; // Cập nhật lại số lượng
        } else {
            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
        }
    
        const updatedCart = { items: updatedCartItems }; // Sửa tên trường từ `item` thành `items` cho đồng nhất
        const db = getDb();
    
        return db.collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } })
            .then(() => {
                console.log('Updated Cart');
            })
            .catch(err => console.log(err));
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        })
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: {items: updatedCartItems }} })
            .then(() => {
                console.log('Updated Cart');
            })
            .catch(err => console.log(err));
    }
    
}

module.exports = User;