import axios from "axios";

const LINK_API = "/api/link";

export const getLinkToken = async () => {
  try {
    let userId = "test";
    const response = await axios.post(`${LINK_API}/link-token/${userId}`);
    return response.data.link_token;
  } catch (err) {}
};

export const getAccessTokens = async () => {
  try {
    const response = await axios.get(`${LINK_API}/access-token`);
    return response.data;
  } catch (err) {}
};

export const postAccessToken = async (publicToken) => {
  try {
    const data = {
      public_token: publicToken,
    };
    const response = await axios.post(`${LINK_API}/access-token`, data);
    return response.data;
  } catch (err) {}
};

export const saveAccessTokenToSession = (accessTokenDoc) => {
  let accessTokens = sessionStorage.getItem("accessTokens");
  accessTokens[accessTokenDoc.itemId] = accessTokenDoc.accessToken;
};

export const postLink = async (metadata) => {
  try {
    const response = await axios.post(LINK_API, metadata);
    return response.data;
  } catch (err) {}
};
