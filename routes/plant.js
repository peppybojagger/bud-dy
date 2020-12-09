const express = require('express');
const router = express.Router();

const plantsController = require('../controllers/plant');


router.get('/plants', plantsController.getPlantsPage);

router.post('/plants', plantsController.postFindPlant);

router.get('/plant-details/:slug', plantsController.getPlantDetails);

router.get('/account/home', plantsController.getAccountPage);

router.post('/account/home', plantsController.postAddPlant);

router.post('/account/home', plantsController.postMyPlant);

router.get('/account/edit-plant/:plantID', plantsController.getEditPage);

module.exports = router;