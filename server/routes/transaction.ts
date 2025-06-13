import express from "express";
import { RemovedTransaction, Transaction } from "plaid";
import plaidClient from "../clients/plaid-client";
import { findAllPlaidBudgets } from "../db/queries/budget";
import {
  findItemTransactionCursor,
  updateItemNeedsAttention,
  updateItemTransactionCursor,
} from "../db/queries/item";
import {
  createTransaction,
  deleteAllTransactions,
  deleteTransaction,
  findAllTransactions,
  updateTransaction,
} from "../db/queries/transaction";

const transactionRouter = express.Router();

transactionRouter.get("/", async (req, res, next) => {
  try {
    const transactionDocs = await findAllTransactions();
    console.log(
      `Retrieved ${transactionDocs.length} transactions from the database`
    );
    res.json(transactionDocs);
  } catch (err) {
    next(err);
  }
});

transactionRouter.post("/", async (req, res, next) => {
  try {
    const response = await createTransaction(req.body);
    console.log(
      `Successfully added new transaction document ID [${response.id}]`
    );
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

transactionRouter.put("/", async (req, res, next) => {
  try {
    const response = await updateTransaction(req.body);
    console.log(
      `Successfully updated transaction document ID [${response.id}]`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

transactionRouter.delete("/:id/:rev", async (req, res, next) => {
  try {
    await deleteTransaction(req.params);
    console.log(
      `Successfully deleted transaction document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

transactionRouter.delete("/", async (req, res, next) => {
  try {
    const deleted = await deleteAllTransactions();
    console.log(`Successfully deleted all ${deleted.length} transactions`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

transactionRouter.put("/sync/:itemId", async (req, res, next) => {
  let itemId = req.params.itemId;
  try {
    let cursor = await findItemTransactionCursor(itemId);
    let added: Transaction[] = [];
    let modified: Transaction[] = [];
    let removed: RemovedTransaction[] = [];
    let hasMore = true;
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: req.body.headers.access_token,
        cursor: cursor,
      });
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    const plaidBudgetDocs = await findAllPlaidBudgets();
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
        _id: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        description: undefined,
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        account_id: transaction.account_id,
        merchant_name: transaction.merchant_name,
        merchant_entity_id: transaction.merchant_entity_id,
        pending: transaction.pending,
      });
    }
    console.log(`Added ${added.length} transactions for item ${itemId}`);
    for (const transaction of modified) {
      await updateTransaction({
        _id: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        description: undefined,
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        pending: transaction.pending,
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
      await updateItemNeedsAttention(itemId, true);
    }
    next(err);
  }
});

export default transactionRouter;
