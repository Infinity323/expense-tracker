const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const db = require("../middleware/database");

router.get("/", async (req, res, next) => {
  try {
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["date"] },
    });
    let transactionsDocs = await db.find({
      selector: { type: "transaction", date: { $exists: true } },
      sort: [{ date: "desc" }],
    });
    console.log(
      `Retrieved ${transactionsDocs.docs.length} transactions from the database`
    );
    res.json(transactionsDocs.docs);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let transactionDoc = {
      _id: crypto.randomUUID(),
      type: "transaction",
      date: req.body.date,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: parseFloat(req.body.amount),
    };
    await db.put(transactionDoc);
    console.log(
      `Successfully added new transaction document: ${JSON.stringify(
        transactionDoc
      )}`
    );
    res.status(201).json(transactionsDoc);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    let transactionDoc = {
      _id: req.body._id,
      _rev: req.body._rev,
      type: "transaction",
      date: req.body.date,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: parseFloat(req.body.amount),
    };
    await db.put(transactionDoc);
    console.log(
      `Successfully updated transaction document: ${JSON.stringify(
        transactionDoc
      )}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/:rev", async (req, res, next) => {
  try {
    await db.remove({ _id: req.params.id, _rev: req.params.rev });
    console.log(
      `Successfully deleted transaction document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});

router.put("/sync/:item", async (req, res, next) => {
  try {
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
