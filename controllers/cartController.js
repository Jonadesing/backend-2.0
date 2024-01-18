// controllers/cartController.js
const Cart = require('../models/cartModel');

exports.updateCart = async (req, res, next) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = products;
        cart.totalAmount = calculateTotalAmount(products);
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Carrito actualizado exitosamente', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

exports.deleteProductFromCart = async (req, res, next) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(productId => productId.toString() !== pid);
        cart.totalAmount = calculateTotalAmount(cart.products);
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

exports.clearCart = async (req, res, next) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({ status: 'success', message: 'Carrito vaciado exitosamente', cart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + product.price, 0);
};
