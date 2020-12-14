// const fs = require('fs');
// const path = require('path');
const mongoConnect = require('../util/database');

// const dataPath = path.join(
//     path.dirname(require.main.filename),
//     'data',
//     'plants.json'
// );

// const getPlantsFile = (cb) => {
//     fs.readFile(dataPath, (err, fileContent) => {
//         if (err) {
//             return cb([]);
//         }
//         cb(JSON.parse(fileContent));
//     });
// };

module.exports = class Plant {
    constructor(id, common_name, scientific_name, image_url, slug) {
        this.id = id;
        this.common_name = common_name;
        this.scientific_name = scientific_name;
        this.image_url = image_url;
        this.slug = slug;
    }
    save() {

    }




    // addMyPlant() {
    //     getPlantsFile(plants => {
    //         if (this.id) {
    //             const existingPlants = plants.findIndex(plnt => plnt.id === this.id);
    //             const updatedPlants = [...plants];
    //             updatedPlants[existingPlants] = this;
    //             fs.writeFile(dataPath, JSON.stringify(updatedPlants), (err) => {
    //                 console.log(err);
    //             });
    //         } else {
    //             this.id = Math.floor(Math.random() * 10001).toString();
    //             plants.push(this);
    //             fs.writeFile(dataPath, JSON.stringify(plants), (err) => {
    //                 console.log(err);
    //             });
    //         }
    //     });
    // }
    // static deleteMyPlant(id) {
    //     getPlantsFile(plants => {
    //         const updatedPlants = plants.filter(plnt => plnt.id !== id);
    //         fs.writeFile(dataPath, JSON.stringify(updatedPlants), (err) => {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //         });
    //     });
    // }
    // static getMyPlants(cb) {
    //     getPlantsFile(cb);
    // }
    // static findById(id, cb) {
    //     getPlantsFile(plants => {
    //       const plant = plants.find(p => p.id === id);
    //       cb(plant);
    //     });
    //   }
}