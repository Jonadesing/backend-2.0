const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login.handlebars', (req, res) => {
    res.render('login.handlebars');
});

// Ruta para procesar el login
router.post('/login.handlebars', passport.authenticate('local', {
    successRedirect: '/dashboard',  // Redirigir en caso de éxito
    failureRedirect: '/login.handlebars',       // Redirigir en caso de fallo
    failureFlash: true,
}));

// Ruta para mostrar el formulario de registro
router.get('/profile.handlebars', (req, res) => {
    res.render('profile.handlebars');
});

// Ruta para procesar el registro
router.post('/register', async (req, res) => {

});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
