const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Endpoint para eliminar un producto del carrito
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

// Endpoint para actualizar el carrito con un arreglo de productos
router.put('/:cid', cartController.updateCart);

// Endpoint para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', cartController.updateProductQuantity);

// Endpoint para eliminar todos los productos del carrito
router.delete('/:cid', cartController.clearCart);

// Endpoint para obtener un carrito específico
router.get('/:cid', cartController.getCart);

module.exports = router;
