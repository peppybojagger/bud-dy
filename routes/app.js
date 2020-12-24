const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const appController = require('../controllers/app');

const User = require('../models/user');

router.get('/', appController.getIndex);

router.post('/', appController.postLoginLogout);

router.get('/signup', appController.getSignup);

router.post('/signup', 
check('email').isEmail().withMessage('Please enter a valid E-mail.')
.normalizeEmail()
.custom((value, { req }) => {
    return User.findOne({email: value})
    .then(userEmail => {
        if (userEmail) {
            return Promise.reject('E-mail is already registered.')
        }
    });
}), 
body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
    }
    return true;
}), 
appController.postSignup);

router.get('/reset', appController.getReset);

router.post('/reset', appController.postReset);

router.get('/reset/:token', appController.getNewPass);

router.post('/new-password', appController.postNewPass);

router.use(appController.get404Page);

module.exports = router;