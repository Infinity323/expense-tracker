import axios from "axios";

const TRANSACTION_API = "/api/transaction";

export const getTransactions = async () => {
  const response = await axios.get(TRANSACTION_API);
  return response.data;
};

export const postTransaction = async (transaction) => {
  const response = await axios.post(TRANSACTION_API, transaction);
  return response.data;
};

export const putTransaction = async (transactionDoc) => {
  const response = await axios.put(TRANSACTION_API, transactionDoc);
  return response.data;
};

export const syncTransactions = async (itemId, accessToken) => {
  const headers = {
    access_token: accessToken,
  };
  const response = await axios.put(`${TRANSACTION_API}/sync/${itemId}`, {
    headers: headers,
  });
  return response.data;
};

export const deleteTransaction = async (id, rev) => {
  const response = await axios.delete(`${TRANSACTION_API}/${id}/${rev}`);
  return response.data;
};
