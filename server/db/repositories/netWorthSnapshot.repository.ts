import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import db from "../database";
import { NetWorthSnapshot } from "../../types/netWorthSnapshot";

const TableName = "NetWorthSnapshots";

export const saveNetWorthSnapshot = async (
  snapshot: NetWorthSnapshot,
) => {
  await db.send(
    new PutCommand({
      TableName,
      Item: snapshot,
    }),
  );
};

export const findNetWorthSnapshotsByUserId = async (userId: string) => {
  const result = await db.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: true,
    }),
  );
  return (result.Items ?? []) as NetWorthSnapshot[];
};
