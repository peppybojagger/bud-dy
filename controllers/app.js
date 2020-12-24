const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { equal } = require('assert');

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: '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'
    }
}));

exports.getIndex = (req, res, next) => {
    let message = req.flash('userError');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('index', {
        pageTitle: 'Bud-dy',
        path: '/',
        noFoot: true,
        errorMessage: message
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
                req.flash('userError', 'E-mail not found.');
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
                req.flash('userError', 'Password is incorrect.');
                return res.redirect('/');
            }).catch(err => {
                res.redirect('/');
            });
        })
    }
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('userError');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('signup', {
        pageTitle: 'Create Account',
        path: '/signup',
        noFoot: true,
        errorMessage: message,
        oldInput: {
            email: '',
            userName: '',
            password: '',
            confirmPassword: ''
        },
        validationErr: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('signup', {
            pageTitle: 'Create Account',
            path: '/signup',
            noFoot: true,
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, userName: userName, password: password, confirmPassword: req.body.confirmPassword},
            validationErr: errors.array()
        });
    }
    bcrypt.hash(password, 12)
    .then(hashedPw => {
        const user = new User({
            email: email,
            userName: userName,
            password: hashedPw
        });
        return user.save();
    })
    .then(result => {
        res.redirect('/');
        transporter.sendMail({
            to: email,
            from: 'peppybojagger@gmail.com',
            subject: 'Account Created',
            html: '<h1>Welcome to Bud-dy!</h1><p>Thanks for trying out my app! If you have questions or user feedback, please reply to this email.</p><p>Thank you!</p>'
        }).catch(err => {
            console.log(err);
        });
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('userError');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('reset', {
        pageTitle: 'Reset Your Password',
        path: '/reset',
        noFoot: true,
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.flash('userError', 'E-mail does not exist.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExp = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            req.flash('userError', 'Reset E-mail has been sent! If you do not see it, please check your spam folder.');
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'peppybojagger@gmail.com',
                subject: 'Password Reset',
                html: `<p>You have requested a password reset. 
                Click <a href="http://localhost:3000/reset/${token}">here</a> to reset it.</p>`
            });
        })
        .catch(err => {
            console.log(err);
        })
    })
};

exports.getNewPass = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExp: {$gt: Date.now()}})
    .then(user => {
        res.render('new-password', {
            pageTitle: 'Reset Your Password',
            path: '/new-password',
            noFoot: true,
            userId: user._id.toString(),
            passToken: token
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postNewPass = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passToken = req.body.passToken;
    let resetUser;
    User.findOne({resetToken: passToken, resetTokenExp: {$gt: Date.now()}, _id: userId})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPw => {
        resetUser.password = hashedPw;
        resetUser.resetToken = null;
        resetUser.resetTokenExp = undefined;
        return resetUser.save();
    })
    .then(result => {
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
        noFoot: false
    });
};