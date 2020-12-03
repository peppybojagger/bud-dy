const fs = require('fs');
const path = require('path');

const dataPath = path.join(
    path.dirname(require.main.filename),
    'data',
    'account.json'
);

module.exports = class Account {
    static addPlant(id) {
        //fetch current account
        fs.readFile(dataPath, (err, fileContent) => {
            let acct = {plants: [], lastWatered: 0};
            if (!err) {
                acct = JSON.parse(fileContent);
            }
            //analyze account => find existing
            const existingPlantsIndex = acct.plants.findIndex(
                plant => plant.id === id
            );
            const existingPlants = acct.plants[existingPlantsIndex];
            let updatedPlants;
            //add new
            if (existingPlants) {
                updatedPlants = { ...existingPlants };
                acct.plants = [...acct.plants];
                acct.plants[existingPlantsIndex] = updatedPlants;
            } else {
                updatedPlants = { id: id, lastWatered: 0 };
                acct.plants = [...acct.plants, updatedPlants];
            }
            fs.writeFile(dataPath, JSON.stringify(acct), err => {
                console.log(err);
            });
        });
    }
};