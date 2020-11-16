const express = require('express');
const router = express.Router();

const plantData = require('./plant');

router.get('/account', (req, res, next) => {
    const plants = plantData.plants;
    res.render('account', {
        plants: plants,
        pageTitle: 'Account',
        path: '/account'
    });
});

module.exports = router;