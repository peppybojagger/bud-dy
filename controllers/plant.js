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
        console.log(urlAPI);
    }
    const response = await fetch(urlAPI);
	const json = await response.json();
    const data = json.data;
    return data;
 }
  
exports.getPlantsPage = (req, res, next) => {
    getAPI().then(data => {
        res.render('plants', {
            pageTitle: 'Plants',
            path: '/plants',
            data: data
        });
    });
};

exports.postFindPlant = (req, res) => {
    const q = req.body.searchPlant;
    getAPI('search', q).then(data => {
        res.render('plants', {
			pageTitle: 'Plants',
			path: '/plants',
			data: data
	    });
    });
};

exports.getPlantDetails = (req, res, next) => {
    const q = req.params.slug;
    getAPI('details', q).then(data => {
        res.render('plant-details', {
            data: data,
            pageTitle: 'Details',
            path: '/plants'
        });
    });
};

exports.getAccountPage = (req, res, next) => {
    Plant.getMyPlants(plants => {
        res.render('account/home', {
            pageTitle: 'Account',
            path: '/account',
            plants: plants
        });
    });
};

exports.postAddDeletePlant = (req, res, next) => {
    const deleteMode = req.query.delete;
    const id = req.body.id;
    if (deleteMode) {
        Plant.deleteMyPlant(id);
    } else {
        const common_name = req.body.common_name;
        const scientific_name = req.body.scientific_name;
        const image_url = req.body.image_url;
        const slug = req.body.slug;
        let plants = new Plant(id, common_name, scientific_name, image_url, slug);
        plants.addMyPlant();
    }
    res.redirect('home');
};

exports.getEditPlant = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log('Not Edit Mode');
    }
    const id = req.params.id;
    Plant.findById(id, plant => {
        if (!plant) {
            console.log('error: no plant')
        }
        res.render('account/edit-plant', {
            pageTitle: 'Edit Plant',
            path: '/account',
            plant: plant,
            edit: editMode
        });
    });
};

exports.postEditPlant = (req, res, next) => {
    const id = req.body.id;
    const updatedName = req.body.common_name;
    const scientific_name = req.body.scientific_name;
    const updatedImg = req.body.image_url;
    const slug = req.body.slug;
    const updatedPlant = new Plant(id, updatedName, scientific_name, updatedImg, slug);
    updatedPlant.save();
    res.redirect('home');
};