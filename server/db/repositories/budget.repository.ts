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

const queryBudgetsByUserId = async (
  userId: string,
  filterExpression?: string,
) => {
  const items: BudgetDoc[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await db.send(
      new QueryCommand({
        TableName,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :userId",
        ...(filterExpression ? { FilterExpression: filterExpression } : {}),
        ExpressionAttributeValues: { ":userId": userId },
        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );
    items.push(...((result.Items ?? []) as BudgetDoc[]));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return items;
};

// Find all budgets
export const findByUserId = async (userId: string) =>
  queryBudgetsByUserId(userId);

// Find all Plaid budgets
export const findAllPlaidBudgetsByUserId = async (userId: string) =>
  queryBudgetsByUserId(userId, "attribute_exists(detailed)");

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
}: Partial<BudgetDoc>, userId: string) => {
  const result = (await db.send(
    new UpdateCommand({
      TableName,
      Key: { budgetId },
      UpdateExpression: "SET category = :category, subcategory = :subcategory, amount = :amount",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":category": category,
        ":subcategory": subcategory,
        ":amount": amount,
        ":userId": userId,
      },
      ReturnValues: "ALL_NEW",
    })
  )) as IUpdateCommandOutput<BudgetDoc>;
  return result.Attributes;
};

// Delete a budget by budgetId
export const deleteById = async (budgetId: string, userId: string) => {
  return await db.send(
    new DeleteCommand({
      TableName,
      Key: { budgetId },
      ConditionExpression:
        "userId = :userId AND (attribute_not_exists(isMaster) OR isMaster = :isMaster)",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":isMaster": false,
      },
    })
  );
};

// Delete all budgets
export const deleteByUserId = async (userId: string) => {
  const budgetDocs = await queryBudgetsByUserId(userId);
  for (let index = 0; index < budgetDocs.length; index += 25) {
    await Promise.all(
      budgetDocs.slice(index, index + 25).map((doc) =>
        db.send(
          new DeleteCommand({
            TableName,
            Key: { budgetId: doc.budgetId },
            ConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": userId },
          }),
        ),
      ),
    );
  }
  return budgetDocs;
};
