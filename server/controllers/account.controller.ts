import plaidClient from "../clients/plaidClient";
import {
  findByUserId,
  updateNeedsAttentionById,
} from "../db/repositories/item.repository";
import { saveNetWorthSnapshot } from "../db/repositories/netWorthSnapshot.repository";
import { AccountResponse } from "../types/accountResponse";
import { getUserId } from "../utils/authUtil";
import { logPlaidApiError } from "../utils/plaidLogging";

export const getAllAccounts = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const itemDocs = await findByUserId(userId);
    const accountResults = await Promise.all(
      itemDocs.map(async (doc) => {
        try {
          const accountsResponse = (
            await plaidClient.accountsGet({
              access_token: doc.accessToken,
            })
          ).data;
          const accountResponse: AccountResponse = {
            created_timestamp: doc.createdTimestamp,
            needs_attention: doc.needsAttention,
            item_id: doc.itemId,
            institution_id: accountsResponse.item.institution_id,
            accounts: accountsResponse.accounts,
          };
          return {
            account: accountResponse,
            isComplete: !doc.needsAttention,
          };
        } catch (error) {
          const plaidError = error as {
            response?: { data?: { error_code?: string } };
          };
          const errorCode = plaidError.response?.data?.error_code;
          if (
            errorCode !== "NO_ACCOUNTS" &&
            errorCode !== "ITEM_LOGIN_REQUIRED"
          ) {
            throw error;
          }

          logPlaidApiError(error, {
            operation: "accountsGet",
            item_id: doc.itemId,
          });
          await updateNeedsAttentionById(doc.itemId, userId, true);
          return {
            account: {
              created_timestamp: doc.createdTimestamp,
              needs_attention: true,
              item_id: doc.itemId,
              institution_id: doc.institutionId,
              accounts: [],
            },
            isComplete: false,
          };
        }
      }),
    );
    const accounts: AccountResponse[] = accountResults.map(
      ({ account }) => account,
    );

    if (accountResults.every(({ isComplete }) => isComplete)) {
      const currentAccounts = accounts.flatMap((item) => item.accounts);
      const assets = currentAccounts
        .filter(
          (account) =>
            account.type === "depository" ||
            account.type === "investment" ||
            account.type === "brokerage",
        )
        .reduce((total, account) => total + (account.balances.current ?? 0), 0);
      const liabilities = currentAccounts
        .filter(
          (account) => account.type === "credit" || account.type === "loan",
        )
        .reduce((total, account) => total + (account.balances.current ?? 0), 0);
      const capturedAt = new Date().toISOString();

      await saveNetWorthSnapshot({
        userId,
        snapshotDate: capturedAt.slice(0, 10),
        netWorth: assets - liabilities,
        assets,
        liabilities,
        capturedAt,
      });
    }

    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
