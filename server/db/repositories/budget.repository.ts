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
  isMaster,
}) => {
  return await db.post({
    type: BUDGET,
    primary: primary,
    detailed: detailed,
    description: description,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
    isMaster,
  });
};

export const update = async ({ _id, category, subcategory, amount }) => {
  const budgetDoc = await db.get<BudgetDoc>(_id);
  return await db.put({
    ...budgetDoc,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

export const deleteById = async (id) => {
  const budgetDoc = await db.get(id);
  return await db.remove({ _id: budgetDoc._id, _rev: budgetDoc._rev });
};

export const deleteAll = async () => {
  const budgetDocs = await db.find({
    selector: {
      type: BUDGET,
    },
  });
  budgetDocs.docs.forEach(
    async (doc) => await db.remove({ _id: doc._id, _rev: doc._rev })
  );
  return budgetDocs.docs as BudgetDoc[];
};
