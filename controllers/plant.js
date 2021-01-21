const Plant = require('../models/plant');
const fetch = require('node-fetch');

async function getAPI(st, q, p) {
    const key = process.env.API_KEY;
    let urlAPI;
    let page;
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
        page = p;
        urlAPI = `https://trefle.io/api/v1/plants${key}&page=${page}`;
    }
    const response = await fetch(urlAPI);
	const json = await response.json();
    const plants = json;
    return plants;
 }
 
exports.getPlantsPage = (req, res, next) => {
    let page = req.query.page;
    if (!page) page = 1;
    let currentPage = req.url.split('=');
    currentPage = currentPage[1];
    getAPI('plants', null, page)
    .then(plants => {
        const plntCount = plants.meta.total;
        const perPage = 20;
        const pageCount = Math.ceil(plntCount / perPage);
        let curPage = parseInt(req.query.page) - 1;
        let pages = [];
        for (var i = 1; i <= pageCount; i++) {
            pages.push(i);
        }
        if (!curPage) {
            curPage = 0;
        }
        const end = curPage + 5;
        pages = pages.slice(curPage, end);
        const currentPage = pages[0];
        res.render('plants', {
            pageTitle: 'Plants',
            path: '/plants',
            plants: plants,
            pages: pages,
            pageCount: pageCount,
            currentPage: currentPage,
            noFoot: false,
            searching: false
        });
    });
};

exports.postFindPlant = (req, res) => {
    const q = req.body.searchPlant;
    getAPI('search', q, null).then(plants => {
        res.render('plants', {
			pageTitle: 'Plants',
			path: '/plants',
            plants: plants,
            noFoot: false,
            searching: true
	    });
    });
};

exports.getPlantDetails = (req, res, next) => {
    const q = req.params.slug;
    getAPI('details', q, null).then(plant => {
        res.render('plant-details', {
            plant: plant,
            pageTitle: plant.data.common_name,
            path: '/plants',
            noFoot: false
        });
    });
};

exports.getGenus = (req, res, next) => {
    const q = req.params.genus;
    getAPI('genus', q, null)
    .then(plants => {
        res.render('genus', {
            plants: plants,
            pageTitle: plants.data.genus,
            path: '/plants',
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
            const full = new Date();
            const year = full.getFullYear();
            const month = full.getMonth()+1;
            const day = full.getDate();
            const today = `${month}-${day}-${year}`;
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
            noFoot: false
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditPlant = (req, res, next) => {
    const updatedName = req.body.common_name;
    const updatedDate = req.body.watered;
    const dbId = req.body._id;
    let updatedImg;
    if (!req.file) {
        updatedImg = req.body.image_url;
    } else {
        updatedImg = req.file.location;
    }
    Plant.findById(dbId)
    .then(plant => {
        plant.image_url = updatedImg;
        plant.common_name = updatedName;
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