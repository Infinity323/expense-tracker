require("dotenv").config();

const { mkdirp } = require("mkdirp");
const PouchDB = require("pouchdb");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const plaidTokenRouter = require("./routes/token");
const transactionRouter = require("./routes/transaction");
const clientErrorHandler =
  require("./middleware/error-handler").clientErrorHandler;
const defaultErrorHandler =
  require("./middleware/error-handler").defaultErrorHandler;

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

// "request interceptor"
app.use("/api/", (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// routes
app.use("/api/token", plaidTokenRouter);
app.use("/api/transaction", transactionRouter);

// error handlers
app.use(clientErrorHandler);
app.use(defaultErrorHandler);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
