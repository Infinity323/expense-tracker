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

const createAccessToken = async (itemId, accessToken) => {
  return await db.post({
    type: ACCESS_TOKEN,
    itemId: itemId,
    accessToken: accessToken,
  });
};

module.exports = { findAllAccessTokens, createAccessToken };
