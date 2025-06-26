import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { addMonths, format, startOfMonth } from "date-fns";
import db from "../database";
import {
  IPutCommandOutput,
  IUpdateCommandOutput,
} from "../types/iCommandOutput";
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

export const findByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );
  return result.Items as TransactionDoc[];
};

export const findByMonthAndUserId = async (userId: string, month: string) => {
  const nextMonth = format(addMonths(new Date(month), 2), "yyyy-MM");
  const result = await db.send(
    new ScanCommand({
      TableName,
      IndexName: "userId-date-index",
      FilterExpression:
        "userId = :userId AND #dt >= :month AND #dt < :nextMonth",
      ExpressionAttributeNames: {
        "#dt": "date",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":month": month,
        ":nextMonth": nextMonth,
      },
    })
  );
  return result.Items as TransactionDoc[];
};

export const findByCurrentMonthAndUserId = async (userId: string) => {
  const firstDayOfMonth = startOfMonth(new Date());
  const formattedDate = format(firstDayOfMonth, "yyyy-MM-dd");
  const result = await db.send(
    new ScanCommand({
      TableName,
      IndexName: "userId-date-index",
      FilterExpression: "userId = :userId AND #dt >= :startDate",
      ExpressionAttributeNames: {
        "#dt": "date",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":startDate": formattedDate,
      },
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
  const result = (await db.send(
    new PutCommand({
      TableName,
      Item: {
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
      },
    })
  )) as IPutCommandOutput<TransactionDoc>;
  return result.Attributes;
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
}: Partial<TransactionDoc>) => {
  const result = (await db.send(
    new UpdateCommand({
      TableName,
      Key: { transactionId },
      UpdateExpression:
        "set date = :date, name = :name, description = :description, pending = :pending, category = :category, subcategory = :subcategory, amount = :amount",
      ExpressionAttributeNames: {
        date: "date",
        name: "name",
        description: "description",
        pending: "pending",
        category: "category",
        subcategory: "subcategory",
        amount: "amount",
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":name": name,
        ":description": description,
        ":pending": pending,
        ":category": category,
        ":subcategory": subcategory,
        ":amount": parseFloat(amount as any),
      },
      ReturnValues: "ALL_NEW",
    })
  )) as IUpdateCommandOutput<TransactionDoc>;
  return result.Attributes;
};

export const deleteById = async (transactionId: string) => {
  return await db.send(
    new DeleteCommand({
      TableName,
      Key: { transactionId },
    })
  );
};

export const deleteByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      IndexName: "userId-date-index",
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ProjectionExpression: "transactionId",
    })
  );
  if (result.Items) {
    for (const item of result.Items) {
      await db.send(
        new DeleteCommand({
          TableName,
          Key: { transactionId: item.transactionId },
        })
      );
    }
  }
  return result.Items as TransactionDoc[];
};
