import db from "../database";
import { BudgetDoc } from "../types/budgetDoc";

const BUDGET = "budget";

export const findAll = async () => {
  await db.createIndex({
    index: { fields: ["category"] },
  });
  await db.createIndex({
    index: { fields: ["subcategory"] },
  });
  const budgetDocs = await db.find({
    selector: {
      type: BUDGET,
      category: { $exists: true },
      subcategory: { $exists: true },
    },
    sort: [{ category: "asc", subcategory: "asc" }],
  });
  return budgetDocs.docs as BudgetDoc[];
};

export const findAllPlaidBudgets = async () => {
  await db.createIndex({
    index: { fields: ["detailed"] },
  });
  const plaidBudgetDocs = await db.find({
    selector: {
      type: BUDGET,
      detailed: { $exists: true },
    },
  });
  return plaidBudgetDocs.docs as BudgetDoc[];
};

export const create = async ({
  primary,
  detailed,
  description,
  category,
  subcategory,
  amount,
}) => {
  return await db.post({
    type: BUDGET,
    primary: primary,
    detailed: detailed,
    description: description,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

export const update = async ({ _id, _rev, category, subcategory, amount }) => {
  return await db.put({
    _id: _id,
    _rev: _rev,
    type: BUDGET,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

export const deleteById = async (id) => {
  const budgetDoc = await db.get(id);
  return await db.remove({ _id: budgetDoc._id, _rev: budgetDoc._rev });
};
