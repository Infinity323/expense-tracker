const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const db = require("../middleware/database");

router.get("/", async (req, res, next) => {
  try {
    console.log();
    console.log;
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["date"] },
    });
    let transactions = await db.find({
      selector: { type: "transaction", date: { $exists: true } },
      sort: [{ date: "desc" }],
    });
    console.log(
      `Retrieved ${transactions.docs.length} transactions from the database`
    );
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

router.put("/:item", async (req, res, next) => {
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
