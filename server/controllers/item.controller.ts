import { Request } from "express";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import plaidClient from "../clients/plaidClient";
import {
  deleteById,
  findAll,
  findAllAccessTokens,
  updateAccounts,
  updateItemNeedsAttention,
} from "../db/repositories/item.repository";

export const getAllItems = async (req, res, next) => {
  try {
    const itemDocs = await findAll();
    console.log(`Retrieved ${itemDocs.length} items`);
    res.json(itemDocs);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request<{ id: string }, {}, PlaidLinkOnSuccessMetadata>,
  res,
  next
) => {
  try {
    await updateAccounts(req.params.id, req.body.accounts);
    console.log(`Updated item ${req.params.id}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (
  req: Request<{ id: string }, {}, {}>,
  res,
  next
) => {
  try {
    await deleteById(req.params.id);
    console.log(`Deleted item ${req.params.id}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/** Gets all account balances associated with an account. */
export const getBalances = async (req, res, next) => {
  try {
    const itemDocs = await findAllAccessTokens();
    const accounts = (
      await Promise.all(
        itemDocs.map(async (doc) => {
          try {
            const response = await plaidClient.accountsGet({
              access_token: doc.access_token,
            });
            return response.data.accounts;
          } catch (err) {
            console.error(
              `Error occurred while getting accounts for item ${doc.item_id}`
            );
            await updateItemNeedsAttention(doc.item_id, true);
            return [];
          }
        })
      )
    ).flatMap((arr) => arr);
    console.log(`Retrieved balances for ${accounts.length} accounts.`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
