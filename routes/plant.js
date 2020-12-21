const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const plantsController = require('../controllers/plant');


router.get('/plants', plantsController.getPlantsPage);

router.post('/plants', plantsController.postFindPlant);

router.get('/plant-details/:slug', plantsController.getPlantDetails);

router.get('/genus/:genus', plantsController.getGenus);

router.get('/account/home', isAuth, plantsController.getAccountPage);

router.post('/account/home', isAuth,  plantsController.postWaterAddDeletePlant);

router.post('/account/edit-plant', isAuth,  plantsController.postEditPlant);

router.get('/account/edit-plant/:_id', isAuth,  plantsController.getEditPlant);

module.exports = router;