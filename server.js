const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel')
const ProductManager = require('./dao/productManager'); // Importa ProductManager desde su archivo

// Configuración de variables de entorno
require('dotenv').config();

// Creación de la aplicación Express
const app = express();
const port = process.env.PORT || 8008;

// Configuración de bodyParser para manejar JSON y datos de formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Handlebars como motor de vistas
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// Configuración de express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto',
    resave: false,
    saveUninitialized: false
}));
// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Configuración de connect-flash
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta para procesar el registro de usuarios
app.post('/registro', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'El nombre de usuario ya está en uso');
            return res.redirect('/registro'); // Redirigir de nuevo al formulario de registro
        }

        // Crear una nueva instancia del modelo User con los datos proporcionados
        const newUser = new User({ username, email, password });

        // Generar hash de la contraseña antes de guardarla en la base de datos
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Redirigir a la página de inicio de sesión con un mensaje de éxito
        req.flash('success', 'Usuario registrado exitosamente');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        req.flash('error', 'Error interno del servidor');
        res.redirect('/registro'); // Redirigir de nuevo al formulario de registro en caso de error
    }
});

// Configuración de connect-flash para mensajes flash
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

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

app.get('/productos', (req, res) => {
    const productos = require('./productos.json'); // Cargar productos desde el archivo JSON
    res.render('products', { pageTitle: 'Lista de Productos', products: productos });
});

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

// Rutas
const routes = require('./routes/routes'); // Define tus rutas en un archivo separado
const userRouter = require('./routes/userRouter'); // Importar el router de usuarios
app.use('/', routes);
app.use('/api/users', userRouter); // Usar el router de usuarios

// Ruta para mostrar la lista de productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('products', { pageTitle: 'Lista de Productos', products: productos });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para agregar un producto al carrito
app.post('/api/cart/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        // Encontrar al usuario actual (por ejemplo, a través de la sesión)
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).send('Usuario no autorizado');
        }
        // Agregar el ID del producto al carrito del usuario en la base de datos
        currentUser.cart.push(productId);
        await currentUser.save();
        // Enviar una respuesta de éxito
        res.sendStatus(200);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});
app.get('/carrito', (req, res) => {
    res.render('cart', { pageTitle: 'Carro de compras', user: req.user });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.getAttribute('data-id');
    
    // Aquí puedes hacer una solicitud al servidor para agregar el producto al carrito
    fetch(`/api/cart/add/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Redirigir al carrito después de agregar el producto
            window.location.href = '/carrito';
        } else {
            // Manejar el error
            alert('Error al agregar el producto al carrito');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    });
}
// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Manejo de errores de conexión a MongoDB
db.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});

// Conexión exitosa a MongoDB
db.once('open', () => {
    console.log('Conectado a MongoDB');
});
// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
