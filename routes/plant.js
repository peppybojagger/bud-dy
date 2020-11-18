const express = require('express');
const router = express.Router();

const plantsController = require('../controllers/plant');

router.get('/plants', plantsController.getPlantsPage);

router.post('/account', plantsController.postAddPlant);

router.get('/account', plantsController.getPlants);

module.exports = router;