const PouchDB = require("pouchdb");

const db = new PouchDB("/tmp/expense-tracker/db");

module.exports = db;
