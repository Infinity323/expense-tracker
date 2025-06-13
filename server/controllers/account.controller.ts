import { findAll } from "../db/repositories/item.repository";
import { AccountResponse } from "../types/accountResponse";

export const getAllAccounts = async (req, res, next) => {
  try {
    const itemDocs = await findAll();
    const accounts: AccountResponse[] = itemDocs.flatMap((doc) =>
      doc?.accounts.map((account) => {
        const response: AccountResponse = {
          ...account,
          created_timestamp: doc?.created_timestamp,
          needs_attention: doc?.needs_attention,
          item_id: doc?.item_id,
        };
        return response;
      })
    );
    console.log(`Retrieved ${accounts.length} accounts from the database`);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
