const db = require("../database");

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

const createBudget = async ({ category, subcategory, amount }) => {
  return await db.post({
    type: BUDGET,
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

const deleteBudget = async ({ id, rev }) => {
  return await db.remove({ _id: id, _rev: rev });
};

module.exports = { findAllBudgets, createBudget, updateBudget, deleteBudget };
