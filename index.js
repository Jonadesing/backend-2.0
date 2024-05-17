const express = require('express');
const router = express.Router();
const Product = require('./models/productModel');


// Rutas para cada vista
router.get('/', (req, res) => {
    res.render('home', { pageTitle: 'Página Principal' });
});

router.get('/productos', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { pageTitle: 'Lista de Productos', products });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/iniciar-sesion', (req, res) => {
    res.render('login', { pageTitle: 'Iniciar Sesión' });
});

router.get('/registro', (req, res) => {
    res.render('register', { pageTitle: 'Registro de Usuario' });
});

router.get('/perfil', (req, res) => {
    res.render('profile', { pageTitle: 'Perfil de Usuario', user: req.user });
});

module.exports = router;