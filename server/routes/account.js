const express = require("express");
const router = express.Router();
const { findAllAccounts } = require("../db/queries/item");

router.get("/", async (req, res, next) => {
  try {
    let accountDocs = await findAllAccounts();
    let accounts = [];
    accountDocs.forEach((doc) => {
      let createdTimestamp = doc?.created_timestamp;
      doc?.accounts?.forEach((account) => {
        account["created_timestamp"] = createdTimestamp;
        accounts.push(account);
      });
    });
    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
