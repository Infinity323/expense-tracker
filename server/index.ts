import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authorizeUser from "./middleware/authorizeUser";
import {
  clientErrorHandler,
  defaultErrorHandler,
  validationErrorHandler,
} from "./middleware/errorHandler";
import swaggerSpec from "./middleware/swagger";
import accountRouter from "./routes/account.routes";
import budgetRouter from "./routes/budget.routes";
import institutionRouter from "./routes/institution.routes";
import itemRouter from "./routes/item.routes";
import linkRouter from "./routes/link.routes";
import transactionRouter from "./routes/transaction.routes";
import trendsRouter from "./routes/trends.routes";

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use(
  "*",
  cors({
    origin: process.env.CLIENT_URL,
  }),
  (req, res, next) => {
    next();
  }
);

// add timestamps to log messages
const logWithTimestamp = console.log.bind(console);
console.log = function (message) {
  logWithTimestamp(`[${new Date().toISOString()}]`, message);
};

// "request interceptor"
app.use("/api/", authorizeUser, (req, res, next) => {
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
app.use("/api/institution", institutionRouter);

// error handlers
app.use(validationErrorHandler);
app.use(clientErrorHandler);
app.use(defaultErrorHandler);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
