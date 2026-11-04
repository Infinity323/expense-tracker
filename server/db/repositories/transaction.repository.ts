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
const NON_EXPENSE_CATEGORIES = ["Income", "Transfer In", "Transfer Out"];

export const isExpenseCategory = (category: string) =>
  !NON_EXPENSE_CATEGORIES.includes(category);

export const findExpensesByUserId = async (userId: string) => {
  const result = await db.send(
    new ScanCommand({
      TableName,
      IndexName: "userId-category-index",
      FilterExpression:
        "userId = :userId AND #category <> :income AND #category <> :transferIn AND #category <> :transferOut",
      ExpressionAttributeNames: {
        "#category": "category",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":income": "Income",
        ":transferIn": "Transfer In",
        ":transferOut": "Transfer Out",
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

export const findTagsByUserId = async (userId: string) => {
  const tags = new Set<string>();
  let cursor: Record<string, any> | undefined;

  do {
    const result = await db.send(
      new QueryCommand({
        TableName,
        IndexName: "userId-date-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ProjectionExpression: "#tags",
        ExpressionAttributeNames: {
          "#tags": "tags",
        },
        Limit: 100,
        ExclusiveStartKey: cursor,
      }),
    );
    for (const item of result.Items ?? []) {
      if (Array.isArray(item.tags)) {
        for (const tag of item.tags) {
          if (typeof tag === "string" && tag.trim()) tags.add(tag);
        }
      }
    }
    cursor = result.LastEvaluatedKey;
  } while (cursor);

  return [...tags].sort((a, b) => a.localeCompare(b));
};

interface TransactionPageQuery {
  userId: string;
  accountId: string;
  month?: string;
  tag?: string;
}

interface TransactionPageRequest extends TransactionPageQuery {
  limit: number;
  cursor?: Record<string, any>;
}

const buildTransactionQuery = ({
  userId,
  accountId,
  month,
  tag,
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

  if (tag) {
    expressionAttributeNames["#tags"] = "tags";
    expressionAttributeValues[":tag"] = tag;
    filters.push("contains(#tags, :tag)");
  }

  return {
    keyConditionExpression,
    expressionAttributeNames,
    expressionAttributeValues,
    filters,
  };
};

export const findTransactionPage = async ({
  limit,
  cursor,
  ...query
}: TransactionPageRequest) => {
  const {
    keyConditionExpression,
    expressionAttributeNames,
    expressionAttributeValues,
    filters,
  } = buildTransactionQuery(query);
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

export const findTransactionSummary = async (query: TransactionPageQuery) => {
  const {
    keyConditionExpression,
    expressionAttributeNames,
    expressionAttributeValues,
    filters,
  } = buildTransactionQuery(query);
  const names = { ...expressionAttributeNames, "#amount": "amount" };
  let cursor: Record<string, any> | undefined;
  let count = 0;
  let totalCents = 0;

  do {
    const result = await db.send(
      new QueryCommand({
        TableName,
        IndexName: "userId-date-index",
        KeyConditionExpression: keyConditionExpression,
        ...(filters.length ? { FilterExpression: filters.join(" AND ") } : {}),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: expressionAttributeValues,
        ProjectionExpression: "#amount",
        Select: "SPECIFIC_ATTRIBUTES",
        Limit: 100,
        ExclusiveStartKey: cursor,
        ScanIndexForward: false,
      }),
    );
    for (const item of result.Items ?? []) {
      count += 1;
      if (typeof item.amount === "number") {
        totalCents += Math.round(item.amount * 100);
      }
    }
    cursor = result.LastEvaluatedKey;
  } while (cursor);

  return { count, total: totalCents / 100 };
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
  tags,
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
    tags: tags ?? [],
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
  tags,
  amount,
  pending,
  userId,
}: Partial<TransactionDoc>) => {
  const expressionAttributeNames: Record<string, string> = {
    "#date": "date",
    "#name": "name",
    "#description": "description",
    "#pending": "pending",
    "#category": "category",
    "#subcategory": "subcategory",
    "#categoryManuallyOverridden": "categoryManuallyOverridden",
    "#amount": "amount",
    "#userId": "userId",
  };
  const expressionAttributeValues: Record<string, any> = {
    ":date": date,
    ":name": name,
    ":description": description ?? "",
    ":pending": pending ?? false,
    ":category": category,
    ":subcategory": subcategory,
    ":categoryManuallyOverridden": true,
    ":amount": parseFloat(amount as any),
    ":userId": userId,
  };
  let updateExpression =
    "SET #date = :date, #name = :name, #description = :description, #pending = :pending, #category = :category, #subcategory = :subcategory, #categoryManuallyOverridden = :categoryManuallyOverridden, #amount = :amount";
  if (tags !== undefined) {
    expressionAttributeNames["#tags"] = "tags";
    expressionAttributeValues[":tags"] = tags;
    updateExpression += ", #tags = :tags";
  }

  const result = (await db.send(
    new UpdateCommand({
      TableName,
      Key: { transactionId },
      UpdateExpression: updateExpression,
      ConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })
  )) as IUpdateCommandOutput<TransactionDoc>;
  return result.Attributes;
};

export const updateSyncedTransaction = async ({
  transactionId,
  date,
  name,
  amount,
  pending,
  userId,
}: Partial<TransactionDoc>) => {
  const result = await db.send(
    new UpdateCommand({
      TableName,
      Key: { transactionId },
      UpdateExpression:
        "SET #date = :date, #name = :name, #pending = :pending, #amount = :amount",
      ConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#date": "date",
        "#name": "name",
        "#pending": "pending",
        "#amount": "amount",
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":name": name,
        ":pending": pending ?? false,
        ":amount": parseFloat(amount as any),
        ":userId": userId,
      },
      ReturnValues: "ALL_NEW",
    }),
  );
  return result.Attributes as TransactionDoc | undefined;
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
