const Plant = require('../models/plant');
const Account = require('../models/account');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const key = process.env.API_KEY;

exports.getPlantsPage = async (req, res, next) => {
    const urlAPI = `https://trefle.io/api/v1/plants${key}`;
    const response = await fetch(urlAPI);
	const json = await response.json();
	const data = json.data;
    res.render('plants', {
        pageTitle: 'Plants',
        path: '/plants',
        data: data
    });
};

exports.postFindPlant = async (req, res) => {
	const plantName = req.body.searchPlant;
	const urlAPI = `https://trefle.io/api/v1/plants/search${key}&q=${plantName}`;
	const response = await fetch(urlAPI);
	const json = await response.json();
    const data = json.data;
    for(var i=0; i < data.length; i++) {
        const common_name = data[i].common_name;
        const image_url = data[i].image_url;
        const scientific_name = data[i].scientific_name;
        const id = data[i].id;
        const slug = data[i].slug;
        const plant = new Plant(common_name, image_url, scientific_name, id, slug);
        plant.save();
    }
	res.render('plants', {
			pageTitle: 'Plants',
			path: '/plants',
			data: data
	});
};

exports.getPlantDetails = async (req, res, next) => {
    const slug = Plant.fetchSlug();
    // console.log('Returned: ' + returned);
    // let slug = returned;
    console.log('Slug: ' + slug);
	const urlAPI = `https://trefle.io/api/v1/plants/${slug}${key}`;
	const response = await fetch(urlAPI);
	const json = await response.json();
	const plant = json.data;
        res.render('plant-details', {
            plant: plant,
            pageTitle: 'Details',
            path: '/plants'
        });
};

exports.getAccountPage = (req, res, next) => {
    res.render('account/home', {
        pageTitle: 'Account',
        path: '/account'
    });
};

exports.postAddPlant = (req, res, next) => {
    const common_name = req.body.plantName;
    const image_url = req.body.imgURL;
    const scientific_name = req.body.desc;
    const plant = new Plant(common_name, image_url, scientific_name, id, slug);
    plant.save();
    res.redirect('back');
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