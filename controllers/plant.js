const Plant = require('../models/plant');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function getAPI(st, q) {
    const key = process.env.API_KEY;
    let urlAPI;
    const page = 1;
    if (st === 'search') {
        const plantName = q;
        urlAPI = `https://trefle.io/api/v1/plants/search${key}&q=${plantName}&page=${page}`;
    } else if (st === 'details') {
        const slug = q;
        urlAPI = `https://trefle.io/api/v1/plants/${slug}${key}`;
    } else {
        urlAPI = `https://trefle.io/api/v1/plants${key}&page=${page}`;
    }
    const response = await fetch(urlAPI);
	const json = await response.json();
    const plants = json.data;
    return plants;
 }
  
exports.getPlantsPage = (req, res, next) => {
    getAPI().then(plants => {
        res.render('plants', {
            pageTitle: 'Plants',
            path: '/plants',
            plants: plants
        });
    });
};

exports.postFindPlant = (req, res) => {
    const q = req.body.searchPlant;
    getAPI('search', q).then(plants => {
        res.render('plants', {
			pageTitle: 'Plants',
			path: '/plants',
			plants: plants
	    });
    });
};

exports.getPlantDetails = (req, res, next) => {
    const q = req.params.slug;
    getAPI('details', q).then(plants => {
        res.render('plant-details', {
            plants: plants,
            pageTitle: plants.common_name,
            path: '/plants'
        });
    });
};

exports.getAccountPage = (req, res, next) => {
    Plant.getMyPlants().then(plants => {
        res.render('account/home', {
			pageTitle: 'Plants',
			path: '/account',
			plants: plants
	    });
    }).catch(err => {
        console.log(err);
    });
};

exports.postAddDeletePlant = (req, res, next) => {
    const deleteMode = req.query.delete;
    if (deleteMode) {
        const dbId = req.body._id;
        Plant.deletePlant(dbId)
        .then(() => {
            res.redirect('home');
        }).catch(err => {
            console.log(err);
        });
    } else {
        const common_name = req.body.common_name;
        const scientific_name = req.body.scientific_name;
        const image_url = req.body.image_url;
        const slug = req.body.slug;
        const plant = new Plant(common_name, scientific_name, image_url, slug, null, req.user._id);
        plant.addMyPlant()
        .then(() => {
            res.redirect('home');
        }).catch(err => {
            console.log(err);
        });
    }
};

exports.getEditPlant = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log('Not Edit Mode');
    }
    const dbId = req.params._id;
    Plant.findById(dbId)
    .then(plant => {
        if (!plant) {
            console.log('NO PLANT TO EDIT');
            res.redirect('back');
        }
        res.render('account/edit-plant', {
            pageTitle: 'Edit Plant',
            path: '/account',
            plant: plant,
            edit: editMode
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditPlant = (req, res, next) => {
    const updatedName = req.body.common_name;
    const scientific_name = req.body.scientific_name;
    const updatedImg = req.body.image_url;
    const slug = req.body.slug;
    const id = req.body._id;
    const updatedPlant = new Plant(updatedName, scientific_name, updatedImg, slug, id);
    updatedPlant.addMyPlant().then(plants => {
        res.redirect('home');
    }).catch(err => {
        console.log(err);
    });
};