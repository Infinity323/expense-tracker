import express, { NextFunction, Request, Response } from "express";
import { CountryCode, Products } from "plaid";
import plaidClient from "../clients/plaidClient";
import {
  createItem,
  findAllAccessTokens,
} from "../db/repositories/item.repository";
import { createLinkMetadata } from "../db/repositories/linkMetadata.repository";
import { LinkTokenRequest } from "../types/linkTokenRequest";

const linkRouter = express.Router();

/** Creates a Link token and return it */
linkRouter.post(
  "/link-token",
  async (
    req: Request<{}, {}, LinkTokenRequest>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: req.body.userId },
        client_name: "Expense Tracker",
        language: "en",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        access_token: req.body.accessToken,
      });
      console.log(
        `Successfully created link token for user ${req.body.userId}`
      );
      res.json(tokenResponse.data);
    } catch (err) {
      next(err);
    }
  }
);

/** Get all access tokens */
linkRouter.get("/access-token", async (req, res, next) => {
  try {
    const itemDocs = await findAllAccessTokens();
    console.log(`Retrieved ${itemDocs.length} access tokens from the database`);
    let accessTokens = itemDocs.map((doc) => ({
      itemId: doc.item_id,
      accessToken: doc.access_token,
    }));
    res.json(accessTokens);
  } catch (err) {
    next(err);
  }
});

/** Exchanges the public token from Plaid Link for an access token */
linkRouter.post("/access-token", async (req, res, next) => {
  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    const exchangeResponseData = exchangeResponse.data;
    console.log(
      `Successfully exchanged public token [${req.body.public_token}] for access token`
    );
    let accountsResponse = await plaidClient.accountsGet({
      access_token: exchangeResponseData.access_token,
    });
    await createItem(
      exchangeResponseData.item_id,
      exchangeResponseData.access_token,
      accountsResponse.data.accounts
    );
    console.log(`Saved new item [${exchangeResponseData.item_id}] to database`);
    res.status(201).json({
      itemId: exchangeResponseData.item_id,
      accessToken: exchangeResponseData.access_token,
    });
  } catch (err) {
    next(err);
  }
});

/** Create account link */
linkRouter.post("/", async (req, res, next) => {
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

export default linkRouter;
