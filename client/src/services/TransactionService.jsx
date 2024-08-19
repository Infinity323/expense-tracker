import axios from "axios";

const TRANSACTION_API = "/api/transaction";

export const getTransactions = async () => {
  try {
    const response = await axios.get(TRANSACTION_API);
    return response.data;
  } catch (err) {}
};

export const postTransaction = async (transaction) => {
  try {
    const response = await axios.post(TRANSACTION_API, transaction);
    return response.data;
  } catch (err) {}
};

export const putTransaction = async (transactionDoc) => {
  try {
    const response = await axios.put(TRANSACTION_API, transactionDoc);
    return response.data;
  } catch (err) {}
};

export const syncTransactions = async (itemId, accessToken) => {
  try {
    const headers = {
      access_token: accessToken,
    };
    const response = await axios.put(`${TRANSACTION_API}/sync/${itemId}`, {
      headers: headers,
    });
    return response.data;
  } catch (err) {}
};

export const deleteTransaction = async (id, rev) => {
  try {
    const response = await axios.delete(`${TRANSACTION_API}/${id}/${rev}`);
    return response.data;
  } catch (err) {}
};
