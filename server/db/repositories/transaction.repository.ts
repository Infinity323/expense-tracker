import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { addDays, addMonths, format, startOfMonth } from "date-fns";
import db from "../database";
import { IUpdateCommandOutput } from "../types/iCommandOutput";
import { TransactionDoc } from "../types/transactionDoc";

const TableName = "Transactions";

export const findExpensesByUserId = async (userId: string) => {
  const result = await db.send(
    new ScanCommand({
      TableName,
      IndexName: "userId-category-index",
      FilterExpression: "category <> :category AND userId = :userId",
      ExpressionAttributeValues: {
        ":category": "Income",
        ":userId": userId,
      },
    })
  );
  return result.Items as TransactionDoc[];
};

export const findIncomeByUserId = async (userId: string) => {
  const result = await db.send(
    new ScanCommand({
      TableName,
      IndexName: "userId-category-index",
      FilterExpression: "category = :category AND userId = :userId",
      ExpressionAttributeValues: {
        ":category": "Income",
        ":userId": userId,
      },
    })
  );
  return result.Items as TransactionDoc[];
};

interface TransactionPageQuery {
  userId: string;
  limit: number;
  accountId: string;
  month?: string;
  cursor?: Record<string, any>;
}

export const findTransactionPage = async ({
  userId,
  limit,
  accountId,
  month,
  cursor,
}: TransactionPageQuery) => {
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {
    ":userId": userId,
  };
  const filters: string[] = [];
  let keyConditionExpression = "userId = :userId";

  if (month) {
    const monthStart = new Date(`${month}-01T00:00:00`);
    const monthEnd = format(addDays(addMonths(monthStart, 1), -1), "yyyy-MM-dd");
    keyConditionExpression += " AND #date BETWEEN :monthStart AND :monthEnd";
    expressionAttributeNames["#date"] = "date";
    expressionAttributeValues[":monthStart"] = format(monthStart, "yyyy-MM-dd");
    expressionAttributeValues[":monthEnd"] = monthEnd;
  }

  if (accountId === "manual") {
    expressionAttributeNames["#accountId"] = "accountId";
    filters.push("attribute_not_exists(#accountId)");
  } else if (accountId !== "all") {
    expressionAttributeNames["#accountId"] = "accountId";
    expressionAttributeValues[":accountId"] = accountId;
    filters.push("#accountId = :accountId");
  }

  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression: keyConditionExpression,
      ...(filters.length ? { FilterExpression: filters.join(" AND ") } : {}),
      ...(Object.keys(expressionAttributeNames).length
        ? { ExpressionAttributeNames: expressionAttributeNames }
        : {}),
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit,
      ExclusiveStartKey: cursor,
      ScanIndexForward: false,
    }),
  );
  return {
    items: (result.Items ?? []) as TransactionDoc[],
    lastEvaluatedKey: result.LastEvaluatedKey,
  };
};

export const findByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    }),
  );
  return result.Items as TransactionDoc[];
};

export const findByMonthAndUserId = async (userId: string, month: string) => {
  const monthStart = new Date(`${month}-01T00:00:00`);
  const monthEnd = format(addDays(addMonths(monthStart, 1), -1), "yyyy-MM-dd");
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression:
        "userId = :userId AND #dt BETWEEN :monthStart AND :monthEnd",
      ExpressionAttributeNames: {
        "#dt": "date",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":monthStart": format(monthStart, "yyyy-MM-dd"),
        ":monthEnd": monthEnd,
      },
      ScanIndexForward: false,
    }),
  );
  return result.Items as TransactionDoc[];
};

export const findByCurrentMonthAndUserId = async (userId: string) => {
  const firstDayOfMonth = startOfMonth(new Date());
  const formattedDate = format(firstDayOfMonth, "yyyy-MM-dd");
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression: "userId = :userId AND #dt >= :startDate",
      ExpressionAttributeNames: {
        "#dt": "date",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":startDate": formattedDate,
      },
      ScanIndexForward: false,
    })
  );
  return result.Items as TransactionDoc[];
};

export const createTransaction = async ({
  transactionId,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
  accountId,
  merchantName,
  merchantEntityId,
  pending,
  userId,
}: Partial<TransactionDoc>) => {
  const transaction = {
    transactionId: transactionId || randomUUID(),
    date,
    accountId,
    name,
    description,
    merchantName,
    merchantEntityId,
    pending,
    category,
    subcategory,
    amount,
    userId,
  } as TransactionDoc;
  await db.send(
    new PutCommand({
      TableName,
      Item: transaction,
    })
  );
  return transaction;
};

export const updateTransaction = async ({
  transactionId,
  date,
  name,
  description,
  category,
  subcategory,
  amount,
  pending,
  userId,
}: Partial<TransactionDoc>) => {
  const result = (await db.send(
    new UpdateCommand({
      TableName,
      Key: { transactionId },
      UpdateExpression:
        "SET #date = :date, #name = :name, #description = :description, #pending = :pending, #category = :category, #subcategory = :subcategory, #amount = :amount",
      ConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#date": "date",
        "#name": "name",
        "#description": "description",
        "#pending": "pending",
        "#category": "category",
        "#subcategory": "subcategory",
        "#amount": "amount",
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":name": name,
        ":description": description ?? "",
        ":pending": pending ?? false,
        ":category": category,
        ":subcategory": subcategory,
        ":amount": parseFloat(amount as any),
        ":userId": userId,
      },
      ReturnValues: "ALL_NEW",
    })
  )) as IUpdateCommandOutput<TransactionDoc>;
  return result.Attributes;
};

export const deleteById = async (
  transactionId: string,
  userId: string,
  ignoreMissing = false,
) => {
  try {
    return await db.send(
      new DeleteCommand({
        TableName,
        Key: { transactionId },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );
  } catch (error) {
    if (
      ignoreMissing &&
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return;
    }
    throw error;
  }
};

export const deleteByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression: "transactionId",
    })
  );
  let items = result.Items ?? [];
  let lastEvaluatedKey = result.LastEvaluatedKey;
  while (true) {
    for (const item of items) {
      await db.send(
        new DeleteCommand({
          TableName,
          Key: { transactionId: item.transactionId },
          ConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId },
        })
      );
    }

    if (!lastEvaluatedKey) break;
    const page = await db.send(
      new QueryCommand({
        TableName,
        IndexName: "userId-date-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
        ProjectionExpression: "transactionId",
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );
    items = page.Items ?? [];
    lastEvaluatedKey = page.LastEvaluatedKey;
  }
  return result.Items as TransactionDoc[];
};
