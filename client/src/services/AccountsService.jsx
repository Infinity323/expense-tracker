import axios from "axios";

const ACCOUNT_API = "/api/account";

export const getAccounts = async () => {
  try {
    const response = await axios.get(ACCOUNT_API);
    return response.data;
  } catch (err) {}
};
