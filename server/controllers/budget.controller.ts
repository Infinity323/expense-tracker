import { parse } from "csv-parse";
import fs from "fs";
import {
  batchCreate,
  create,
  deleteById,
  deleteByUserId,
  findByUserId,
  update,
} from "../db/repositories/budget.repository";
import { findByCurrentMonthAndUserId } from "../db/repositories/transaction.repository";
import { getUserId } from "../utils/authUtil";
import { round } from "../utils/dataUtil";

export const getAllBudgets = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    let budgetDocs = await findByUserId(userId);
    if (!budgetDocs.length) {
      budgetDocs = await seedBudgets(userId);
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
};

const seedBudgets = async (userId: string) => {
  const parser = fs
    .createReadStream("db/budget-seed-data.csv")
    .pipe(parse({ from_line: 2 }));

  const rows: any[] = [];
  for await (const row of parser) {
    rows.push(row);
  }

  const parsedBudgets = rows.map((row) => ({
    primary: row[0],
    detailed: row[1],
    description: row[2],
    category: row[3],
    subcategory: row[4],
    amount: 0,
    isMaster: true,
    userId,
  }));

  await batchCreate(parsedBudgets);
  let budgetDocs = await findByUserId(userId);
  console.log(`Seeded database with ${budgetDocs.length} budgets`);
  return budgetDocs;
};

export const addBudget = async (req, res, next) => {
  try {
    const { primary, detailed, description, category, subcategory } = req.body;
    const amount = Number(req.body.amount);
    if (
      typeof category !== "string" ||
      !category.trim() ||
      typeof subcategory !== "string" ||
      !subcategory.trim() ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return res.status(400).json({ error: "Invalid budget details" });
    }

    const response = await create({
      primary,
      detailed,
      description,
      category: category.trim(),
      subcategory: subcategory.trim(),
      amount,
      isMaster: false,
      userId: getUserId(req),
    });
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const putBudget = async (req, res, next) => {
  try {
    const { budgetId, category, subcategory } = req.body;
    const amount = Number(req.body.amount);
    if (
      typeof budgetId !== "string" ||
      !budgetId ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof subcategory !== "string" ||
      !subcategory.trim() ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return res.status(400).json({ error: "Invalid budget details" });
    }

    await update(
      { budgetId, category: category.trim(), subcategory: subcategory.trim(), amount },
      getUserId(req),
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await deleteById(req.params.id, getUserId(req));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getBudgetComparison = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    let budgetDocs = await findByUserId(userId);
    let transactionDocs = await findByCurrentMonthAndUserId(userId);
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
};

export const deleteAllBudgets = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const budgetDocs = await deleteByUserId(userId);
    console.log(`Deleted ${budgetDocs.length} budgets`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
