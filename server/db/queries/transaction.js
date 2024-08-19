const db = require("../database");

const TRANSACTION = "transaction";

const findAllTransactions = async () => {
  await db.createIndex({
    index: { fields: ["date"] },
  });
  const transactionDocs = await db.find({
    selector: { type: TRANSACTION, date: { $exists: true } },
    sort: [{ date: "desc" }],
  });
  return transactionDocs.docs;
};

const createTransaction = async ({
  date,
  name,
  description,
  category,
  subcategory,
  amount,
}) => {
  return await db.post({
    type: TRANSACTION,
    date: date,
    name: name,
    description: description,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

const updateTransaction = async ({
  _id,
  _rev,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
}) => {
  return await db.put({
    _id: _id,
    _rev: _rev,
    type: "transaction",
    date: date,
    name: name,
    description: description,
    category: category,
    subcategory: subcategory,
    amount: parseFloat(amount),
  });
};

const deleteTransaction = async ({ id, rev }) => {
  return await db.remove({ _id: id, _rev: rev });
};

module.exports = {
  findAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
