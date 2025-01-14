const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imgUrl: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String, required: false },
    brand: { type: String, required: false },
    tags: { type: [String], required: false },
    amount: { type: Number, required: true },
    status: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../config/database').getDb;

// class Product {
//     constructor(title, imgUrl, description, price, color, category, size, brand, tags, amount, id, userId) {
//         this.title = title;
//         this.imgUrl = imgUrl;
//         this.description = description;
//         this.price = price;
//         this.color = color;
//         this.category = category;
//         this.size = size;
//         this.brand = brand;
//         this.tags = tags;
//         this.amount = amount;
//         this.id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     // Save method
//     save() {
//         const db = getDb();
//         return db.collection('products')
//             .insertOne(this)
//             .then(result => {
//                 console.log('Product inserted:', result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     // Fetch all products
//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
//     static findById(prodId){
//         const db = getDb();
//         return db.collection('products')
//             .find({ _id : new mongodb.ObjectId(prodId)})
//             .next()
//             .then(product => {
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     // Update product by ID
//     static findByIdAndUpdate(prodId, updatedData) {
//         const db = getDb();
//         return db.collection('products')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(prodId) }, // Filter by product ID
//                 { $set: updatedData }                 // Update fields
//             )
//             .then(result => {
//                 console.log('Product updated:', result);
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
    
//     static deleteById(prodId){
//         const db = getDb();
//         return db.collection('products')
//             .deleteOne({_id: new mongodb.ObjectId(prodId)})
//             .then(result => {
//                 console.log('Deleted product!')
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = Product;
