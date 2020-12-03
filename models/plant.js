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

module.exports = class Plant {
    constructor(common_name, image_url, scientific_name, id) {
        this.common_name = common_name;
        this.image_url = image_url;
        this.scientific_name = scientific_name;
        this.id = id;
    }
    save() {
        getPlantsFile(plants => {
            plants.push(this);
            fs.writeFile(dataPath, JSON.stringify(plants), (err) => {
                console.log(err);
            });
        });
    }
    static fetchAll(cb) {
        getPlantsFile(cb);
    }
    static findById(id, cb) {
        getPlantsFile(plants => {
            const plant = plants.find(p => p.id === id);
            cb(plant);
        });
    }
}