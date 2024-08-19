const db = require("../database");

const ACCESS_TOKEN = "accessToken";

const findAllAccessTokens = async () => {
  const accessTokenDocs = await db.find({
    selector: {
      type: ACCESS_TOKEN,
    },
  });
  return accessTokenDocs.docs;
};

const createAccessToken = async ({ item_id, access_token }) => {
  return await db.post({
    type: ACCESS_TOKEN,
    itemId: item_id,
    accessToken: access_token,
  });
};

module.exports = { findAllAccessTokens, createAccessToken };
