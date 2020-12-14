const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = cb => {
    MongoClient.connect(
        'mongodb+srv://peppybojagger:ApolloMargot420@cluster0.d1sck.mongodb.net/<dbname>?retryWrites=true&w=majority'
    )
    .then(client => {
        console.log('Connected!');
        cb(client)
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = mongoConnect;