import plaidClient from "../clients/plaidClient";
import { findAll } from "../db/repositories/item.repository";
import { AccountResponse } from "../types/accountResponse";

export const getAllAccounts = async (req, res, next) => {
  try {
    const itemDocs = await findAll();
    const accounts: AccountResponse[] = await Promise.all(
      itemDocs.map(async (doc) => {
        const accountsResponse = (
          await plaidClient.accountsGet({
            access_token: doc.access_token,
          })
        ).data;
        return {
          created_timestamp: doc.created_timestamp,
          needs_attention: doc.needs_attention,
          item_id: doc.item_id,
          institution_id: accountsResponse.item.institution_id,
          accounts: accountsResponse.accounts,
        };
      })
    );
    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
