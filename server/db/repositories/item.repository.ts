import { ScanCommand } from "@aws-sdk/client-dynamodb";
import db, { ddb } from "../database";
import { ItemDoc } from "../types/itemDoc";

const ITEM = "item";

export const findAllAccessTokens = async () => {
  const result = await ddb.send(
    new ScanCommand({
      TableName: "Items",
    })
  );
  return result.Items;
};

export const findByInstitutionId = async (institutionId) => {
  await db.createIndex({
    index: { fields: ["institution_id"] },
  });
  const itemDocs = await db.find({
    selector: {
      type: ITEM,
      institution_id: institutionId,
    },
  });
  return itemDocs.docs;
};

export const createItem = async ({
  item_id,
  access_token,
  institution_id,
  institution_name,
}) => {
  return await db.put<ItemDoc>({
    _id: item_id,
    type: ITEM,
    item_id,
    access_token,
    institution_id,
    institution_name,
    created_timestamp: new Date(),
  });
};

export const findAll = async () => {
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

export const updateItemNeedsAttention = async (
  itemId: string,
  needsAttention: boolean
) => {
  let itemDoc = await db.get<ItemDoc>(itemId);
  itemDoc.needs_attention = needsAttention;
  return await db.put(itemDoc);
};
