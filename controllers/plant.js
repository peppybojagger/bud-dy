const Plant = require('../models/plant');

exports.getPlantsPage = (req, res, next) => {
    res.render('plants', {
        pageTitle: 'Plants',
        path: '/plants'
    });
};

exports.postAddPlant = (req, res, next) => {
    const plant = new Plant(req.body.plantName);
    plant.save();
    res.redirect('back');
};

exports.getPlants = (req, res, next) => {
    Plant.fetchAll((plants) => {
        res.render('account', {
            plants: plants,
            pageTitle: 'Account',
            path: '/account',
            hasPlants: plants.length > 0
        });
    });
};