import plaidClient from "../clients/plaidClient";
import { findByUserId } from "../db/repositories/item.repository";
import { AccountResponse } from "../types/accountResponse";
import { getUserId } from "../utils/authUtil";

export const getAllAccounts = async (req, res, next) => {
  try {
    const itemDocs = await findByUserId(getUserId(req));
    const accounts: AccountResponse[] = await Promise.all(
      itemDocs.map(async (doc) => {
        const accountsResponse = (
          await plaidClient.accountsGet({
            access_token: doc.accessToken,
          })
        ).data;
        return {
          created_timestamp: doc.createdTimestamp,
          needs_attention: doc.needsAttention,
          item_id: doc.itemId,
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
