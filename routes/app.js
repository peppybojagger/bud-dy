const express = require('express');
const router = express.Router();

const appController = require('../controllers/app');

router.get('/', appController.getIndex);

router.use(appController.get404Page);

module.exports = router;