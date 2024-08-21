const express = require("express");
const { findAllTransactions } = require("../db/queries/transaction");
const router = express.Router();

const SUPPORTED_TIME_DIVISIONS = ["monthly", "quarterly", "annually"];

router.get("/spending/by-time", async (req, res, next) => {
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
    let result = {};
    let transactionDocs = await findAllTransactions();
    transactionDocs.forEach((transaction) => {
      let transactionDate = new Date(transaction.date);
      let timeKey = getTimeKey(division, transactionDate);
      if (groupBy == "subcategory") {
        result[timeKey] = result[timeKey] || {};
        result[timeKey][transaction.category] =
          result[timeKey][transaction.category] || {};
        result[timeKey][transaction.category][transaction.subcategory] =
          result[timeKey][transaction.category][transaction.subcategory] || 0;
        result[timeKey][transaction.category][transaction.subcategory] = round(
          result[timeKey][transaction.category][transaction.subcategory] +
            transaction.amount
        );
      } else if (groupBy == "category") {
        result[timeKey] = result[timeKey] || {};
        result[timeKey][transaction.category] =
          result[timeKey][transaction.category] || 0;
        result[timeKey][transaction.category] = round(
          result[timeKey][transaction.category] + transaction.amount
        );
      } else {
        result[timeKey] = result[timeKey] || 0;
        result[timeKey] = round(result[timeKey] + transaction.amount);
      }
    });
    res.json(result);
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

router.get("/spending/by-category", (req, res, next) => {});

const round = (amount) => {
  return parseFloat(amount.toFixed(2));
};

module.exports = router;
