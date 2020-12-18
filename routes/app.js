const express = require('express');
const router = express.Router();

const appController = require('../controllers/app');

router.get('/', appController.getIndex);

router.post('/', appController.postLoginLogout);

router.get('/signup', appController.getSignup);

router.post('/signup', appController.postSignup);

router.use(appController.get404Page);

module.exports = router;