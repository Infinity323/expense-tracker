import db from "../database";
import { ItemDoc } from "../types/itemDoc";

const ITEM = "item";

export const findAllAccessTokens = async () => {
  const itemDocs = await db.find({
    selector: {
      type: ITEM,
    },
    fields: ["item_id", "access_token"],
  });
  return itemDocs.docs as ItemDoc[];
};

export const createItem = async (item_id, access_token, accounts) => {
  return await db.put<ItemDoc>({
    _id: item_id,
    type: ITEM,
    item_id: item_id,
    access_token: access_token,
    accounts: accounts,
    created_timestamp: new Date(),
  });
};

export const findAll = async () => {
  // TODO: return institution info
  const itemDocs = await db.find({
    selector: {
      type: ITEM,
    },
  });
  return itemDocs.docs as ItemDoc[];
};

export const updateAccounts = async (item_id, accounts) => {
  const itemDoc = await db.get<ItemDoc>(item_id);
  return await db.put<ItemDoc>({
    ...itemDoc,
    needs_attention: false,
    accounts,
  });
};

export const deleteById = async (id) => {
  const itemDoc = await db.get<ItemDoc>(id);
  return await db.remove({ _id: id, _rev: itemDoc._rev });
};

export const findItemTransactionCursor = async (itemId) => {
  const itemDoc = await db.get<{ cursor: string }>(itemId);
  return itemDoc.cursor;
};

export const updateItemTransactionCursor = async ({ itemId, cursor }) => {
  let itemDoc = await db.get(itemId);
  itemDoc["cursor"] = cursor;
  return await db.put(itemDoc);
};

export const updateItemNeedsAttention = async (itemId, needsAttention) => {
  let itemDoc = await db.get(itemId);
  itemDoc["needs_attention"] = needsAttention;
  return await db.put(itemDoc);
};
