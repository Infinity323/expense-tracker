const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const db = new PouchDB("/tmp/expense-tracker/db");

const createTypeIndex = async () => {
  await db.createIndex({
    index: { fields: ["type"] },
  });
};
createTypeIndex();

module.exports = db;
