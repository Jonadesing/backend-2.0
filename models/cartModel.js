const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Referencia a productos en el carrito
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que posee el carrito
    totalAmount: { type: Number, default: 0 }, // Monto total del carrito
    status: { type: String, enum: ['active', 'completed'], default: 'active' }, // Estado del carrito (activo o completado)
    // Otros campos que puedas necesitar
}, {
    timestamps: true // Añade campos de tiempo: createdAt y updatedAt
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
