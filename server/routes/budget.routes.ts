import express from "express";
import {
  addBudget,
  deleteAllBudgets,
  deleteBudget,
  getAllBudgets,
  getBudgetComparison,
  putBudget,
} from "../controllers/budget.controller";

const budgetRouter = express.Router();

budgetRouter
  .route("/")
  .get(getAllBudgets)
  .post(addBudget)
  .put(putBudget)
  .delete(deleteAllBudgets);

budgetRouter.delete("/:id", deleteBudget);

budgetRouter.get("/comparison", getBudgetComparison);

export default budgetRouter;
