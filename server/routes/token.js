const express = require("express");
const router = express.Router();
const plaidClient = require("../clients/plaid-client");

// Creates a Link token and return it
router.post("/create_link_token/:userId", async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log("Received request to create link token for user %s", userId);
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Expense Tracker",
      language: "en",
      products: ["transactions"],
      country_codes: ["US"],
    });
    console.log("Successfully created link token for user %s", userId);
    res.json(tokenResponse.data);
  } catch (error) {
    next(err);
  }
});

// Exchanges the public token from Plaid Link for an access token
router.post("/exchange_public_token", async (req, res, next) => {
  try {
    console.log(
      "Received request to exchange public token [%s] for access token",
      req.body.public_token
    );
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    console.log(
      "Successfully exchanged public token [%s] for access token",
      req.body.public_token
    );
    res.json(exchangeResponse.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
