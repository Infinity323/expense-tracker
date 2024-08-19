const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const db = require("../db/database");
const {
  findAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../db/queries/transaction");

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

router.put("/sync/:item", async (req, res, next) => {
  try {
    // TODO: modify database
    let cursor = null;
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;
    while (hasMore) {
      const request = {
        access_token: req.headers.access_token,
        cursor: cursor,
      };
      const response = await plaidClient.transactionsSync(request);
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }
    console.log(
      `Successfully synced transactions for item [${req.params.item}]`
    );
    res.json(added);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
