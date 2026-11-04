import { TransactionDoc } from "@backend/db/types/transactionDoc";
import { delete_, get, post, put } from "./httpService";

const TRANSACTION_API = "/api/transaction";

export interface TransactionPage {
  items: TransactionDoc[];
  nextCursor: string | null;
  summary?: {
    count: number;
    total: number;
  };
}

export const getTransactions = async ({ queryKey, pageParam }: any) => {
  const [, { month, accountId, tag }] = queryKey;
  return await get<TransactionPage>({
    uri: TRANSACTION_API,
    params: { month, accountId, tag, cursor: pageParam },
  });
};

export const getTransactionTags = async (): Promise<string[]> => {
  const response = await get<{ tags: string[] }>({
    uri: `${TRANSACTION_API}/tags`,
  });
  return response.tags;
};

export const postTransaction = async (transaction) => {
  return await post({
    uri: TRANSACTION_API,
    data: transaction,
  });
};

export const putTransaction = async (transactionDoc) => {
  return await put({
    uri: TRANSACTION_API,
    data: transactionDoc,
  });
};

export const syncTransactions = async (itemId: string) =>
  await put({
    uri: `${TRANSACTION_API}/sync/${itemId}`,
  });

export const deleteTransaction = async (id) =>
  await delete_({ uri: `${TRANSACTION_API}/${id}` });
