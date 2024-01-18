const Cart = require('../models/cartModel');

class CartManager {
    async getAllCarts() {
        return await Cart.find();
    }

    async getCartById(cartId) {
        return await Cart.findById(cartId);
    }

    async addCart(cartData) {
        const newCart = new Cart(cartData);
        return await newCart.save();
    }

    async updateCart(cartId, updatedCartData) {
        return await Cart.findByIdAndUpdate(cartId, updatedCartData, { new: true });
    }

    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId);
    }
}

module.exports = new CartManager();
