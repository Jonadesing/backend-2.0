const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); 
const Ticket = require('./models/ticketModel');
const Product = require('./models/productModel'); 

require('dotenv').config();

const app = express();
const port = 8009;

// Configurar Handlebars como el motor de vistas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGO_URI);


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar express-session
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar la estrategia local de Passport
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serializar y deserializar usuarios para la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Middleware de autorización para verificar el rol del usuario
const authorize = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).send('Acceso prohibido');
    }
};

// Ruta para mostrar la página de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar el inicio de sesión
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta para mostrar la página principal con productos
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para mostrar la página de compra de carrito
app.get('/carts/:cid/purchase', authorize('user'), async (req, res) => {
    try {
        // Lógica para finalizar la compra y generar un ticket
        // ...
        res.status(200).send('Compra finalizada con éxito');
    } catch (error) {
        console.error('Error al finalizar la compra:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
// Ruta para mostrar la página de agregar producto
app.get('/add-product', (req, res) => {
    res.render('add-product');
});
