import { NextFunction, Request, Response } from "express";

import { CountryCode, Products } from "plaid";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import plaidClient from "../clients/plaidClient";
import {
  createItem,
  findAccessTokensByUserId,
  findByInstitutionIdAndUserId,
} from "../db/repositories/item.repository";
import { LinkTokenRequest } from "../types/linkTokenRequest";
import { getUserId } from "../utils/authUtil";

/** Creates a Link token. */
export const createLinkToken = async (
  req: Request<{}, {}, LinkTokenRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Expense Tracker",
      language: "en",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      access_token: req.body.accessToken,
    });
    console.log(`Successfully created link token for user ${userId}`);
    res.json(tokenResponse.data);
  } catch (err) {
    next(err);
  }
};

/** Get all access tokens. */
export const getAllAccessTokens = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const itemDocs = await findAccessTokensByUserId(userId);
    console.log(`Retrieved ${itemDocs.length} access tokens from the database`);
    let accessTokens = itemDocs.map((doc) => ({
      itemId: doc.itemId,
      accessToken: doc.accessToken,
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
    const userId = getUserId(req);
    const institutionId = req.body.metadata.institution.institution_id;
    if ((await findByInstitutionIdAndUserId(institutionId, userId)).length) {
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
      itemId: exchangeResponseData.item_id,
      accessToken: exchangeResponseData.access_token,
      institutionId: req.body.metadata.institution.institution_id,
      institutionName: req.body.metadata.institution.name,
      userId,
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
