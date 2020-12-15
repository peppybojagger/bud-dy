const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
    MongoClient.connect(
        'mongodb+srv://peppybojagger:ApolloMargot420@cluster0.d1sck.mongodb.net/myplants?retryWrites=true&w=majority'
    )
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        cb();
    })
    .catch(err => {
        console.log(err);
    });
}

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw 'No DB found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;