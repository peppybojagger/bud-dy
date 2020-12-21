const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Bud-dy',
        path: '/',
        isAuth: req.session.isLoggedIn,
        noFoot: true
    });
};

exports.postLoginLogout = (req, res, next) => {
    const logout = req.query.logout;
    if (logout) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        const email = req.body.email;
        const password = req.body.password;
        User.findOne({email: email}).then(user => {
            if (!user) {
                return res.redirect('/');
            }
            bcrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        res.redirect('/account/home'); 
                    });
                }
                return res.redirect('/');
            }).catch(err => {
                res.redirect('/');
            });
        })
    }
};

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        pageTitle: 'Create Account',
        path: '/signup',
        isAuth: req.session.isLoggedIn,
        noFoot: true
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
    .then(userEmail => {
        if (userEmail) {
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                userName: userName,
                password: hashedPw
            });
            return user.save();
        });
    }).then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.get404Page = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404',
        path: '/404',
        isAuth: req.session.isLoggedIn,
        noFoot: false
    });
};