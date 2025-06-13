import db from "../database";
import { TransactionDoc } from "../types/transactionDoc";

const TRANSACTION = "transaction";

export const findAllExpenses = async () => {
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
  return transactionDocs.docs as TransactionDoc[];
};

export const findAllIncome = async () => {
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
  return transactionDocs.docs as TransactionDoc[];
};

export const findAllTransactions = async () => {
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
  return transactionDocs.docs as TransactionDoc[];
};

export const findCurrentMonthTransactions = async () => {
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
  return transactionDocs.docs as TransactionDoc[];
};

export const createTransaction = async ({
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
  return await db.put<TransactionDoc>({
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

export const updateTransaction = async ({
  _id,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
  pending,
}) => {
  let transactionDoc = await db.get<TransactionDoc>(_id);
  transactionDoc.date = date;
  transactionDoc.name = name;
  if (description) {
    transactionDoc.description = description;
  }
  transactionDoc.pending = pending;
  transactionDoc.category = category;
  transactionDoc.subcategory = subcategory;
  transactionDoc.amount = parseFloat(amount);
  return await db.put(transactionDoc);
};

export const deleteById = async (id) => {
  const transactionDoc = await db.get<TransactionDoc>(id);
  return await db.remove({
    _id: transactionDoc._id,
    _rev: transactionDoc._rev,
  });
};

export const deleteAll = async () => {
  const transactionDocs = await db.find({
    selector: {
      type: TRANSACTION,
    },
  });
  transactionDocs.docs.forEach(
    async (doc) => await db.remove({ _id: doc._id, _rev: doc._rev })
  );
  return transactionDocs.docs as TransactionDoc[];
};
