import { TransactionDoc } from "@backend/db/types/transactionDoc";
import { delete_, get, post, put } from "./httpService";

const TRANSACTION_API = "/api/transaction";

export interface TransactionPage {
  items: TransactionDoc[];
  nextCursor: string | null;
}

export const getTransactions = async ({ queryKey, pageParam }: any) => {
  const [, { month, accountId }] = queryKey;
  return await get<TransactionPage>({
    uri: TRANSACTION_API,
    params: { month, accountId, cursor: pageParam },
  });
};

export const postTransaction = async (transaction) => {
  return await post({ uri: TRANSACTION_API, data: transaction });
};

export const putTransaction = async (transactionDoc) => {
  return await put({ uri: TRANSACTION_API, data: transactionDoc });
};

export const syncTransactions = async (itemId: string) =>
  await put({
    uri: `${TRANSACTION_API}/sync/${itemId}`,
  });

export const deleteTransaction = async (id) =>
  await delete_({ uri: `${TRANSACTION_API}/${id}` });
