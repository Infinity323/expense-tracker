import express from "express";
import {
  addBudget,
  deleteBudget,
  getAllBudgets,
  getBudgetComparison,
  putBudget,
} from "../controllers/budget.controller";

const budgetRouter = express.Router();

budgetRouter.route("/").get(getAllBudgets).post(addBudget).put(putBudget);

budgetRouter.delete("/:id", deleteBudget);

budgetRouter.get("/comparison", getBudgetComparison);

export default budgetRouter;
