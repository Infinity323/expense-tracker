import express from "express";
import {
  deleteItem,
  getAllItems,
  getBalances,
  updateItem,
} from "../controllers/item.controller";

const itemRouter = express.Router();

itemRouter.get("/", getAllItems);

itemRouter.route("/:id").put(updateItem).delete(deleteItem);

itemRouter.get("/balances", getBalances);

export default itemRouter;
