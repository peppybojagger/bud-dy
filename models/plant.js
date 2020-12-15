const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

module.exports = class Plant {
    constructor(common_name, scientific_name, image_url, slug, _id) {
        this.common_name = common_name;
        this.scientific_name = scientific_name;
        this.image_url = image_url;
        this.slug = slug;
        this._id = _id;
    }
    addMyPlant() {
        const db = getDB();
        let plnt;
        if (this._id) {
            plnt = db.collection('myplants').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {common_name: this.common_name, scientific_name: this.scientific_name, image_url: this.image_url, slug: this.slug}});
            console.log('Updated the Plant');
        } else {
            plnt = db.collection('myplants').insertOne(this);
        }
        return plnt
        .then(result => {
        })
        .catch(err => {
            console.log(err);
        });
    }
    static getMyPlants() {
        const db = getDB();
        return db.collection('myplants')
        .find().toArray()
        .then(plants => {
            return plants;
        }).catch(err => {
            console.log(err);
        });
    }
    static findById(dbId) {
        const db = getDB();
        return db.collection('myplants')
          .find({_id: new mongodb.ObjectId(dbId)})
          .next()
          .then(plant => {
            return plant;
          })
          .catch(err => {
            console.log(err);
          });
    }
}