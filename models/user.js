// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;
// const ObjectId = mongodb.ObjectId;

// module.exports = class User {
//     constructor(username, email) {
//         this.name = username;
//         this.email = email;
//     }
//     saveUser() {
//         const db = getDB();
//         return db.collection('users').insertOne(this);
//     }
//     static findUserbyId(userId) {
//         const db = getDB();
//         return db.collection('users').findOne({_id: new ObjectId(userId)})
//     }
// }