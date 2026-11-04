import express from "express";
import {
  addTransaction,
  deleteAllTransactions,
  deleteTransaction,
  getAllTransactions,
  getTransactionTags,
  putTransaction,
  syncTransactions,
} from "../controllers/transaction.controller";

const transactionRouter = express.Router();

transactionRouter
  .route("/")
  .get(getAllTransactions)
  .post(addTransaction)
  .put(putTransaction)
  .delete(deleteAllTransactions);

transactionRouter.get("/tags", getTransactionTags);
transactionRouter.delete("/:id", deleteTransaction);

transactionRouter.put("/sync/:itemId", syncTransactions);

export default transactionRouter;
