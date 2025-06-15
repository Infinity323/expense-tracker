import * as dotenv from "dotenv";

import bodyParser from "body-parser";
import express from "express";
import { mkdirp } from "mkdirp";
import PouchDB from "pouchdb";

import swaggerSpec from "./middleware/swagger";
import accountRouter from "./routes/account.routes";
import budgetRouter from "./routes/budget.routes";
import linkRouter from "./routes/link.routes";
import transactionRouter from "./routes/transaction.routes";
import trendsRouter from "./routes/trends.routes";

import {
  clientErrorHandler,
  defaultErrorHandler,
  validationErrorHandler,
} from "./middleware/errorHandler";

import expressPouchDb from "express-pouchdb";
import itemRouter from "./routes/item.routes";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
mkdirp("/tmp/expense-tracker/db").then(() => {
  app.use(
    "/db",
    expressPouchDb(PouchDB, {
      configPath: "./pouchdb-config.json",
    })
  );
});

// cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// add timestamps to log messages
const logWithTimestamp = console.log.bind(console);
console.log = function (message) {
  logWithTimestamp(`[${new Date().toISOString()}]`, message);
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
app.use("/api/trends", trendsRouter);
app.use("/api/item", itemRouter);

// error handlers
app.use(validationErrorHandler);
app.use(clientErrorHandler);
app.use(defaultErrorHandler);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
