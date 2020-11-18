const fs = require('fs');
const path = require('path');

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
    constructor(plantName) {
        this.plantName = plantName;
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
}