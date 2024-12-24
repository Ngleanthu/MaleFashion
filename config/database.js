const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db;
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(client => {
        console.log('Connected');
        _db = client.db('fashion')
        callback();
    }).catch(err => {
        console.log(err);
        throw err
    });

}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found'
}


exports.getDb = getDb;
exports.mongoConnect = mongoConnect;