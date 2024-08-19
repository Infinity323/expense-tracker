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
  account_id,
  merchant_name,
  merchant_entity_id,
  pending,
  personal_finance_category,
  transaction_id,
}) => {
  return await db.put({
    _id: transaction_id ? transaction_id : crypto.randomUUID(),
    type: TRANSACTION,
    date: date,
    account_id: account_id,
    name: name,
    description: description,
    merchant_name: merchant_name,
    merchant_entity_id: merchant_entity_id,
    pending: pending,
    category: personal_finance_category
      ? personal_finance_category.primary
      : category,
    subcategory: personal_finance_category
      ? personal_finance_category.detailed
      : subcategory,
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
  account_id,
  merchant_name,
  merchant_entity_id,
  pending,
  personal_finance_category,
  transaction_id,
}) => {
  return await db.put({
    _id: transaction_id ? transaction_id : _id,
    _rev: _rev,
    type: "transaction",
    date: date,
    account_id: account_id,
    name: name,
    description: description,
    merchant_name: merchant_name,
    merchant_entity_id: merchant_entity_id,
    pending: pending,
    category: personal_finance_category
      ? personal_finance_category.primary
      : category,
    subcategory: personal_finance_category
      ? personal_finance_category.detailed
      : subcategory,
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
