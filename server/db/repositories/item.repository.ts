import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import db from "../database";
import {
  IGetCommandOutput,
  IQueryCommandOutput,
} from "../types/iCommandOutput";
import { ItemDoc } from "../types/itemDoc";

const TableName = "Items";

export const findAccessTokensByUserId = async (userId: string) => {
  const result = (await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-institutionId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression: "itemId, accessToken",
    })
  )) as IQueryCommandOutput<ItemDoc>;
  return result.Items;
};

export const findByInstitutionIdAndUserId = async (
  institutionId: string,
  userId: string
) => {
  const result = (await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-institutionId-index",
      KeyConditionExpression:
        "userId = :userId AND institutionId = :institutionId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":institutionId": institutionId,
      },
      Limit: 1,
    })
  )) as IQueryCommandOutput<ItemDoc>;
  return result.Items;
};

export const createItem = async ({
  itemId,
  accessToken,
  institutionId,
  institutionName,
  userId,
}: Partial<ItemDoc>) => {
  return await db.send(
    new PutCommand({
      TableName,
      Item: {
        itemId,
        userId,
        accessToken,
        institutionId,
        institutionName,
        createdTimestamp: new Date().toISOString(),
      },
    })
  );
};

export const findByUserId = async (userId: string) => {
  const result = (await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-institutionId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  )) as IQueryCommandOutput<ItemDoc>;
  return result.Items;
};

export const updateAccounts = async (itemId: string, accounts: any) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET accounts = :accounts, NeedsAttention = :needsAttention, updatedTimestamp = :updatedTimestamp",
      ExpressionAttributeValues: {
        ":accounts": accounts,
        ":needsAttention": false,
        ":updatedTimestamp": new Date().toISOString(),
      },
    })
  );
};

export const deleteById = async (itemId: string) => {
  return await db.send(
    new DeleteCommand({
      TableName,
      Key: {
        itemId,
      },
    })
  );
};

export const findTransactionCursorById = async (itemId: string) => {
  const result = (await db.send(
    new GetCommand({
      TableName,
      Key: { itemId },
      ProjectionExpression: "cursor",
    })
  )) as IGetCommandOutput<ItemDoc>;
  return result.Item.cursor;
};

export const updateItemTransactionCursor = async ({
  itemId,
  cursor,
}: {
  itemId: string;
  cursor: string;
}) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET cursor = :cursor, updatedTimestamp = :updatedTimestamp",
      ExpressionAttributeValues: {
        ":cursor": cursor,
        ":updatedTimestamp": new Date().toISOString(),
      },
    })
  );
};

export const updateNeedsAttentionById = async (
  itemId: string,
  needsAttention: boolean
) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET NeedsAttention = :needsAttention, updatedTimestamp = :updatedTimestamp",
      ExpressionAttributeValues: {
        ":needsAttention": needsAttention,
        ":updatedTimestamp": new Date().toISOString(),
      },
    })
  );
};
