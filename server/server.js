require("dotenv").config();

const { mkdirp } = require("mkdirp");
const PouchDB = require("pouchdb");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const linkRouter = require("./routes/link");
const budgetRouter = require("./routes/budget");
const transactionRouter = require("./routes/transaction");
const accountRouter = require("./routes/account");

const clientErrorHandler =
  require("./middleware/error-handler").clientErrorHandler;
const defaultErrorHandler =
  require("./middleware/error-handler").defaultErrorHandler;
const swaggerSpec = require("./middleware/swagger");

mkdirp("/tmp/expense-tracker");
mkdirp("/tmp/expense-tracker/db");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
app.use(
  "/db",
  require("express-pouchdb")(PouchDB, {
    configPath: "./pouchdb-config.json",
  })
);

// cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// add timestamps to log messages
console.logCopy = console.log.bind(console);
console.log = function (message) {
  this.logCopy(`[${new Date().toISOString()}]`, message);
};

// "request interceptor"
app.use("/api/", (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// swagger
app.use("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// routes
app.use("/api/link", linkRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/account", accountRouter);

// error handlers
app.use(clientErrorHandler);
app.use(defaultErrorHandler);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
