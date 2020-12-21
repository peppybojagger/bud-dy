const Plant = require('../models/plant');
const fetch = require('node-fetch');
const path = require('path');
const plant = require('../models/plant');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function getAPI(st, q) {
    const key = process.env.API_KEY;
    let urlAPI;
    if (st === 'search') {
        const plantName = q;
        urlAPI = `https://trefle.io/api/v1/plants/search${key}&q=${plantName}`;
    } else if (st === 'details') {
        const slug = q;
        urlAPI = `https://trefle.io/api/v1/plants/${slug}${key}`;
    } else if (st === 'genus') {
        const genus = q;
        urlAPI = `https://trefle.io/api/v1/genus/${genus}/plants${key}`;
    } else {
        urlAPI = `https://trefle.io/api/v1/plants${key}`;
    }
    const response = await fetch(urlAPI);
	const json = await response.json();
    const plants = json;
    return plants;
 }
  
exports.getPlantsPage = (req, res, next) => {
    getAPI().then(plants => {
        res.render('plants', {
            pageTitle: 'Plants',
            path: '/plants',
            plants: plants,
            isAuth: req.session.isLoggedIn,
            noFoot: false
        });
    });
};

exports.postFindPlant = (req, res) => {
    const q = req.body.searchPlant;
    getAPI('search', q).then(plants => {
        res.render('plants', {
			pageTitle: 'Plants',
			path: '/plants',
			plants: plants,
            isAuth: req.session.isLoggedIn,
            noFoot: false
	    });
    });
};

exports.getPlantDetails = (req, res, next) => {
    const q = req.params.slug;
    getAPI('details', q).then(plant => {
        res.render('plant-details', {
            plant: plant,
            pageTitle: plant.data.common_name,
            path: '/plants',
            isAuth: req.session.isLoggedIn,
            noFoot: false
        });
        // var modal = req.body.imgModal;
        // console.log(modal);
        // var img = req.body.plant_parts;
        // console.log(img);
        // var modalImg = req.body.img_l;
        // console.log(modalImg);
        // img.onclick = function(){
        //     console.log('click');
        //     modal.style.display = "block";
        //     modalImg.src = this.src;
        // }
        // var span = req.body.close;
        // span.onclick = function() {
        //     modal.style.display = "none";
        // }
    });
};

exports.getGenus = (req, res, next) => {
    const q = req.params.genus;
    getAPI('genus', q)
    .then(plants => {
        res.render('genus', {
            plants: plants,
            pageTitle: plants.data.genus,
            path: '/plants',
            isAuth: req.session.isLoggedIn,
            noFoot: false
        });
    });
};

exports.getAccountPage = (req, res, next) => {
    const userId = req.user._id;
    const user = req.user;
    Plant.find({ userId: userId })
    .then(plants => {
        res => console.log(res);
        res.render('account/home', {
            pageTitle: 'Plants',
            path: '/account',
            plants: plants,
            isAuth: req.session.isLoggedIn,
            noFoot: false,
            user: user
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postWaterAddDeletePlant = (req, res, next) => {
    const deleteMode = req.query.delete;
    const water = req.query.water;
    if (deleteMode) {
        const dbId = req.body._id;
        Plant.findByIdAndRemove(dbId)
        .then(() => {
            res.redirect('home');
        }).catch(err => {
            console.log(err);
        });
    } else if (water) {
        const dbId = req.body._id;
        Plant.findById(dbId)
        .then(plant => {
            var full = new Date();
            var year = full.getFullYear();
            var month = full.getMonth()+1;
            var day = full.getDate();
            var today = `${year}-${month}-${day}`;
            plant.lastWatered = today.toString();
            return plant.save();
        }).then(result => {
            res.redirect('home');
        }).catch(err => {
            console.log(err);
        });
    } else {
        const common_name = req.body.common_name;
        const scientific_name = req.body.scientific_name;
        const genus = req.body.genus;
        const family = req.body.family;
        const image_url = req.body.image_url;
        const slug = req.body.slug;
        const plant = new Plant({
            common_name: common_name, 
            scientific_name: scientific_name, 
            genus: genus, 
            family: family, 
            image_url: image_url, 
            slug: slug,
            userId: req.user._id
        });
        plant.save()
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
            edit: editMode,
            isAuth: req.session.isLoggedIn,
            noFoot: false
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditPlant = (req, res, next) => {
    const updatedName = req.body.common_name;
    const updatedImg = req.body.image_url;
    const updatedDate = req.body.watered;
    const dbId = req.body._id;
    Plant.findById(dbId)
    .then(plant => {
        plant.common_name = updatedName;
        plant.image_url = updatedImg;
        plant.lastWatered = updatedDate;
        return plant.save();
    })
    .then(result => {
        res.redirect('home');
    })
    .catch(err => {
        console.log(err);
    });
};