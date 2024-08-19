const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");
const {
  findAllAccessTokens,
  createAccessToken,
} = require("../db/queries/access-token");
const { createLinkMetadata } = require("../db/queries/link-metadata");

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
    const accessTokenDocs = await findAllAccessTokens();
    console.log(
      `Retrieved ${accessTokenDocs.length} access tokens from the database`
    );
    let accessTokens = accessTokenDocs.map((doc) => {
      return { itemId: doc.itemId, accessToken: doc.accessToken };
    });
    res.json(accessTokens);
  } catch (err) {
    next(err);
  }
});

// Exchanges the public token from Plaid Link for an access token
router.post("/access-token", async (req, res, next) => {
  try {
    let exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    exchangeResponse = exchangeResponse.data;
    console.log(
      `Successfully exchanged public token [${req.body.public_token}] for access token`
    );
    await createAccessToken(exchangeResponse);
    console.log(
      `Saved access token for item [${exchangeResponse.item_id}] to database`
    );
    res.status(201).json({
      itemId: exchangeResponse.item_id,
      accessToken: exchangeResponse.access_token,
    });
  } catch (err) {
    next(err);
  }
});

// Create account link
router.post("/", async (req, res, next) => {
  try {
    // TODO: check if link exists and throw error if duplicate
    await createLinkMetadata(req.body);
    console.log(
      `Saved new institution [${req.body.institution.institution_id}] link metadata to database`
    );
    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
