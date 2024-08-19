const db = require("../database");

const LINK_METADATA = "linkMetadata";

const createLinkMetadata = async (metadata) => {
  return await db.post({
    type: LINK_METADATA,
    metadata: metadata,
  });
};

module.exports = { createLinkMetadata };
