const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Endpoint para obtener todos los productos con paginación y filtros
router.get('/', productController.getProducts);

// Endpoint para obtener un producto por su ID
router.get('/:productId', productController.getProductById);

// Endpoint para agregar un nuevo producto
router.post('/', productController.addProduct);

// Endpoint para actualizar un producto por su ID
router.put('/:productId', productController.updateProduct);

// Endpoint para eliminar un producto por su ID
router.delete('/:productId', productController.deleteProduct);

module.exports = router;

