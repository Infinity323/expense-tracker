import express from "express";
import {
  getCurrentMonthSpending,
  getIncomeVsExpenses,
  getNetWorthHistory,
  getSpendingByCategory,
  getSpendingOverTime,
} from "../controllers/trends.controller";

const trendsRouter = express.Router();

trendsRouter.get("/spending/over-time", getSpendingOverTime);

trendsRouter.get("/spending/by-category", getSpendingByCategory);

trendsRouter.get("/spending/current-month", getCurrentMonthSpending);

trendsRouter.get("/income-vs-expenses", getIncomeVsExpenses);

trendsRouter.get("/net-worth", getNetWorthHistory);

export default trendsRouter;
