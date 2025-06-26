import { Request } from "express";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import {
  deleteById,
  findByUserId,
  updateAccounts,
} from "../db/repositories/item.repository";
import { getUserId } from "../utils/authUtil";

export const getAllItems = async (req, res, next) => {
  try {
    const itemDocs = await findByUserId(getUserId(req));
    console.log(`Retrieved ${itemDocs.length} items`);
    res.json(itemDocs);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request<{ id: string }, {}, PlaidLinkOnSuccessMetadata>,
  res,
  next
) => {
  try {
    await updateAccounts(req.params.id, req.body.accounts);
    console.log(`Updated item ${req.params.id}`);
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
    await deleteById(req.params.id);
    console.log(`Deleted item ${req.params.id}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
