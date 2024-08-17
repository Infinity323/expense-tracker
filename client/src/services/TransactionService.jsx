import axios from "axios";

export const getTransactions = async () => {
  try {
    const response = await axios.get("/api/transaction");
    return response.data;
  } catch (err) {}
};

export const syncTransactions = async (itemId, accessToken) => {
  try {
    const headers = {
      access_token: accessToken,
    };
    const response = await axios.get(`/api/transaction/sync/${itemId}`, {
      headers: headers,
    });
    return response.data;
  } catch (err) {}
};

export const deleteTransaction = async (id, rev) => {
  try {
    const response = await axios.delete(`/api/transaction/${id}/${rev}`);
    return response.data;
  } catch (err) {}
};
