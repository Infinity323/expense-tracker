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

export default db;
