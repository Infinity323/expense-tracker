import { TransactionDoc } from "@backend/db/types/transactionDoc";
import { delete_, get, post, put } from "./httpService";

const TRANSACTION_API = "/api/transaction";

export const getTransactions = async ({ queryKey }) => {
  const [, { month }] = queryKey;
  return await get<TransactionDoc[]>({
    uri: TRANSACTION_API,
    params: { month },
  });
};

export const postTransaction = async (transaction) => {
  return await post({ uri: TRANSACTION_API, data: transaction });
};

export const putTransaction = async (transactionDoc) => {
  return await put({ uri: TRANSACTION_API, data: transactionDoc });
};

export const syncTransactions = async (itemId, accessToken) =>
  await put({
    uri: `${TRANSACTION_API}/sync/${itemId}`,
    data: { access_token: accessToken },
  });

export const deleteTransaction = async (id) =>
  await delete_({ uri: `${TRANSACTION_API}/${id}` });
