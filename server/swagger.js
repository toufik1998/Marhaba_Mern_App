const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'Documentation for Authentication API',
    },
    servers: [
      {
        url: 'http://localhost:1111', // Replace with your actual server URLl
      },
    ],
  },
  apis: ['./routes/authRoutes.js'], // Replace with the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};