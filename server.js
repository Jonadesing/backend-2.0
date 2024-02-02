const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy; 
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // Asegúrate de tener un modelo de usuario (userModel.js)

require('dotenv').config();

const app = express();
const port = 8008;

// Configurar Handlebars como el motor de vistas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true
});

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

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});
// Ruta para mostrar la página de agregar producto
app.get('/add-product', (req, res) => {
    res.render('add-product');
});

passport.use(new GitHubStrategy(
    {
        clientID: 'TUCOMITENIDODEGITHUB',
        clientSecret: 'TUCOMITENSECRETODEGITHUB',
        callbackURL: 'http://localhost:8008/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Aquí puedes acceder a la información del usuario a través de 'profile'
        const  githubUsername = profile.username;
        const githubEmail = profile.emails ? profile.emails[0].value : null;

        

        return done(null, profile);
    }
));

// Ruta para procesar la adición de un nuevo producto
app.post('/add-product', async (req, res) => {
    const { productName, productPrice } = req.body;

    // Validar que se proporcionen los datos necesarios
    if (!productName || !productPrice) {
        return res.status(400).send('Nombre y precio del producto son obligatorios');
    }

    // Crear un nuevo producto con los datos recibidos
    const newProduct = new Product({
        name: productName,
        price: productPrice,
        // Puedes agregar otros campos aquí según tus necesidades
    });

    try {
        // Guardar el nuevo producto en la base de datos
        await newProduct.save();
        res.redirect('/success-page'); // Redirigir al usuario a la página de éxito
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.redirect('/error-page'); // Redirigir al usuario a la página de error en caso de fallo
    }
});

// Manejar conexiones de Socket.io 
app.set('env', 'development'); // Configura el entorno a desarrollo

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
