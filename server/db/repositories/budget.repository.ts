import db from "../database";

const BUDGET = "budget";

const findAllBudgets = async () => {
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
  return budgetDocs.docs;
};

const findAllPlaidBudgets = async () => {
  await db.createIndex({
    index: { fields: ["detailed"] },
  });
  const plaidBudgetDocs = await db.find({
    selector: {
      type: BUDGET,
      detailed: { $exists: true },
    },
  });
  return plaidBudgetDocs.docs;
};

const createBudget = async ({
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

const updateBudget = async ({ _id, _rev, category, subcategory, amount }) => {
  return await db.put({
    _id: _id,
    _rev: _rev,
    type: BUDGET,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

const deleteById = async (id) => {
  const budgetDoc = await db.get(id);
  return await db.remove({ _id: budgetDoc._id, _rev: budgetDoc._rev });
};

export {
  createBudget,
  deleteById,
  findAllBudgets,
  findAllPlaidBudgets,
  updateBudget,
};
