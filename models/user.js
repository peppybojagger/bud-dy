const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);


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