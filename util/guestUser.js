module.exports = {
    isGuest: (req, res, next) => {
        if (!req.session.isAuth) return next();
        return res.redirect('/');
    },
    isUser: (req, res, next) => {
        if (req.session.isAuth) return next();
        return res.redirect('/');
    }
};