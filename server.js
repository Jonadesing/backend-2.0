// server.js
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Product = require('./models/productModel');


require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();
const port = 8008;

// Configurar Handlebars como el motor de vistas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

// Ruta para mostrar la página de agregar producto
app.get('/add-product', (req, res) => {
    res.render('add-product');
});

// Ruta para procesar la adición de un nuevo producto
app.post('/add-product', async (req, res) => {
    // Obtener los datos del formulario desde la solicitud
    const { productName, productPrice } = req.body;

    // Aquí deberías agregar lógica para guardar el producto en tu base de datos
    // Utilizando mongoose o el método que prefieras

    // Ejemplo con mongoose
    const Product = require('../models/productModel');

    const newProduct = new Product({
        name: productName,
        price: productPrice,
        // Otros campos según tus necesidades
    });

    try {
        // Guardar el nuevo producto en la base de datos
        await newProduct.save();

        // Redirigir al usuario a la página de éxito o a otra vista
        res.redirect('/success-page');
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        // Manejar el error y redirigir al usuario a una página de error o a otra vista
        res.redirect('/error-page');
    }
});

// Manejar conexiones de Socket.io (si es necesario)

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
