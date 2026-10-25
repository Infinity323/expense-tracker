import { NextFunction, Request, Response } from "express";

import { CountryCode, Products } from "plaid";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import plaidClient from "../clients/plaidClient";
import {
  createItem,
  findByIdAndUserId,
  findByInstitutionIdAndUserId,
} from "../db/repositories/item.repository";
import { LinkTokenRequest } from "../types/linkTokenRequest";
import { getUserId } from "../utils/authUtil";

export const createLinkToken = async (
  req: Request<{}, {}, LinkTokenRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req);
    const item = req.body.itemId
      ? await findByIdAndUserId(req.body.itemId, userId)
      : undefined;
    if (req.body.itemId && !item) {
      return res.status(404).json({ error: "Linked item not found" });
    }

    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "Expense Tracker",
      language: "en",
      country_codes: [CountryCode.Us],
      ...(item
        ? {
            access_token: item.accessToken,
            update: { account_selection_enabled: true },
          }
        : { products: [Products.Transactions] }),
    });
    res.json(tokenResponse.data);
  } catch (err) {
    next(err);
  }
};

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
    const institution = req.body.metadata?.institution;
    if (!req.body.publicToken || !institution?.institution_id) {
      return res.status(400).json({ error: "Invalid Plaid Link response" });
    }

    const institutionId = institution.institution_id;
    if ((await findByInstitutionIdAndUserId(institutionId, userId)).length) {
      return res.status(409).json({ error: "Institution is already linked" });
    }
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.publicToken,
    });
    const exchangeResponseData = exchangeResponse.data;
    await createItem({
      itemId: exchangeResponseData.item_id,
      accessToken: exchangeResponseData.access_token,
      institutionId: req.body.metadata.institution.institution_id,
      institutionName: institution.name,
      userId,
    });
    res.status(201).json({
      itemId: exchangeResponseData.item_id,
    });
  } catch (err) {
    next(err);
  }
};
