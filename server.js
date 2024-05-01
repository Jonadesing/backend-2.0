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
const { specs, swaggerUi } = require('./swaggerConfig');

// Configuración de variables de entorno
require('dotenv').config();

// Creación de la aplicación Express
const app = express();
const port = process.env.PORT || 8008;

// Configuración de bodyParser para manejar JSON y datos de formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Handlebars como el motor de vistas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Manejo de errores de conexión a MongoDB
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Configuración de express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de la estrategia local de Passport para el inicio de sesión
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

        // Actualizar la última conexión del usuario
        user.last_connection = new Date();
        await user.save();

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialización y deserialización de usuarios para la sesión
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

// Ruta para el registro de sesiones
app.post('/api/sessions/register', (req, res) => {
    const { _id, username, email } = req.user;
    // Almacenar la información del usuario en la sesión
    req.session.userId = _id;
    req.session.username = username;
    req.session.email = email;
    res.send('Registro de sesión exitoso');
});

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
        const ticket = new Ticket({
            userId: req.user._id,
            cartId: req.params.cid,
            products: req.session.cart.products
        });
        await ticket.save();

        // Limpiar el carrito después de la compra
        req.session.cart = null;

        res.status(200).send('Compra finalizada con éxito');
    } catch (error) {
        console.error('Error al finalizar la compra:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para mostrar la página de agregar producto
app.get('/add-product', (req, res) => {
    res.render('add-product');
});

// Ruta para cambiar el rol de un usuario a "premium" o "user"
app.put('/api/users/:uid/role', async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        user.role = role;
        await user.save();

        res.status(200).send(`Rol de usuario actualizado a ${role}`);
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Middleware para servir la documentación Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
