import axios from "axios";

const LINK_API = "/api/link";

export const getLinkToken = async () => {
  let userId = "test";
  const response = await axios.post(`${LINK_API}/link-token/${userId}`);
  return response.data.link_token;
};

export const getAccessTokens = async () => {
  const response = await axios.get(`${LINK_API}/access-token`);
  return response.data;
};

export const postAccessToken = async (publicToken) => {
  const data = {
    public_token: publicToken,
  };
  const response = await axios.post(`${LINK_API}/access-token`, data);
  return response.data;
};

export const saveAccessTokenToSession = (accessTokenResponse) => {
  let accessTokens = JSON.parse(sessionStorage.getItem("accessTokens"));
  accessTokens.push({
    itemId: accessTokenResponse.itemId,
    accessToken: accessTokenResponse.accessToken,
  });
  sessionStorage.setItem("accessTokens", JSON.stringify(accessTokens));
};

export const postLink = async (metadata) => {
  const response = await axios.post(LINK_API, metadata);
  return response.data;
};
