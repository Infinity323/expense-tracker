const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  findAllExpenses,
  findAllTransactions,
} = require("../db/queries/transaction");
const {
  updateItemTransactionCursor,
  findItemTransactionCursor,
  updateItemNeedsAttention,
} = require("../db/queries/item");
const { findAllPlaidBudgets } = require("../db/queries/budget");
const db = require("../db/database");

router.get("/", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
  try {
    const response = await createTransaction(req.body);
    console.log(
      `Successfully added new transaction document ID [${response.id}]`
    );
    res.status(201).json(transactionsDoc);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
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

router.delete("/:id/:rev", async (req, res, next) => {
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

router.put("/sync/:itemId", async (req, res, next) => {
  let itemId = req.params.itemId;
  try {
    let cursor = await findItemTransactionCursor(itemId);
    let added = [];
    let modified = [];
    let removed = [];
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
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        account_id: transaction.account_id,
        merchant_name: transaction.merchant_name,
        pending: transaction.pending,
      });
    }
    console.log(`Added ${added.length} transactions for item ${itemId}`);
    for (const transaction of modified) {
      await updateTransaction({
        _id: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        category:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .category,
        subcategory:
          plaidBudgetMap[transaction.personal_finance_category.detailed]
            .subcategory,
        amount: transaction.amount,
        account_id: transaction.account_id,
        merchant_name: transaction.merchant_name,
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

module.exports = router;
