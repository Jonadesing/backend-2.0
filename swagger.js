const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación de API',
            version: '1.0.0',
            description: 'Documentación de la API para mi proyecto final',
        },
    },
    apis: ['./routes/*.js'], // Rutas donde se encuentran las definiciones de las API
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };