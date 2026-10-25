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

export const findByIdAndUserId = async (itemId: string, userId: string) => {
  const result = (await db.send(
    new GetCommand({
      TableName,
      Key: { itemId },
    })
  )) as IGetCommandOutput<ItemDoc>;
  return result.Item?.userId === userId ? result.Item : undefined;
};

export const updateAccounts = async (
  itemId: string,
  userId: string,
  accounts: any,
) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET accounts = :accounts, needsAttention = :needsAttention, updatedTimestamp = :updatedTimestamp",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":accounts": accounts,
        ":needsAttention": false,
        ":updatedTimestamp": new Date().toISOString(),
        ":userId": userId,
      },
    })
  );
};

export const deleteById = async (itemId: string, userId: string) => {
  return await db.send(
    new DeleteCommand({
      TableName,
      Key: {
        itemId,
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );
};

export const findTransactionCursorById = async (
  itemId: string,
  userId: string,
) => {
  const result = (await db.send(
    new GetCommand({
      TableName,
      Key: { itemId },
      ProjectionExpression: "transactionCursor, userId",
    })
  )) as IGetCommandOutput<ItemDoc>;
  if (result.Item?.userId !== userId) {
    const error = new Error("Item not found");
    Object.assign(error, { status: 404 });
    throw error;
  }
  return result.Item.transactionCursor;
};

export const updateItemTransactionCursor = async ({
  itemId,
  userId,
  transactionCursor,
}: {
  itemId: string;
  userId: string;
  transactionCursor: string;
}) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET transactionCursor = :transactionCursor, updatedTimestamp = :updatedTimestamp",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":transactionCursor": transactionCursor,
        ":updatedTimestamp": new Date().toISOString(),
        ":userId": userId,
      },
    })
  );
};

export const updateNeedsAttentionById = async (
  itemId: string,
  userId: string,
  needsAttention: boolean
) => {
  return await db.send(
    new UpdateCommand({
      TableName,
      Key: { itemId },
      UpdateExpression:
        "SET needsAttention = :needsAttention, updatedTimestamp = :updatedTimestamp",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":needsAttention": needsAttention,
        ":updatedTimestamp": new Date().toISOString(),
        ":userId": userId,
      },
    })
  );
};
