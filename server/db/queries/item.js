const db = require("../database");

const ITEM = "item";

const findAllAccessTokens = async () => {
  const itemDocs = await db.find({
    selector: {
      type: ITEM,
    },
    fields: ["item_id", "access_token"],
  });
  return itemDocs.docs;
};

const createItem = async (item_id, access_token, accounts) => {
  return await db.put({
    _id: item_id,
    type: ITEM,
    item_id: item_id,
    access_token: access_token,
    accounts: accounts,
    created_timestamp: new Date(),
  });
};

const findItemTransactionCursor = async (itemId) => {
  const itemDoc = await db.get(itemId);
  return itemDoc.cursor;
};

const updateItemTransactionCursor = async ({ itemId, cursor }) => {
  let itemDoc = await db.get(itemId);
  itemDoc["cursor"] = cursor;
  return await db.put(itemDoc);
};

const findAllAccounts = async () => {
  const itemDocs = await db.find({
    selector: {
      type: ITEM,
    },
    fields: ["accounts", "created_timestamp"],
  });
  return itemDocs.docs;
};

module.exports = {
  findAllAccessTokens,
  createItem,
  findItemTransactionCursor,
  updateItemTransactionCursor,
  findAllAccounts,
};
