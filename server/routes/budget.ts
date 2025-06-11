import { parse } from "csv-parse";
import express from "express";
import * as fs from "fs";
import {
  createBudget,
  deleteBudget,
  findAllBudgets,
  updateBudget,
} from "../db/queries/budget";
import { findCurrentMonthTransactions } from "../db/queries/transaction";

const budgetRouter = express.Router();

budgetRouter.get("/", async (req, res, next) => {
  try {
    let budgetDocs = await findAllBudgets();
    if (!budgetDocs.length) {
      budgetDocs = await seedBudgets();
    }
    console.log(`Retrieved ${budgetDocs.length} budgets from the database`);
    if (req.query.sorted) {
      let budgetsMap = {};
      budgetDocs.forEach((doc) => {
        budgetsMap[doc.category] = budgetsMap[doc.category] || [];
        budgetsMap[doc.category].push(doc.subcategory);
      });
      res.json(budgetsMap);
    } else {
      res.json(budgetDocs);
    }
  } catch (err) {
    next(err);
  }
});

const seedBudgets = async () => {
  let rows = [];
  fs.createReadStream("db/budget-seed-data.csv")
    .pipe(parse({ from_line: 2 }))
    .on("data", (row) => rows.push(row));
  for (const row of rows) {
    await createBudget({
      primary: row[0],
      detailed: row[1],
      description: row[2],
      category: row[3],
      subcategory: row[4],
      amount: 0,
    });
  }
  let budgetDocs = await findAllBudgets();
  console.log(`Seeded database with ${budgetDocs.length} budgets`);
  return budgetDocs;
};

budgetRouter.post("/", async (req, res, next) => {
  try {
    const response = await createBudget(req.body);
    console.log(`Successfully added new budget document ID [${response.id}]`);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

budgetRouter.put("/", async (req, res, next) => {
  try {
    const response = await updateBudget(req.body);
    console.log(`Successfully updated budget document ID [${response.id}]`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

budgetRouter.delete("/:id/:rev", async (req, res, next) => {
  try {
    await deleteBudget(req.params);
    console.log(
      `Successfully deleted budget document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

budgetRouter.get("/comparison", async (req, res, next) => {
  try {
    let budgetDocs = await findAllBudgets();
    let transactionDocs = await findCurrentMonthTransactions();
    let actualMap = {};
    transactionDocs.forEach((transaction) => {
      let key = `${transaction.category} - ${transaction.subcategory}`;
      actualMap[key] = actualMap[key] || 0;
      actualMap[key] += transaction.amount;
    });
    let result = { income: [], expenses: [] };
    budgetDocs.forEach((budget) => {
      if (budget.amount == 0) {
        return;
      }
      let actualAmount = round(
        actualMap[`${budget.category} - ${budget.subcategory}`] || 0
      );
      if (budget.category == "Income") {
        actualAmount *= -1;
      }
      result[budget.category == "Income" ? "income" : "expenses"].push({
        name: budget.subcategory,
        expectedAmount: budget.amount,
        actualAmount: actualAmount,
        difference: budget.amount - actualAmount,
      });
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

const round = (amount) => {
  return parseFloat(amount.toFixed(2));
};

export default budgetRouter;
