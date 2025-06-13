import express from "express";
import {
  addTransaction,
  deleteAllTransactions,
  deleteTransaction,
  getAllTransactions,
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

transactionRouter.delete("/:id", deleteTransaction);

transactionRouter.put("/sync/:itemId", syncTransactions);

export default transactionRouter;
