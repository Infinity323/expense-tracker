import express from "express";
import {
  getIncomeVsExpenses,
  getSpendingByCategory,
  getSpendingOverTime,
} from "../controllers/trends.controller";

const trendsRouter = express.Router();

trendsRouter.get("/spending/over-time", getSpendingOverTime);

trendsRouter.get("/spending/by-category", getSpendingByCategory);

trendsRouter.get("/income-vs-expenses", getIncomeVsExpenses);

export default trendsRouter;
