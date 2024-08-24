const express = require("express");
const {
  findAllExpenses,
  findCurrentMonthTransactions,
  findAllIncome,
} = require("../db/queries/transaction");
const e = require("express");
const router = express.Router();

const SUPPORTED_TIME_DIVISIONS = ["monthly", "quarterly", "annually"];
const SUPPORTED_GROUP_BY = ["category", "subcategory"];

router.get("/spending/over-time", async (req, res, next) => {
  try {
    let division = req.query.division; // monthly, quarterly, annually
    if (!division) {
      const err = new Error("Time division is mandatory");
      err.status = 400;
      throw err;
    }
    if (!SUPPORTED_TIME_DIVISIONS.includes(division)) {
      const err = new Error("Time division not supported");
      err.status = 400;
      throw err;
    }
    let groupBy = req.query.groupBy; // category, subcategory
    let resultMap = {};
    let transactionDocs = await findAllExpenses();
    transactionDocs.forEach((transaction) => {
      let transactionDate = new Date(transaction.date);
      let timeKey = getTimeKey(division, transactionDate);
      if (groupBy == "subcategory") {
        resultMap[timeKey] = resultMap[timeKey] || {};
        resultMap[timeKey][transaction.category] =
          resultMap[timeKey][transaction.category] || {};
        resultMap[timeKey][transaction.category][transaction.subcategory] =
          resultMap[timeKey][transaction.category][transaction.subcategory] ||
          0;
        resultMap[timeKey][transaction.category][transaction.subcategory] =
          round(
            resultMap[timeKey][transaction.category][transaction.subcategory] +
              transaction.amount
          );
      } else if (groupBy == "category") {
        resultMap[timeKey] = resultMap[timeKey] || {};
        resultMap[timeKey][transaction.category] =
          resultMap[timeKey][transaction.category] || 0;
        resultMap[timeKey][transaction.category] = round(
          resultMap[timeKey][transaction.category] + transaction.amount
        );
      } else {
        resultMap[timeKey] = resultMap[timeKey] || 0;
        resultMap[timeKey] = round(resultMap[timeKey] + transaction.amount);
      }
    });
    // TODO: clean this up
    let resultArray = [];
    new Map(Object.entries(resultMap)).forEach((totals, date) => {
      let dateResult = {
        date: date,
      };
      new Map(Object.entries(totals)).forEach((total, category) => {
        dateResult[category] = total;
      });
      resultArray.push(dateResult);
    });
    res.json(resultArray);
  } catch (err) {
    next(err);
  }
});

const getTimeKey = (division, date) => {
  if (division == "monthly") {
    return Date.parse(new Date(date.getFullYear(), date.getMonth()));
  } else if (division == "quarterly") {
    let quarter = Math.floor((date.getMonth() + 3) / 3);
    let monthIndex = quarter * 3 - 3;
    return Date.parse(new Date(date.getFullYear(), monthIndex));
  } else if (division == "yearly") {
    return Date.parse(new Date(date.getFullYear(), 0));
  } else {
    return 0;
  }
};

router.get("/spending/by-category", async (req, res, next) => {
  try {
    let groupBy = req.query.groupBy; // category, subcategory
    if (!groupBy) {
      const err = new Error("Group by is mandatory");
      err.status = 400;
      throw err;
    }
    if (!SUPPORTED_GROUP_BY.includes(groupBy)) {
      const err = new Error("Group by not supported");
      err.status = 400;
      throw err;
    }
    let division = req.query.division; // monthly, quarterly, annually
    let resultMap = {};
    let transactionDocs = await findAllExpenses();
    transactionDocs.forEach((transaction) => {
      let transactionDate = new Date(transaction.date);
      let timeKey = getTimeKey(division, transactionDate);
      if (groupBy == "subcategory") {
        resultMap[transaction.category] = resultMap[transaction.category] || {};
        resultMap[transaction.category][transaction.subcategory] =
          resultMap[transaction.category][transaction.subcategory] || {};
        resultMap[transaction.category][transaction.subcategory][timeKey] =
          resultMap[transaction.category][transaction.subcategory][timeKey] ||
          0;
        resultMap[transaction.category][transaction.subcategory][timeKey] =
          round(
            resultMap[transaction.category][transaction.subcategory][timeKey] +
              transaction.amount
          );
      } else if (groupBy == "category") {
        resultMap[transaction.category] = resultMap[transaction.category] || {};
        resultMap[transaction.category][timeKey] =
          resultMap[transaction.category][timeKey] || 0;
        resultMap[transaction.category][timeKey] = round(
          resultMap[transaction.category][timeKey] + transaction.amount
        );
      } else {
        resultMap[timeKey] = resultMap[timeKey] || 0;
        resultMap[timeKey] = round(resultMap[timeKey] + transaction.amount);
      }
    });
    let resultArray = processByCategoryResults(resultMap, groupBy);
    res.json(resultArray);
  } catch (err) {
    next(err);
  }
});

const processByCategoryResults = (resultMap, groupBy) => {
  if (groupBy == "subcategory") {
    return Array.from(
      new Map(Object.entries(resultMap)),
      ([category, totals]) => ({
        category,
        totals: Array.from(
          new Map(Object.entries(totals)),
          ([subcategory, subtotals]) => ({
            subcategory,
            subtotals: Array.from(
              new Map(Object.entries(subtotals)),
              ([date, amount]) => ({
                date,
                amount,
              })
            ),
          })
        ),
      })
    );
  } else if (groupBy == "category") {
    return Array.from(
      new Map(Object.entries(resultMap)),
      ([category, totals]) => ({
        category,
        totals: Array.from(
          new Map(Object.entries(totals)),
          ([date, amount]) => ({
            date,
            amount,
          })
        ),
      })
    );
  } else {
    return [];
  }
};

router.get("/income-vs-expenses", async (req, res, next) => {
  try {
    // TODO: expand to not just monthly
    let income = await findAllIncome();
    let expenses = await findAllExpenses();
    let comparisonMap = {};
    income.forEach((transaction) => {
      let key = getTimeKey("monthly", new Date(transaction.date));
      comparisonMap[key] = comparisonMap[key] || {};
      comparisonMap[key]["income"] = comparisonMap[key]["income"] || 0;
      comparisonMap[key]["income"] -= transaction.amount;
      comparisonMap[key]["income"] = round(comparisonMap[key]["income"]);
    });
    expenses.forEach((transaction) => {
      let key = getTimeKey("monthly", new Date(transaction.date));
      comparisonMap[key] = comparisonMap[key] || {};
      comparisonMap[key]["expenses"] = comparisonMap[key]["expenses"] || 0;
      comparisonMap[key]["expenses"] += transaction.amount;
      comparisonMap[key]["expenses"] = round(comparisonMap[key]["expenses"]);
    });
    let results = [];
    new Map(Object.entries(comparisonMap)).forEach((totals, date) => {
      let dateResult = {
        date: date,
        Income: totals.income,
        Expenses: totals.expenses,
      };
      results.push(dateResult);
    });
    results.sort((a, b) => a.date - b.date);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

const round = (amount) => {
  return parseFloat(amount.toFixed(2));
};

module.exports = router;
