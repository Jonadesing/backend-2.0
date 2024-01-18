const mongoose = require('mongoose');

// Define el esquema del producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Indica que el campo es obligatorio
        trim: true // Elimina espacios en blanco al principio y al final del nombre
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Precio no puede ser negativo
    },
    description: String,
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Other'] // Asegura que la categoría sea una de las opciones especificadas
    },
    // Otros campos que puedas necesitar
}, {
    timestamps: true // Añade campos de tiempo: createdAt y updatedAt
});

// Crea el modelo 'Product' basado en el esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
