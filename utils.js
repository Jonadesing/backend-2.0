// utils.js

// Función para manejar errores personalizados
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
};

// Función para crear productos simulados para el módulo de mocking
const createMockingProducts = () => {
    const mockingProducts = [];
    for (let i = 1; i <= 100; i++) {
        const product = {
            name: `Product ${i}`,
            price: Math.floor(Math.random() * 100) + 1, // Precio aleatorio entre 1 y 100
            description: `Description of Product ${i}`,
            category: 'Other' // Podrías ajustar la categoría según tus necesidades
        };
        mockingProducts.push(product);
    }
    return mockingProducts;
};

module.exports = { errorHandler, createMockingProducts };
