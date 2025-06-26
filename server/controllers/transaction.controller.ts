import { Request } from "express";
import { RemovedTransaction, Transaction } from "plaid";
import plaidClient from "../clients/plaidClient";
import { findAllPlaidBudgetsByUserId } from "../db/repositories/budget.repository";
import {
  findTransactionCursorById,
  updateItemTransactionCursor,
  updateNeedsAttentionById,
} from "../db/repositories/item.repository";
import {
  createTransaction,
  deleteById,
  deleteByUserId,
  findByMonthAndUserId,
  findByUserId,
  updateTransaction,
} from "../db/repositories/transaction.repository";
import { getUserId } from "../utils/authUtil";

export const getAllTransactions = async (req: Request, res, next) => {
  try {
    const userId = getUserId(req);
    const month = req.query.month as string;
    const transactionDocs = month
      ? await findByMonthAndUserId(userId, month)
      : await findByUserId(userId);
    console.log(
      `Retrieved ${transactionDocs.length} transactions from the database`
    );
    res.json(transactionDocs);
  } catch (err) {
    next(err);
  }
};

export const addTransaction = async (req, res, next) => {
  try {
    const response = await createTransaction(req.body);
    console.log(
      `Successfully added new transaction document ID [${response.transactionId}]`
    );
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const putTransaction = async (req, res, next) => {
  try {
    const response = await updateTransaction(req.body);
    console.log(
      `Successfully updated transaction document ID [${response.transactionId}]`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteAllTransactions = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const deleted = await deleteByUserId(userId);
    console.log(`Successfully deleted all ${deleted.length} transactions`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    await deleteById(req.params.id);
    console.log(
      `Successfully deleted transaction document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const syncTransactions = async (req, res, next) => {
  const itemId = req.params.itemId;
  const userId = getUserId(req);
  try {
    let cursor = await findTransactionCursorById(itemId);
    let added: Transaction[] = [];
    let modified: Transaction[] = [];
    let removed: RemovedTransaction[] = [];
    let hasMore = true;
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: req.body.access_token,
        cursor: cursor,
      });
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    const plaidBudgetDocs = await findAllPlaidBudgetsByUserId(userId);
    const plaidBudgetMap = plaidBudgetDocs.reduce(
      (map, doc) => (
        (map[doc.detailed] = {
          category: doc.category,
          subcategory: doc.subcategory,
        }),
        map
      ),
      {}
    );
    for (const transaction of added) {
      await createTransaction({
        transactionId: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        accountId: transaction.account_id,
        merchantName: transaction.merchant_name,
        merchantEntityId: transaction.merchant_entity_id,
        pending: transaction.pending,
        userId,
      });
    }
    console.log(`Added ${added.length} transactions for item ${itemId}`);
    for (const transaction of modified) {
      await updateTransaction({
        transactionId: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        pending: transaction.pending,
        userId,
      });
    }
    console.log(`Updated ${modified.length} transactions for item ${itemId}`);

    await updateItemTransactionCursor({ itemId, cursor });
    console.log(`Successfully synced transactions for item [${itemId}]`);
    res.json(added);
  } catch (err) {
    if (err.response.data) {
      // plaid API error
      console.error(
        `Error while syncing transactions for item [${itemId}]; ${JSON.stringify(
          err.response.data
        )}`
      );
      await updateNeedsAttentionById(itemId, true);
    }
    next(err);
  }
};
