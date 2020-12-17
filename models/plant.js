const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSchema = new Schema({
        common_name: {
            type: String,
            required: true
        },
        scientific_name: {
            type: String
        },
        genus: {
            type: String
        },
        family: {
            type: String
        },
        image_url: {
            type: String,
            required: true
        },
        slug: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
});

module.exports = mongoose.model('Plant', plantSchema);