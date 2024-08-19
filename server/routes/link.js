const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const db = require("../middleware/database");

// Creates a Link token and return it
router.post("/link-token/:userId", async (req, res, next) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.params.userId },
      client_name: "Expense Tracker",
      language: "en",
      products: ["transactions"],
      country_codes: ["US"],
    });
    console.log(
      `Successfully created link token for user ${req.params.userId}`
    );
    res.json(tokenResponse.data);
  } catch (error) {
    next(err);
  }
});

// Get all access tokens
router.get("/access-token", async (req, res, next) => {
  try {
    await db.createIndex({
      index: { fields: ["type", "metadata.institution.institution_id"] },
    });
    let accessTokenDocs = await db.find({
      selector: {
        type: "accessToken",
      },
    });
    console.log(
      `Retrieved ${accessTokenDocs.docs.length} access tokens from the database`
    );
    let accessTokenMap = new Map(
      accessTokenDocs.docs.map((doc) => [doc.itemId, doc.accessToken])
    );
    res.json(accessTokenMap);
  } catch (err) {
    next(err);
  }
});

// Exchanges the public token from Plaid Link for an access token
router.post("/access-token", async (req, res, next) => {
  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    console.log(
      `Successfully exchanged public token ${req.body.public_token} for access token`
    );
    const accessTokenDoc = {
      _id: crypto.randomUUID(),
      type: "accessToken",
      itemId: exchangeResponse.item_id,
      accessToken: exchangeResponse.access_token,
    };
    await db.put(accessTokenDoc);
    console.log(
      `Saved access token for item [${exchangeResponse.item_id}] to database`
    );
    res.json({ [exchangeResponse.item_id]: exchangeResponse.access_token });
  } catch (err) {
    next(err);
  }
});

// Create account link
router.post("/", async (req, res, next) => {
  try {
    // TODO: check if link exists and throw error if duplicate
    const linkMetadataDoc = {
      _id: crypto.randomUUID(),
      type: "linkMetadata",
      metadata: req.body.metadata,
    };
    await db.put(linkMetadataDoc);
    console.log(
      `Saved new institution [${metadata.institution.institution_id}] link metadata to database`
    );
    res.status(201).send(linkMetadataDoc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
