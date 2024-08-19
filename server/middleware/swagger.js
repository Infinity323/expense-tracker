const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  swagger: "2.0",
  info: {
    title: "Expense Tracker Service",
    version: "1.0.0",
    description: "Service for expense tracker",
  },
  host: "localhost:8080",
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: ["../routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
