import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";

PouchDB.plugin(PouchFind);

const db = new PouchDB("/tmp/expense-tracker/db");

const createTypeIndex = async () => {
  await db.createIndex({
    index: { fields: ["type"] },
  });
};
createTypeIndex();

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ddb = new DynamoDBClient({ region: "us-east-2" });

export default db;
