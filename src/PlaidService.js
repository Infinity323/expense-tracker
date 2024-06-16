import axios from "axios";

export const getLinkToken = async () => {
  let userId = "test";
  console.log("Retrieving link token for user %s", userId);
  try {
    const response = await axios.post(`/api/create_link_token/${userId}`);
    console.log("Successfully retrieved link token for user %s", userId);
    return response.data.link_token;
  } catch (error) {
    console.error("Error while retrieving link token for user: %s", error);
    return undefined;
  }
};

export const getAccessToken = async (publicToken) => {
  console.log("Retrieving access token");
  try {
    const data = {
      public_token: publicToken,
    };
    const response = await axios.post("/api/exchange_public_token", data);
    console.log("Successfully retrieved access token");
    return response.data;
  } catch (error) {
    console.error("Error while retrieving access token: %s", error);
    return undefined;
  }
};
