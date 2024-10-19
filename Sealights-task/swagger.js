
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerInit = (app) => {
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Demo Server API',
        version: '1.0.0',
      }
    },
    apis: ['./swagger.yaml']
  };
  
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}