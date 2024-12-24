const mongodb = require('mongodb');
const getDb = require('../config/database').getDb;
class Product {
    constructor(title, imgUrl, description, price, color, category, size, brand, tags, amount) {
        this.title = title;
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
        this.color = color;
        this.category = category;
        this.size = size;
        this.brand = brand;
        this.tags = tags;
        this.amount = amount;
    }

    // Save method
    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log('Product inserted:', result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Fetch all products
    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;
