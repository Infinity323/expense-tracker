const express = require("express");
const router = express.Router();
const {
  findAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../db/queries/budget");

router.get("/", async (req, res, next) => {
  try {
    const budgetDocs = await findAllBudgets();
    console.log(`Retrieved ${budgetDocs.length} budgets from the database`);
    if (req.query.sorted) {
      let budgetsMap = {};
      budgetDocs.forEach((doc) => {
        budgetsMap[doc.category] = budgetsMap[doc.category] || [];
        budgetsMap[doc.category].push(doc.subcategory);
      });
      res.json(budgetsMap);
    } else {
      res.json(budgetDocs);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await createBudget(req.body);
    console.log(`Successfully added new budget document ID [${response.id}]`);
    res.status(201).json(budgetDoc);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const response = await updateBudget(req.body);
    console.log(`Successfully updated budget document ID [${response.id}]`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/:rev", async (req, res, next) => {
  try {
    await deleteBudget(req.params);
    console.log(
      `Successfully deleted budget document with ID ${req.params.id} and rev ${req.params.rev}`
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
