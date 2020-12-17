exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Bud-dy',
        path: '/',
        isAuth: req.session.isLoggedIn
    });
};

exports.postLoginLogout = (req, res, next) => {
    const logout = req.query.logout;
    if (logout) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        req.session.isLoggedIn = true;
        res.redirect('account/home');
    }
};

exports.get404Page = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404',
        path: '/404'
    });
};