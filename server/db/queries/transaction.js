const db = require("../database");

const TRANSACTION = "transaction";

const findAllExpenses = async () => {
  await db.createIndex({
    index: { fields: ["date", "category"] },
  });
  const transactionDocs = await db.find({
    selector: {
      type: TRANSACTION,
      date: { $exists: true },
      category: { $ne: "Income" },
    },
    sort: [{ date: "asc" }],
  });
  return transactionDocs.docs;
};

const findAllIncome = async () => {
  await db.createIndex({
    index: { fields: ["date", "category"] },
  });
  const transactionDocs = await db.find({
    selector: {
      type: TRANSACTION,
      date: { $exists: true },
      category: "Income",
    },
    sort: [{ date: "asc" }],
  });
  return transactionDocs.docs;
};

const findAllTransactions = async () => {
  await db.createIndex({
    index: { fields: ["date", "category"] },
  });
  const transactionDocs = await db.find({
    selector: {
      type: TRANSACTION,
      date: { $exists: true },
    },
    sort: [{ date: "desc" }],
  });
  return transactionDocs.docs;
};

const findCurrentMonthTransactions = async () => {
  let currentMonth = new Date(Date.now());
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth());
  await db.createIndex({
    index: { fields: ["date", "category"] },
  });
  const transactionDocs = await db.find({
    selector: {
      type: TRANSACTION,
      date: { $gte: currentMonth },
    },
    sort: [{ date: "desc" }],
  });
  return transactionDocs.docs;
};

const createTransaction = async ({
  _id,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
  account_id,
  merchant_name,
  merchant_entity_id,
  pending,
}) => {
  return await db.put({
    _id: _id ? _id : crypto.randomUUID(),
    type: TRANSACTION,
    date: date,
    account_id: account_id,
    name: name,
    description: description,
    merchant_name: merchant_name,
    merchant_entity_id: merchant_entity_id,
    pending: pending,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

const updateTransaction = async ({
  _id,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
  pending,
}) => {
  let transactionDoc = db.get(_id);
  transactionDoc["date"] = date;
  transactionDoc["name"] = name;
  transactionDoc["description"] = description;
  transactionDoc["pending"] = pending;
  transactionDoc["category"] = category;
  transactionDoc["subcategory"] = subcategory;
  transactionDoc["amount"] = parseFloat(amount);
  return await db.put(transactionDoc);
};

const deleteTransaction = async ({ id, rev }) => {
  return await db.remove({ _id: id, _rev: rev });
};

module.exports = {
  findAllExpenses,
  findAllIncome,
  findAllTransactions,
  findCurrentMonthTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
