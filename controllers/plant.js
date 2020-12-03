const Plant = require('../models/plant');
const Account = require('../models/account');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

exports.getPlantsPage = (req, res, next) => {
    Plant.fetchAll(plants => {
        res.render('plants', {
          plants: plants,
          pageTitle: 'Plants',
          path: '/plants',
          hasPlants: plants.length > 0
        });
    });
};

// exports.postAddPlant = (req, res, next) => {
//     const common_name = req.body.plantName;
//     const image_url = req.body.imgURL;
//     const scientific_name = req.body.desc;
//     const plant = new Plant(common_name, image_url, scientific_name);
//     plant.save();
//     res.redirect('back');
// };

exports.postFindPlant = async (req, res) => {
    const plantName = req.body.searchPlant;
    const key = process.env.API_KEY;
    const urlAPI = `https://trefle.io/api/v1/plants/search?token=${key}&q=${plantName}`;
    try {
        const response = await fetch(urlAPI);
        const data = await response.json();
        if (data.meta.total === 0) {
            console.log('nada');
        } else {
            console.log(data);
            const common_name = data.common_name;
            const image_url = data.image_url;
            const scientific_name = data.scientific_name;
            const id = data.id;
            const plant = new Plant(common_name, image_url, scientific_name, id);
            plant.save();
            res.redirect('back');
        }
    } catch (err) {
        console.log(err);
    }
};

exports.getPlantDetails = (req, res, next) => {
    const pID = req.params.plantID;
    Plant.findById(pID, plant => {
        res.render('plant-details', {
            plant: plant,
            pageTitle: plant.plantName,
            path: '/plants'
        });
    });
};

exports.getAccountPage = (req, res, next) => {
    res.render('account/home', {
        pageTitle: 'Account',
        path: '/account'
    });
};

exports.postMyPlant = (req, res, next) => {
    const pID = req.body.plantID;
    Plant.findById(pID, (plants) => {
        Account.addPlant(pID, plants.lastWatered)
    });
    res.redirect('/account/home');
};

exports.getEditPage = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const plantID = req.params.plantID;
    Plant.findById(plantID, plant => {
        if (!plant) {
            return res.redirect('/');
        }
        res.render('account/edit-plant', {
            pageTitle: 'Edit Plant',
            path: '/account',
            editing: editMode,
            plant: plant
        });
    });
};

exports.postEditPlant = (req, res, next) => {

};