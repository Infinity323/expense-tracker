import { Request } from "express";
import plaidClient from "../clients/plaidClient";
import {
  deleteById,
  findByIdAndUserId,
  findByUserId,
  updateAccounts,
} from "../db/repositories/item.repository";
import { getUserId } from "../utils/authUtil";

export const getAllItems = async (req, res, next) => {
  try {
    const itemDocs = await findByUserId(getUserId(req));
    res.json(
      itemDocs.map((item) => ({
        itemId: item.itemId,
        institutionId: item.institutionId,
        institutionName: item.institutionName,
        needsAttention: item.needsAttention,
        createdTimestamp: item.createdTimestamp,
      })),
    );
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request<{ id: string }>,
  res,
  next
) => {
  try {
    const userId = getUserId(req);
    const item = await findByIdAndUserId(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ error: "Linked item not found" });
    }
    const { data } = await plaidClient.accountsGet({
      access_token: item.accessToken,
    });
    await updateAccounts(req.params.id, userId, data.accounts);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (
  req: Request<{ id: string }, {}, {}>,
  res,
  next
) => {
  try {
    const userId = getUserId(req);
    const item = await findByIdAndUserId(req.params.id, userId);
    if (!item) {
      return res.status(404).json({ error: "Linked item not found" });
    }

    try {
      await plaidClient.itemRemove({ access_token: item.accessToken });
    } catch (err) {
      if (err.response?.data?.error_code !== "ITEM_NOT_FOUND") {
        throw err;
      }
    }

    await deleteById(req.params.id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
