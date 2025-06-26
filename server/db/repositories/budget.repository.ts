import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DeleteCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import db from "../database";
import { BudgetDoc } from "../types/budgetDoc";
import {
  IPutCommandOutput,
  IUpdateCommandOutput,
} from "../types/iCommandOutput";
import { sleep } from "../../utils/dataUtil";
const TableName = "Budgets";

// Find all budgets
export const findByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    })
  );
  return result.Items as BudgetDoc[];
};

// Find all Plaid budgets
export const findAllPlaidBudgetsByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: "attribute_exists(detailed)",
      ExpressionAttributeValues: { ":userId": userId },
    })
  );
  return result.Items as BudgetDoc[];
};

// Create a new budget
export const create = async ({
  primary,
  detailed,
  description,
  category,
  subcategory,
  amount,
  isMaster,
  userId,
}: Partial<BudgetDoc>) => {
  const result = (await db.send(
    new PutCommand({
      TableName,
      Item: {
        budgetId: randomUUID(),
        primary,
        detailed,
        description,
        category,
        subcategory,
        amount,
        isMaster,
        userId,
      },
    })
  )) as IPutCommandOutput<BudgetDoc>;
  return result.Attributes;
};

export const batchCreate = async (
  budgets: Partial<BudgetDoc>[],
  maxRetries = 5
) => {
  const items = budgets.map((budget) => ({
    PutRequest: {
      Item: {
        ...budget,
        budgetId: budget.budgetId || randomUUID(),
      },
    },
  }));

  let unprocessed = [...items];
  let retries = 0;

  while (unprocessed.length > 0) {
    const batchItems = unprocessed.slice(0, 25); // DynamoDB batch write limit
    let batchUnprocessed = batchItems;
    retries = 0;

    while (batchUnprocessed.length > 0 && retries < maxRetries) {
      const batch: BatchWriteCommandInput = {
        RequestItems: {
          [TableName]: batchUnprocessed,
        },
      };

      try {
        const result = await db.send(new BatchWriteCommand(batch));
        batchUnprocessed = (result.UnprocessedItems?.[TableName] ||
          []) as any[];
        if (batchUnprocessed.length > 0) {
          await sleep(2 ** retries * 100); // Exponential backoff
          retries++;
        }
      } catch (err: any) {
        if (
          err.name === "ProvisionedThroughputExceededException" ||
          err.name === "ThrottlingException"
        ) {
          await sleep(2 ** retries * 100);
          retries++;
        } else {
          throw err;
        }
      }
    }

    if (batchUnprocessed.length > 0) {
      throw new Error("Some items could not be processed after retries.");
    }

    unprocessed = unprocessed.slice(25);
  }

  if (unprocessed.length > 0) {
    throw new Error("Some items could not be processed after retries.");
  }
};

// Update a budget
export const update = async ({
  budgetId,
  category,
  subcategory,
  amount,
}: Partial<BudgetDoc>) => {
  const result = (await db.send(
    new UpdateCommand({
      TableName,
      Key: { budgetId },
      UpdateExpression:
        "set category = :category, subcategory = :subcategory, amount = :amount",
      ExpressionAttributeValues: {
        ":category": category,
        ":subcategory": subcategory,
        ":amount": amount,
      },
    })
  )) as IUpdateCommandOutput<BudgetDoc>;
  return result.Attributes;
};

// Delete a budget by budgetId
export const deleteById = async (budgetId: string) => {
  return await db.send(
    new DeleteCommand({
      TableName,
      Key: { budgetId },
    })
  );
};

// Delete all budgets
export const deleteByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    })
  );
  if (result.Items && result.Items.length > 0) {
    await Promise.all(
      result.Items.map((doc) =>
        db.send(
          new DeleteCommand({
            TableName,
            Key: { budgetId: doc.budgetId },
          })
        )
      )
    );
  }
  return result.Items as BudgetDoc[];
};
