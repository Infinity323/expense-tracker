import db from "../database";

const LINK_METADATA = "linkMetadata";

export const createLinkMetadata = async (metadata) => {
  return await db.post({
    type: LINK_METADATA,
    metadata: metadata,
  });
};
