const express = require('express');
const router = express.Router();
const CartManager = require('../managers/cartManager');

// Ruta para obtener el conteo del carrito
router.get('/count', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.user.cartId);
        const count = cart ? cart.products.reduce((acc, item) => acc + item.quantity, 0) : 0;
        res.json({ count });
    } catch (error) {
        console.error('Error al obtener el conteo del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para agregar un producto al carrito
router.post('/add/:productId', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.user.cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId: req.params.productId, quantity: 1 });
            }
            await cart.save();
        } else {
            const newCart = await CartManager.addCart({
                userId: req.user._id,
                products: [{ productId: req.params.productId, quantity: 1 }]
            });
            req.user.cartId = newCart._id;
            await req.user.save();
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para quitar un producto del carrito
router.post('/remove/:productId', async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.user.cartId);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity -= 1;
                if (cart.products[productIndex].quantity <= 0) {
                    cart.products.splice(productIndex, 1);
                }
                await cart.save();
                res.sendStatus(200);
            } else {
                res.status(404).send('Producto no encontrado en el carrito');
            }
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        console.error('Error al quitar el producto del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
