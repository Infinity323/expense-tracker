import { NextFunction, Request, Response } from "express";

import { CountryCode, Products } from "plaid";
import plaidClient from "../clients/plaidClient";
import {
  createItem,
  findAllAccessTokens,
  findByInstitutionId,
} from "../db/repositories/item.repository";
import { createLinkMetadata } from "../db/repositories/linkMetadata.repository";
import { LinkTokenRequest } from "../types/linkTokenRequest";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";

/** Creates a Link token. */
export const createLinkToken = async (
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
    console.log(`Successfully created link token for user ${req.body.userId}`);
    res.json(tokenResponse.data);
  } catch (err) {
    next(err);
  }
};

/** Get all access tokens. */
export const getAllAccessTokens = async (req, res, next) => {
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
};

/** Exchanges the public token from Plaid Link for an access token */
export const createAccessToken = async (
  req: Request<
    {},
    {},
    { publicToken: string; metadata: PlaidLinkOnSuccessMetadata }
  >,
  res,
  next
) => {
  try {
    const institutionId = req.body.metadata.institution.institution_id;
    if ((await findByInstitutionId(institutionId)).length) {
      const error = new Error(`Institution [${institutionId}] already linked`);
      error.name = "DuplicateInstitutionError";
      throw error;
    }
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.publicToken,
    });
    const exchangeResponseData = exchangeResponse.data;
    console.log(
      `Successfully exchanged public token [${req.body.publicToken}] for access token`
    );
    await createItem({
      item_id: exchangeResponseData.item_id,
      access_token: exchangeResponseData.access_token,
      institution_id: req.body.metadata.institution.institution_id,
      institution_name: req.body.metadata.institution.name,
    });
    console.log(`Saved new item [${exchangeResponseData.item_id}] to database`);
    res.status(201).json({
      itemId: exchangeResponseData.item_id,
      accessToken: exchangeResponseData.access_token,
    });
  } catch (err) {
    next(err);
  }
};

/** Create account link */
export const createLink = async (req, res, next) => {
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
};
