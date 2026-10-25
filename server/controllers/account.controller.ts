import plaidClient from "../clients/plaidClient";
import {
  findByUserId,
  updateNeedsAttentionById,
} from "../db/repositories/item.repository";
import { AccountResponse } from "../types/accountResponse";
import { getUserId } from "../utils/authUtil";
import { logPlaidApiError } from "../utils/plaidLogging";

export const getAllAccounts = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const itemDocs = await findByUserId(userId);
    const accounts: AccountResponse[] = await Promise.all(
      itemDocs.map(async (doc) => {
        try {
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
        } catch (error) {
          const plaidError = error as {
            response?: { data?: { error_code?: string } };
          };
          if (plaidError.response?.data?.error_code !== "NO_ACCOUNTS") {
            throw error;
          }

          logPlaidApiError(error, {
            operation: "accountsGet",
            item_id: doc.itemId,
          });
          await updateNeedsAttentionById(doc.itemId, userId, true);
          return {
            created_timestamp: doc.createdTimestamp,
            needs_attention: true,
            item_id: doc.itemId,
            institution_id: doc.institutionId,
            accounts: [],
          };
        }
      }),
    );
    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
