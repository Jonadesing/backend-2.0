const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Product = require('./models/productModel');

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
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

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

// Ruta para mostrar la página de agregar producto
app.get('/add-product', (req, res) => {
    res.render('add-product');
});

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

// Manejar conexiones de Socket.io (si es necesario)

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
