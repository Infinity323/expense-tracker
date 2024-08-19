const express = require("express");
const router = express.Router();
const db = require("../middleware/database");

router.get("/", async (req, res, next) => {
  try {
    await db.createIndex({
      index: { fields: ["type"] },
    });
    await db.createIndex({
      index: { fields: ["category"] },
    });
    await db.createIndex({
      index: { fields: ["subcategory"] },
    });
    let budgetDocs = await db.find({
      selector: {
        type: "budget",
        category: { $exists: true },
        subcategory: { $exists: true },
      },
      sort: [{ category: "asc", subcategory: "asc" }],
    });
    console.log(
      `Retrieved ${budgetDocs.docs.length} budgets from the database`
    );
    if (req.query.sorted) {
      let budgetsMap = {};
      budgetDocs.docs.forEach((doc) => {
        budgetsMap[doc.category] = budgetsMap[doc.category] || [];
        budgetsMap[doc.category].push(doc.subcategory);
      });
      res.json(budgetsMap);
    } else {
      res.json(budgetDocs.docs);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let budgetDoc = {
      _id: crypto.randomUUID(),
      type: "budget",
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: parseFloat(req.body.amount),
    };
    await db.put(budgetDoc);
    console.log(
      `Successfully added new budget document: ${JSON.stringify(budgetDoc)}`
    );
    res.status(201).json(budgetDoc);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    let budgetDoc = {
      _id: req.body._id,
      _rev: req.body._rev,
      type: "budget",
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: parseFloat(req.body.amount),
    };
    await db.put(budgetDoc);
    console.log(
      `Successfully updated budget document: ${JSON.stringify(budgetDoc)}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/:rev", async (req, res, next) => {
  try {
    await db.remove({ _id: req.params.id, _rev: req.params.rev });
    console.log(
      `Successfully deleted budget document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
