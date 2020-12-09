const fs = require('fs');
const path = require('path');
//const fetch = require('node-fetch');

const dataPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'plants.json'
);

const getPlantsFile = (cb) => {
    fs.readFile(dataPath, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        cb(JSON.parse(fileContent));
    });
};

const plants = [];

module.exports = class Plant {
    constructor(common_name, image_url, scientific_name, id, slug) {
        this.common_name = common_name;
        this.image_url = image_url;
        this.scientific_name = scientific_name;
        this.id = id;
        this.slug = slug;
    }
    save() {
        plants.push(this);
    }
    static fetchSlug() {
        if (plants) {
            for(var i=0; i < plants.length; i++) {
                const slug = plants[i].slug;
                return slug;
            }
        } else {
            console.log('No Plants');
        }
    }
}