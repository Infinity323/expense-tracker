import express, { Request } from "express";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import {
  deleteItem,
  findAllItems,
  updateItem,
} from "../db/repositories/item.repository";

const itemRouter = express.Router();

/** Gets all item. */
itemRouter.get("/", async (req, res, next) => {
  try {
    const itemDocs = await findAllItems();
    console.log(`Retrieved ${itemDocs.length} items`);
    res.json(itemDocs);
  } catch (err) {
    next(err);
  }
});

/** Updates an item. */
itemRouter.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, PlaidLinkOnSuccessMetadata>,
    res,
    next
  ) => {
    try {
      await updateItem(req.params.id, req.body.accounts);
      console.log(`Updated item ${req.params.id}`);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

/** Deletes an item. */
itemRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, {}, {}>, res, next) => {
    try {
      await deleteItem(req.params.id);
      console.log(`Deleted item ${req.params.id}`);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default itemRouter;
