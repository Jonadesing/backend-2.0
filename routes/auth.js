const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar el login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',  // Redirigir en caso de éxito
    failureRedirect: '/login',       // Redirigir en caso de fallo
    failureFlash: true,
}));

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para procesar el registro
router.post('/register', async (req, res) => {
    // Implementar lógica de registro aquí
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
