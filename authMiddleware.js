function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/iniciar-sesion');
}

module.exports = ensureAuthenticated;
