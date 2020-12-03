const express = require('express');
const router = express.Router();

const plantsController = require('../controllers/plant');

router.get('/plant-details/:plantID', plantsController.getPlantDetails);

router.get('/plants', plantsController.getPlantsPage);

// router.post('/plants', plantsController.postAddPlant);

router.post('/plants', plantsController.postFindPlant);

router.get('/account/home', plantsController.getAccountPage);

router.post('/account/home', plantsController.postMyPlant);

router.get('/account/edit-plant/:plantID', plantsController.getEditPage);

module.exports = router;