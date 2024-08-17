import axios from "axios";

export const getLinkToken = async () => {
  try {
    let userId = "test";
    const response = await axios.post(`/api/token/create_link_token/${userId}`);
    return response.data.link_token;
  } catch (err) {}
};

export const getAccessToken = async (publicToken) => {
  try {
    const data = {
      public_token: publicToken,
    };
    const response = await axios.post("/api/token/exchange_public_token", data);
    return response.data;
  } catch (err) {}
};
