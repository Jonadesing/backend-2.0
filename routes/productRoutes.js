const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/add-product', (req, res) => {
  res.render('add-product');
});

router.post('/add-product', async (req, res) => {
  const { productName, productPrice } = req.body;

  if (!productName || !productPrice) {
    return res.status(400).send('Nombre y precio del producto son obligatorios');
  }

  const newProduct = new Product({
    name: productName,
    price: productPrice,
  });

  try {
    await newProduct.save();
    res.redirect('/success-page');
  } catch (error) {
    console.error('Error al agregar el producto:', error.message);
    res.redirect('/error-page');
  }
});

module.exports = router;
