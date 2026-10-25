import { NextFunction, Request, Response } from "express";
import { RemovedTransaction, Transaction } from "plaid";
import plaidClient from "../clients/plaidClient";
import { findAllPlaidBudgetsByUserId } from "../db/repositories/budget.repository";
import {
  findByIdAndUserId,
} from "../db/repositories/item.repository";
import {
  findTransactionCursorById,
  updateItemTransactionCursor,
  updateNeedsAttentionById,
} from "../db/repositories/item.repository";
import {
  createTransaction,
  deleteById,
  deleteByUserId,
  findTransactionPage,
  updateTransaction,
} from "../db/repositories/transaction.repository";
import { getUserId } from "../utils/authUtil";

const isValidTransaction = (body: any, requireId = false) => {
  const date = body?.date;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date &&
    typeof body.name === "string" &&
    body.name.trim().length > 0 &&
    typeof body.category === "string" &&
    body.category.trim().length > 0 &&
    typeof body.subcategory === "string" &&
    body.subcategory.trim().length > 0 &&
    (typeof body.amount === "number" ||
      (typeof body.amount === "string" && body.amount.trim().length > 0)) &&
    Number.isFinite(Number(body.amount)) &&
    (!requireId || typeof body.transactionId === "string")
  );
};

export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: "Month must use YYYY-MM format" });
    }
    const accountId =
      typeof req.query.accountId === "string" ? req.query.accountId : "all";
    const cursorToken =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    let cursor: Record<string, any> | undefined;

    if (cursorToken) {
      try {
        if (cursorToken.length > 8192) throw new Error("Cursor is too large");
        const parsedCursor = JSON.parse(
          Buffer.from(cursorToken, "base64url").toString("utf8"),
        );
        if (
          parsedCursor.userId !== userId ||
          parsedCursor.month !== (month ?? null) ||
          parsedCursor.accountId !== accountId ||
          !parsedCursor.key ||
          parsedCursor.key.userId !== userId
        ) {
          throw new Error("Cursor does not match this query");
        }
        cursor = parsedCursor.key;
      } catch {
        return res.status(400).json({ error: "Invalid transaction cursor" });
      }
    }

    const page = await findTransactionPage({
      userId,
      limit: 50,
      accountId,
      month,
      cursor,
    });
    const nextCursor = page.lastEvaluatedKey
      ? Buffer.from(
          JSON.stringify({
            userId,
            month: month ?? null,
            accountId,
            key: page.lastEvaluatedKey,
          }),
        ).toString("base64url")
      : null;
    res.json({ items: page.items, nextCursor });
  } catch (err) {
    next(err);
  }
};

export const addTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidTransaction(req.body)) {
      return res.status(400).json({ error: "Invalid transaction details" });
    }
    const response = await createTransaction({
      date: req.body.date,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: req.body.amount,
      userId: getUserId(req),
    });
    console.log(
      `Successfully added new transaction document ID [${response.transactionId}]`
    );
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const putTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidTransaction(req.body, true)) {
      return res.status(400).json({ error: "Invalid transaction details" });
    }
    await updateTransaction({
      transactionId: req.body.transactionId,
      date: req.body.date,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subcategory: req.body.subcategory,
      amount: req.body.amount,
      userId: getUserId(req),
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const deleted = await deleteByUserId(userId);
    console.log(`Successfully deleted all ${deleted.length} transactions`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteById(req.params.id, getUserId(req));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const syncTransactions = async (
  req: Request<{ itemId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const itemId = req.params.itemId;
  const userId = getUserId(req);
  try {
    const item = await findByIdAndUserId(itemId, userId);
    if (!item) {
      return res.status(404).json({ error: "Linked item not found" });
    }
    let transactionCursor = (await findTransactionCursorById(itemId, userId)) ?? "";
    let added: Transaction[] = [];
    let modified: Transaction[] = [];
    let removed: RemovedTransaction[] = [];
    let hasMore = true;
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: item.accessToken,
        cursor: transactionCursor || undefined,
      });
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      transactionCursor = data.next_cursor;
    }

    const plaidBudgetDocs = await findAllPlaidBudgetsByUserId(userId);
    const plaidBudgetMap = plaidBudgetDocs.reduce<
      Record<string, { category: string; subcategory: string }>
    >(
      (map, doc) => (
        (map[doc.detailed] = {
          category: doc.category,
          subcategory: doc.subcategory,
        }),
        map
      ),
      {}
    );
    const getBudget = (transaction: Transaction) => {
      const detailedCategory = transaction.personal_finance_category?.detailed;
      if (detailedCategory && plaidBudgetMap[detailedCategory]) {
        return plaidBudgetMap[detailedCategory];
      }
      return { category: "Other", subcategory: "Other" };
    };

    for (const transaction of added) {
      const budget = getBudget(transaction);
      await createTransaction({
        transactionId: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        category: budget.category,
        subcategory: budget.subcategory,
        amount: transaction.amount,
        accountId: transaction.account_id,
        merchantName: transaction.merchant_name ?? undefined,
        merchantEntityId: transaction.merchant_entity_id ?? undefined,
        pending: transaction.pending,
        userId,
      });
    }
    console.log(`Added ${added.length} transactions for item ${itemId}`);
    for (const transaction of modified) {
      const budget = getBudget(transaction);
      await updateTransaction({
        transactionId: transaction.transaction_id,
        date: transaction.date,
        name: transaction.name,
        category: budget.category,
        subcategory: budget.subcategory,
        amount: transaction.amount,
        pending: transaction.pending,
        userId,
      });
    }
    console.log(`Updated ${modified.length} transactions for item ${itemId}`);

    for (const transaction of removed) {
      await deleteById(transaction.transaction_id, userId, true);
    }

    await updateItemTransactionCursor({ itemId, userId, transactionCursor });
    await updateNeedsAttentionById(itemId, userId, false);
    console.log(`Successfully synced transactions for item [${itemId}]`);
    res.json(added);
  } catch (err) {
    const plaidError = err as {
      response?: { data?: { error_code?: string } };
    };
    if (plaidError.response?.data) {
      console.error(
        `Error while syncing transactions for item [${itemId}]; ${JSON.stringify(
          { error_code: plaidError.response.data.error_code }
        )}`
      );
      try {
        await updateNeedsAttentionById(itemId, userId, true);
      } catch (attentionError) {
        console.error(
          `Could not mark item [${itemId}] as needing attention`,
          attentionError,
        );
      }
    }
    next(err);
  }
};
