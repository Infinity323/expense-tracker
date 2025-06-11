import express from "express";
import { findAllAccounts } from "../db/queries/item";

const accountRouter = express.Router();

accountRouter.get("/", async (req, res, next) => {
  try {
    let accountDocs = await findAllAccounts();
    let accounts = [];
    accountDocs.forEach((doc) => {
      let createdTimestamp = doc?.created_timestamp;
      let needsAttention = doc?.needs_attention;
      doc?.accounts?.forEach((account) => {
        account["created_timestamp"] = createdTimestamp;
        account["needs_attention"] = needsAttention;
        accounts.push(account);
      });
    });
    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

export default accountRouter;
