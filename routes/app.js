const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', {
        pageTitle: 'Bud-dy',
        path: '/'
    });
});

router.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404',
    });
});

module.exports = router;