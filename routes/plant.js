const express = require('express');
const router = express.Router();
const path = require('path');

const plants = [];

router.get('/plants', (req, res, next) => {
    res.render('plants', {
        pageTitle: 'Plants',
        path: '/plants',
        hasPlants: plants.length > 0
    });
});

router.post('/account', (req, res, next) => {
    plants.push({plantName: req.body.plantName});
    res.redirect('back');
});

exports.routes = router;
exports.plants = plants;