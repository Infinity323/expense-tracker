/*
server.js – Configures the Plaid client and uses Express to defines routes that call Plaid endpoints in the Sandbox environment.Utilizes the official Plaid node.js client library to make calls to the Plaid API.
*/

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const app = express();

app.use(
  // FOR DEMO PURPOSES ONLY
  // Use an actual secret key in production
  session({ secret: "test", saveUninitialized: true, resave: true })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

// Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

// Creates a Link token and return it
app.post("/api/create_link_token/:userId", async (req, res, next) => {
  let userId = req.params.userId;
  console.log("Received request to create link token for user %s", userId);
  try {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Expense Tracker",
      language: "en",
      products: ["transactions"],
      country_codes: ["US"],
    });
    console.log("Successfully created link token for user %s", userId);
    res.json(tokenResponse.data);
  } catch (error) {
    console.error(
      "Failed to create link token for user %s: %s",
      userId,
      err.response?.data
    );
  }
});

// Exchanges the public token from Plaid Link for an access token
app.post("/api/exchange_public_token", async (req, res, next) => {
  console.log(
    "Received request to exchange public token [%s] for access token",
    req.body.public_token
  );
  try {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    console.log(
      "Successfully exchanged public token [%s] for access token",
      req.body.public_token
    );
    res.json(exchangeResponse.data);
  } catch (error) {
    console.error(
      "Failed to exchange public token [%s] for access token",
      req.body.public_token
    );
  }
});

// // Fetches balance data using the Node client library for Plaid
// app.get("/api/balance", async (req, res, next) => {
//   const access_token = req.session.access_token;
//   const balanceResponse = await client.accountsBalanceGet({ access_token });
//   res.json({
//     Balance: balanceResponse.data,
//   });
// });

console.log(`Starting Express server on port ${process.env.SERVER_PORT}`);
app.listen(process.env.SERVER_PORT || 8080);
